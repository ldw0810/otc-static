<template>
  <div id="content">
    <div class='g-loading-wrapper' v-if='isLoading'>
      <c-loading/>
    </div>
    <template v-if='!isLoading'>
      <div class="payment_none" v-if="!collection.length">
        <div class="img" @click="popUpStatus = true">
          <img src="../../../../static/images/+.png">
        </div>
        <div class="text_1" v-text="$t('user.add_payment_link_none')"></div>
        <div class="text_2" v-text="$t('user.default_receivables_info')"></div>
      </div>
      <div class="payment" v-else>
        <RadioGroup class='payment-list' vertical v-model="defaultIndex" @on-change="setDefaultReceiving">
            <div class="payment-item" v-for="(item, index) in collection" :key='index'>
              <div class="payment-item-assets">
                <img class='payment-item-assets-img' src="../../../../static/images/C-Alipay.png" v-if="!item.bank">
                <img class='payment-item-assets-img' src="../../../../static/images/C-Card.png" v-else-if="item.bank">
              </div>
              <div class="payment-item-right">
                <div class='payment-item-info'>
                  <div class="payment-item-info-name" v-text="item.name"></div>
                  <div class="payment-item-info-address" v-text="item.account"></div>
                </div>
                <Radio class='payment-item-radio' :label="index" >
                  <span>{{item.is_default ? $t('user.default') : $t('user.default_notValid')}}</span>
                </Radio>
                <div class="payment-item-del">
                  <Poptip v-model="item.visible" trigger='click' class='del'>
                    <i class='icon-trash del-icon'></i>
                    <div slot='content'>
                      <div class='del-content'>
                        <h3 class='del-content-title'>{{$t('public.confirm_delete')}}</h3>
                        <div class='del-btn-group'>
                          <i-button type='primary' @click="delReceiving(index)">{{$t('public.confirm')}}</i-button>
                          <i-button @click="delCancel(index)">{{$t('public.cancel')}}</i-button>
                        </div>
                      </div>
                    </div>
                  </Poptip>
                </div>
              </div>
            </div>
        </RadioGroup>
        <div class='payment-btn-wrapper'>
          <i-button class="payment-btn" type="primary" @click="popUpStatus = true" :disabled="collection.length >= 5">
            {{$t('user.add_receivables')}}
          </i-button>
          <div class="payment-btn-text" v-text="$t('user.default_receivables_info')"></div>        
        </div>

        
      </div>
    </template>

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
      // collection: [],
      isLoading: true,
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
  watch: {
    $route: function (val) {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    delCancel(index) {
      this.$store.commit("collection_close_poptip", index);
    },
    findDefaultIndex(arr) {
      this.defaultIndex = _findIndex(arr, item => {
        return +item.is_default === 1;
      });
    },
    getReceivingList() {
      this.$store
        .dispatch("ajax_get_receiving")
        .then(res => {
          this.isLoading = false;
          if (res.data && +res.data.error === 0) {
            this.$store.commit("collection_setter", res.data.list || []);
            if (res.data.list.length) {
              this.findDefaultIndex(res.data.list)
            }
          } else {
            // this.$Message.error(this.$t("user.receivables_request_fail"));
          }
        })
        .catch(err => {
          this.isLoading = false;
          // this.$Message.error(this.$t("user.receivables_request_fail"));
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
            // this.$Message.error(this.$t("user.receivables_del_fail"));
          }
        })
        .catch(err => {
          // this.$Message.error(this.$t("user.receivables_del_fail"));
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
            // this.$Message.error(this.$t("user.receivables_set_default_fail"));
          }
        })
        .catch(err => {
          // this.$Message.error(this.$t("user.receivables_set_default_fail"));
        });
    },
    init(){
      this.$store.commit("user_sider_index_setter", 0);
      if (!this.collection || !this.collection.length) {
        this.getReceivingList();
      } else {
        this.isLoading = false;
        this.findDefaultIndex(this.collection)
      }
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
  padding-left: 42px;
  padding-right: 40px;
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
    width: 193px + 123px;
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
    word-wrap: normal;
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
      line-height: 28px;
    }
  }
}

.del-icon {
  font-size: 16px;
  color: #ccc;
  &:hover {
    color: #666
  }
}
</style>

<style lang='scss' scoped>
#content div {
  word-wrap: break-word;
}

#content .breadcrumb {
  height: 5vh;
  background: #fafbfd;
}

#content .breadcrumb div {
  height: 5vh;
  margin-left: 14vw;
  font-size: 0.85rem;
  color: #666666;
  letter-spacing: 0;
}

#content .payment_none {
  width: 100vw;
  min-height: 72vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}
#content .payment_none .img {
  width: 10vh;
  height: 10vh;
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
  height: 20px;
  line-height: 20px;
  text-align: center;
}

#content .payment {
  width: 570px;
  margin: 50px auto;
}
.payment-btn-wrapper {
  margin: 47px auto;
  text-align: center;
}
.payment-btn-text {
  font-size: 14px;
  color: #999999;
  margin-top: 15px;
}
.payment-btn {
  width: 292px;
}
</style>
