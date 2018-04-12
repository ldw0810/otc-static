<template>
  <Modal
      ref='alert'
      data-sign = 'alert'
      class='alert'
      width='auto'
      class-name='u-flex u-flex-center-middle'
      v-model="visible"
      :closable='false'
      :mask-closable="false"
      :transition-names="transition"
      title="">
    <header slot="header" class='alert-header'>{{title}}</header>
    <div class="alert-content">
      <p class='alert-content-msg'>{{content}}</p>
    </div>
    <div class="alert-footer" slot="footer">
      <Button type="primary" class='alert-footer-btn' @click='close'>{{okText}}</Button>
    </div>
  </Modal>
</template>
<script>
  import {Modal} from 'iview'

  export default {
    data() {
      return {
        type: '',
        visible: false,
        content: '',
        okText: this.$t('public.confirm'),
        transition: ['ease', 'fade'],
        callback: () => {
        }
      }
    },
    computed: {
      title: {
        set(){

        },
        get(){
          if (this.type === "error") {
            return this.$t('public.error_title_default');
          } else if (this.type === "success") {
            return this.$t('public.success_title_default');
          }
        }
      }
    },
    watch: {
      visible(val) {
        if (val === false) {
          document.body.removeChild(this.$refs.alert.$el)
          this.$destroy()
        }
      }
    },
    methods: {
      close($event, callback) {
        this.onClose();
        this.visible = false
      },
      onClose() {
      }
    },
    mounted() {

    }
  }
</script>
<style lang="scss" scoped>
  .alert {
    /deep/ .ivu-modal {
      background-color: #fff;
      padding: 40px 69px;
      text-align: center;
    }
    %no-border {
      border: 0;
      margin: 0;
    }
    /deep/ .ivu-modal-header {
      margin-bottom: 15px;
      padding: 0;
      text-align: center;
      font-size: 18px;
      color: #333;
      @extend %no-border;
    }
    /deep/ .ivu-modal-body {
      margin-bottom: 20px;
      padding: 0;
      @extend %no-border;
    }
    /deep/ .ivu-modal-footer {
      margin: 0;
      padding: 0;
      @extend %no-border;
    }
    &-content {
      width: 342px;
      text-align: center;
      &-msg {
        font-size: 16px;
        color: #333333;
        line-height: 28px;
      }
    }
    /deep/ &-footer {
      text-align: center;
      &-btn {
        width: 183px;
      }
    }
  }
</style>



