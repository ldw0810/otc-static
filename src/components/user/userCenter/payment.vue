<template>
  <div id="content">
    <BreadCrumb :breadcrumbText='breadcrumbText'/>
    <div class="payment_none" v-if="!collection.length">
      <div class="img" @click="add">
        <img src="../../../static/images/+.png">
      </div>
      <div class="text_1" v-text="$t('user.add_payment_link_none')"></div>
      <div class="text_2" v-text="$t('user.default_receivables_info')"></div>
    </div>
    <div class="payment" v-else>
      <div class="paymentDiv" v-for="(item, index) in collection" :key='index'>
        <div class="img">
          <img src="../../../static/images/C-Alipay.png" v-if="!item.bank">
          <img src="../../../static/images/C-Card.png" v-else-if="item.bank">
        </div>
        <div class="info">
          <div class="text_1" v-text="item.name"></div>
          <div class="text_2" v-text="item.account"></div>
        </div>
        <div class="checkbox">
          <!-- <Radio label="apple">
              <Icon type="social-apple"></Icon>
              <span>Apple</span>
      </Radio> -->
          <Radio v-model="+item.is_default === 1"
                 @on-change="setDefault(index)">
            {{item.is_default ? $t('user.default') : $t('user.default_notValid')}}
          </Radio>
        </div>
        <div class="del">
          <Poptip confirm :title="$t('public.confirm_delete')" @on-ok="delReceiving(index)">
            <img src="../../../static/images/icon/Trash-666666.svg" class='del-icon hover'>
            <img src="../../../static/images/icon/Trash-DDDDDD.svg" class='del-icon no-hover'>
          </Poptip>
        </div>
        <div class="underLine"></div>
      </div>
      <i-button class="submitButton" type="primary" @click="add" :disabled="collection.length >= 5">
        {{$t('user.add_receivables')}}
      </i-button>
    </div>
    <Modal v-model="popUpStatus" class-name="m-ivu-modal" width='480' :mask-closable="true" :closable="false">
      <payment_add_pop @cancel='cancelPopup'/>
      <div slot="footer"></div>
    </Modal>

    <div style="clear: both"></div>
  </div>
</template>

<script type="es6">
  import payment_add_pop from "./payment_add_pop.vue";
  import BreadCrumb from "./breadcrumb";

  export default {
    data() {
      return {
        popUpStatus: false,
        breadcrumbText:
        this.$t("user.info") + " - " + this.$t("user.default_receivables"),
        defaultIndex: -1
      };
    },
    watch: {
      "$store.state.collection_refresh": function (val) {
        if (+val) {
          this.getReceivingList();
          this.$store.commit("collection_refresh_setter", 0);
        }
      }
    },
    computed: {
      layer_index() {
        return this.$store.state.layer_index;
      },
      collection() {
        return this.$store.state.collection;
      },
      collection_refresh() {
        return this.$store.state.collection_refresh;
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
      add() {
        if(this.$store.state.userInfo.activated) {
          this.popUpStatus = true;
        } else {
          this.$store.commit("showAuthEmail_setter", 1);
        }
        // this.$store.commit("layer_index_setter", 2);
      },
      cancelPopup() {
        this.popUpStatus = false;
      },
      setDefault(index) {
        if (index !== this.defaultIndex) {
          this.defaultIndex = index;
          let list = this.collection;
          for (let i = 0; i < this.collection.length; i++) {
            if (index !== i) {
              list[i].is_default = 0;
            } else {
              list[i].is_default = 1;
            }
          }
          this.$store.commit("collection_setter", list);
          this.setDefaultReceiving(index);
        } else {
        }
      },
      getReceivingList() {
        this.$store.dispatch("ajax_get_receiving").then(res => {
          if (res.data && +res.data.error === 0) {
            this.$store.commit("collection_setter", res.data.list || []);
          } else {
            this.$Message.error(this.$t("user.receivables_request_fail"));
          }
        }).catch(err => {
          this.$Message.error(this.$t("user.receivables_request_fail"));
        });
      },
      delReceiving(index) {
        this.$store.dispatch("ajax_del_receiving", {
          id: this.collection[index].id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$Message.success(this.$t("user.receivables_del_success"));
            let list = this.collection;
            list.splice(index, 1);
            this.$store.commit("collection_setter", list);
          } else {
            this.$Message.error(this.$t("user.receivables_del_fail"));
          }
        }).catch(err => {
          this.$Message.error(this.$t("user.receivables_del_fail"));
        });
      },
      setDefaultReceiving(index) {
        this.$store.dispatch("ajax_default_receiving", {
          id: this.collection[index].id
        }).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$Message.success(
              this.$t("user.receivables_set_default_success")
            );
            let list = this.collection;
            for (let i = 0; i < list.length; i++) {
              if (index === i) {
                list[i].is_default = 1;
              } else {
                list[i].is_default = 0;
              }
            }
            this.$store.commit("collection_setter", list);
          } else {
            this.$Message.error(this.$t("user.receivables_set_default_fail"));
          }
        }).catch(err => {
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
  #content .payment .paymentDiv .img img {
    object-fit: cover;
    object-position: 0 0;
    width: 100%;
    height: 100%;
  }

  #content .payment_none .text_1 {
    margin-top: 30px;
    font-size: 22px;
    width: 970px;
    height: 30px;
    line-height: 30px;
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

  #content .payment .paymentDiv {
    width: 570px;
    height: 73px;
  }

  #content .payment .paymentDiv .img {
    float: left;
    width: 38px;
    height: 38px;
    margin-top: 18px;
  }

  #content .payment .paymentDiv .info {
    float: left;
    margin-left: 19px;
    width: 350px;
  }

  #content .payment .paymentDiv .info .text_1 {
    margin-top: 12px;
    font-size: 14px;
    line-height: 21px;
  }

  #content .payment .paymentDiv .info .text_2 {
    font-size: 14px;
    line-height: 21px;
    margin-top: 5px;
  }

  #content .payment .paymentDiv .checkbox {
    float: left;
    width: 100px;
    margin: 25px 0 0 19px;
    font-size: 14px;
    color: #666666;
    line-height: 21px;
  }

  #content .payment .paymentDiv .del {
    float: left;
    margin: 28px 0;
    cursor: pointer;
  }

  #content .payment .paymentDiv .underLine {
    position: relative;
    top: 70px;
    left: 55px;
    width: 515px;
    height: 1px;
    background: #eeeeee;
  }

  #content .submitButton {
    margin: 47px 130px;
    width: 292px;
  }

  .del {
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
