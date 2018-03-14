<template>
  <Modal
        class='alert'
        width='auto'
        class-name='u-flex u-flex-center-middle'
        v-model="open"
        :closable='false'
        title=""
        @on-ok="asyncOK">
        <header slot="header" class='alert-header'>{{title}}</header>
        <div class="alert-content">
          <p class='alert-content-msg'>{{content}}</p>
        </div>
        <div class="alert-footer" slot="footer">
            <Button type="primary" class='alert-footer-btn' @click="del">{{okText}}</Button>
        </div>
    </Modal>
</template>
<script>
import {Modal} from 'iview'

export default {
  props: {
    title: {
      type: String,
      default: '错误'
    },
    content: {
      type: String,
      required: true
    },
    okText: {
      type: String,
      default: '确定'
    }
  },
  data() {
    return {
      open: false
    }
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
  /deep/ .ivu-modal-header, {
    margin-bottom: 15px;
    padding: 0;
    text-align: center;
    font-size: 18px;
    color: #333;
    @extend %no-border;
  }
  /deep/  .ivu-modal-body {
    margin-bottom: 20px;
    padding: 0;
    @extend %no-border;
  }
  /deep/  .ivu-modal-footer {
    margin: 0;
    padding: 0;
    @extend %no-border;
  }
  &-header {

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



