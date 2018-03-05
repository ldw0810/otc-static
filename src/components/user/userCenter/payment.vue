<template>
  <div id="content">
    <BreadCrumb
        :breadcrumbText='breadcrumbText'
    />
    <div class="payment_none" v-if="!collection.length">
      <div class="img" @click="popUpStatus = true">
        <img src="../../../static/images/+.png">
      </div>
      <div class="text_1" v-text="$t('user.add_payment_link_none')"></div>
      <div class="text_2" v-text="$t('user.default_receivables_info')"></div>
    </div>
    <div class="payment" v-else>
      <RadioGroup class='payment-list' vertical v-model="defaultIndex" @on-change="setDefaultReceiving">
          <div class="payment-item" v-for="(item, index) in collection" :key='index'>
            <div class="payment-item-assets">
              <img class='payment-item-assets-img' src="../../../static/images/C-Alipay.png" v-if="!item.bank">
              <img class='payment-item-assets-img' src="../../../static/images/C-Card.png" v-else-if="item.bank">
            </div>
            <div class="payment-item-right">
              <div class='payment-item-info'>
                <div class="payment-item-info-name" v-text="item.name"></div>
                <div class="payment-item-info-address" v-text="item.account"></div>
              </div>
              <Radio class='payment-item-radio' :label="index">
                <span>{{item.is_default ? $t('user.default') : $t('user.default_notValid')}}</span>
              </Radio>
              <div class="payment-item-del">
                <Poptip v-model="visible" trigger='click' class='del'>
                  <img src="../../../static/images/icon/Trash-666666.svg" class='del-icon hover'>
                  <img src="../../../static/images/icon/Trash-DDDDDD.svg" class='del-icon no-hover'>
                  <div slot='content'>
                    <div class='del-content'>
                      <h3 class='del-content-title'>{{$t('public.confirm_delete')}}</h3>
                      <div class='del-btn-group'>
                        <i-button type='primary' @click="delReceiving(index)">{{$t('public.confirm')}}</i-button>
                        <i-button @click="delCancel">{{$t('public.cancel')}}</i-button>
                      </div>
                    </div>
                  </div>
                </Poptip>
              </div>
            </div>
            
          </div>
      </RadioGroup>
      <i-button class="submitButton" type="primary" @click="popUpStatus = true" :disabled="collection.length >= 5">
        {{$t('user.add_receivables')}}
      </i-button>
    </div>
    <Modal v-model="popUpStatus" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <payment_add_pop @refresh="getReceivingList" :popUpStatus='popUpStatus' @cancel="popUpStatus = false"/>
      <div slot="footer"></div>
    </Modal>
    <div style="clear: both"></div>
  </div>
</template>

<script type="es6">
  import payment_add_pop from "./payment_add_pop.vue";
  import BreadCrumb from "./breadcrumb";
  import _findIndex from "lodash/findIndex";

  export default {
    data() {
      return {
        visible: false,
        popUpStatus: false,
        breadcrumbText:
          this.$t("user.info") + " - " + this.$t("user.default_receivables"),
        defaultIndex: -1
      };
    },
    computed: {
      layer_index() {
        return this.$store.state.layer_index;
      },
      collection() {
        return this.$store.state.collection;
      },
      banks() {
        return this.$store.state.banks;
      }
    },
    mounted() {
      this.$store.commit("user_sider_index_setter", 0);
      if (!this.collection || !this.collection.length) {
        this.getReceivingList();
      }
    },
    methods: {
      delCancel() {
        this.visible = false
      },
      getReceivingList() {
        this.$store
          .dispatch("ajax_get_receiving")
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.$store.commit("collection_setter", res.data.list || []);
              if (res.data.list.length) {
                this.defaultIndex = _findIndex(res.data.list, item => {
                  return +item.is_default === 1;
                });
              }
            } else {
              this.$Message.error(this.$t("user.receivables_request_fail"));
            }
          })
          .catch(err => {
            this.$Message.error(this.$t("user.receivables_request_fail"));
          });
      },
      delReceiving(index) {
        this.$store
          .dispatch("ajax_del_receiving", {
            id: this.collection[index].id
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              this.$Message.success(this.$t("user.receivables_del_success"));
              let list = this.collection;
              list.splice(index, 1);
              this.$store.commit("collection_setter", list);
            } else {
              this.$Message.error(this.$t("user.receivables_del_fail"));
            }
          })
          .catch(err => {
            this.$Message.error(this.$t("user.receivables_del_fail"));
          });
      },
      setDefaultReceiving(index) {
        this.$store
          .dispatch("ajax_default_receiving", {
            id: this.collection[index].id
          })
          .then(res => {
            if (res.data && +res.data.error === 0) {
              // this.$Message.success(this.$t("user.receivables_set_default_success"));
              let list = this.collection;
              for (let i = 0; i < list.length; i++) {
                if (+index === i) {
                  list[i].is_default = 1;
                } else {
                  list[i].is_default = 0;
                }
              }
              this.$store.commit("collection_setter", list);
            } else {
              this.$Message.error(this.$t("user.receivables_set_default_fail"));
            }
          })
          .catch(err => {
            this.$Message.error(this.$t("user.receivables_set_default_fail"));
          });
      }
    },
    components: {
      payment_add_pop,
      BreadCrumb
    }
  };
</script>
<style lang="scss">
.payment-item-del {
  .ivu-poptip-body {
    padding: 0;
  }
  .ivu-poptip-body-content {
    overflow: hidden;
  }
}
</style>

<style lang="scss" scoped>
  .payment {
    padding-top: 100px - 50px;
  }
  .payment-list {
    width: 100%;
  }
  .payment-item {
    padding-top: 15px;
    width: 100%;
    display: flex;

    &:not(:only-of-type):last-of-type {
      margin-bottom: 0;
      .payment-item-right {
          border-bottom: 0;
      }
    }
    // height: 74px;
    &-assets {
      margin-right: 20px;
      &-img {
        width: 38px;
        height: 38px;
      }
    }
    &-right {
      flex: 1;
      float: left;
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    &-info {
      width: 254px + 42px;
      font-size: 14px;
      color: #333333;
      line-height: 21px;
      &-name {
        margin-bottom: 5px;
      }
    }
    &-radio {
      flex: 1;
    }
    &-del {
      width: 16px;
      line-height: 1;

    }
  }
  .del {
    &-btn-group {
      display: flex;
      justify-content: space-between;
    }
    &-icon {
      cursor: pointer;
    }
    .ivu-poptip-body-content {
      overflow: hidden;
    }
    &-content {
      width: 178px;
      padding: 20px;
      word-wrap:normal;
      &-title {
        font-size: 14px;
        color: #333333;
        font-weight: normal;
        margin-bottom: 12px;
      }
      .ivu-btn {
        width: 60px;
        padding: 0;
        text-align: center;
        height: 28px;
        line-height: 28px
      }
    }
    &:hover {
      .hover {
        display: block;
      }
      .no-hover {
        display: none;
      }
    }
}

.del-icon {
  display: none;
  &.no-hover {
    display: block;
  }
}
</style>

<style lang='scss' scoped>
#content div {
  word-wrap: break-word;
}

#content .breadcrumb {
  height: 44px;
  background: #fafbfd;
}

#content .breadcrumb div {
  height: 44px;
  line-height: 44px;
  margin-left: 30px;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
}

#content .payment_none .img {
  margin: 156px auto 30px;
  width: 127px;
  height: 117px;
  cursor: pointer;
}

#content .payment_none .img img,
#content .payment_none .text_1 {
  font-size: 22px;
  width: 100%;
  height: 100%;
}
#content .payment_none .text_1 {
  text-align: center;
}
#content .payment_none .text_2 {
  margin-top: 10px;
  font-size: 14px;
  color: #999999;
  width: 970px;
  height: 20px;
  line-height: 20px;
  text-align: center;
}

#content .payment {
  width: 570px;
  margin: 50px auto;
}

#content .submitButton {
  margin: 47px 130px;
  width: 292px;
}
</style>
