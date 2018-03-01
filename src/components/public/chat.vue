<template>
  <div class="wxchat-container" :style="{backgroundColor: wrapBg}">
    <div class="window" id="window-view-container" :style="{maxHeight: maxHeight + 'px', width: 'auto'}">
      <!-- main -->
      <ScrollLoader ref="scroll" :minHeight="minHeight" class="container-main"
                    :style="{maxHeight: maxHeight-50 + 'px'}">
        <div class="message" ref="message">
          <ul>
            <li v-for="(chat, index) in msgList" :key="index" :class="{'an-move-right': +chat.type === 0,
                         'an-move-left': +chat.type === 1, 'an-move-center': +chat.type === 9}">
              <p class="time system" v-if="+chat.type === 9">
                <span v-html="new Date(chat.time).format('yyyy/MM/dd hh:mm:ss') +
                '<br/>' + toEmotion(chat.data)"></span>
              </p>
              <div :class="'main' + (+chat.type === 0 ? ' self': '')" v-else>
                <p class="time">
                  <span v-text="new Date(chat.time).format('yyyy/MM/dd hh:mm:ss')"></span>
                </p>
                <!--<img class="avatar" width="45" height="45" :src="chat.type == 0 ? owner.avatar : contact.avatar">-->
                <div class="avatar">
                  <Avator
                    :size='45'
                    :isStatus = 'false'
                  />
                </div>
                
                <!-- <img class="avatar" width="45" height="45" src="../../static/images/DefaultHead.jpg"> -->
                <!-- 文本 -->
                <div class="text" v-html="toEmotion(chat.data)"></div>
                <!-- 图片 -->
                <div class="text" v-if="+chat.type === 3">
                  <img :src="chat.data" class="image" :alt="$t('order.order_chat_img')">
                </div>
                <!--&lt;!&ndash; 其他 &ndash;&gt;-->
                <!--<div class="text" v-text="'[$t(\'order_chat_type_nonsupport\'):'+ chat.type +']\n\r' + chat.data" v-else>-->
                <!--</div>-->
              </div>
            </li>
          </ul>
        </div>
      </ScrollLoader>
    </div>
    <div id="publish" class='publish'>
      <div class="oper"></div>
      <div class='publish-action'>
        <div ref="input" :contenteditable="readOnly" class='publish-action-input' v-html="inputText"
        @keyup="inputKey" @focus="inputFocus = true" @blur="inputFocus = false"></div>
        <div class="publish-action-button">
          <i-button long type="primary" @click="sendInfo" :disabled="chatFlag">{{$t("public.send")}}
          </i-button>
        </div>
      </div>
      <!--&lt;!&ndash; 表情和发送&ndash;&gt;-->
      <!--<div class="face_container">-->
      <!--&lt;!&ndash; 表情Icon，点击触发事件，动态生成表情并显示 &ndash;&gt;-->
      <!--<span @click=make_face() class="make_face"><i class="icon-emoji"></i></span>-->
      <!--<span class="make_img" @click="add_img()"><i class="icon-Pictuer"></i></span>-->
      <!--<span class="send" @click=send()>发送</span>-->
      <!--<span class="send"><input type="checkbox" name="top" id="top" value="top">本条置顶</span>-->
      <!--&lt;!&ndash; 表情容器 ，包裹生成的表情，绑定点击表情事件&ndash;&gt;-->
      <!--<div id="face" @click=choice_face($event)></div>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script type="es6">
  import ScrollLoader from "./scrollLoader.vue";
  import Avator from './avator.vue'

  export default {
    components: {
      ScrollLoader,
      Avator,
    },
    props: {
      contact: {
        id: "",
        name: "",
        avatar: require("../../static/images/DefaultHead.jpg")
      },
      owner: {
        id: "",
        name: "",
        avatar: require("../../static/images/DefaultHead.jpg")
      },
      orderId: "",
      msg: "",
      chatList: {
        type: Array,
        default: []
      },
      chatFlag: false,
      width: {
        type: Number,
        default: 450
      },
      wrapBg: {
        type: String,
        default: "#fff"
      },
      maxHeight: {
        type: Number,
        default: 700
      },
      readOnly: {
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        socket: null,
        inputText: "",
        minHeight: 700,
        msgList: this.chatList.reverse(),
        inputFocus: false,
      };
    },
    watch: {
      "msg": function (val) {
        if (val.trim()) {
          this.sendMsg(val.trim());
        }
      },
      "inputFocus"(val){
        if(!val) {
          this.inputText = this.$refs.input.innerHTML;
        }
      }
    },
    methods: {
      sendInfo() {
        if (this.inputText.trim()) {
          const inputInfo = this.inputText.trim();
          const time = new Date().format("yyyy/MM/dd hh:mm:ss");
          this.$refs.input.innerHTML = "";
          this.inputText = "";
          this.$store.dispatch("ajax_send_msg", {
            order_id: this.orderId,
            to: this.contact.id,
            msg: inputInfo
          }).then(res => {
            if (res.data && +res.data.error === 0) {
              this.$set(this.msgList, this.msgList.length, {
                type: 0,
                data: inputInfo,
                time: time
              });
            } else {
              this.$Message.error(this.$t("order.order_chat_send_msg_fail"));
            }
          }).catch(err => {
            this.$Message.error(this.$t("order.order_chat_send_msg_fail"));
          });
        } else {
          return false;
        }
      },
      getMsg() {
        this.$store.dispatch("ajax_chat", {}).then(res => {
          if (res.data && +res.data.error === 0) {
            this.$set(this.msgList, this.msgList.length, {
              type: +res.data.from === 0 ? 9 : 1,
              data: res.data.msg,
              time: new Date().format("yyyy/MM/dd hh:mm:ss")
            });
            this.getMsg();
          } else {
            this.getMsg();
          }
        }).catch(err => {
          this.getMsg();
        });
      },
      inputKey(event) {
        if (+event.keyCode === 13) { //enter
          if (event.ctrlKey === true) {  //ctrl + enter
             this.inputText = this.$refs.input.innerText;
          } else {
            this.inputText = this.$refs.input.innerText.trim();
            this.sendInfo();
          }
        } else {
          // this.inputText = event.target.innerHTML;
        }
      },
      init() {
        this.msg && (this.msgList[this.msgList.length] = this.msg);
        this.getMsg();
      },
      toEmotion(text, isNoGif) {
        const list = ["微笑", "撇嘴", "色", "发呆", "得意", "流泪", "害羞", "闭嘴", "睡", "大哭", "尴尬", "发怒", "调皮", "呲牙", "惊讶", "难过", "酷", "冷汗", "抓狂", "吐", "偷笑", "愉快", "白眼", "傲慢", "饥饿", "困", "惊恐", "流汗", "憨笑", "大兵", "奋斗", "咒骂", "疑问", "嘘", "晕", "折磨", "衰", "骷髅", "敲打", "再见", "擦汗", "抠鼻", "鼓掌", "糗大了", "坏笑", "左哼哼", "右哼哼", "哈欠", "鄙视", "委屈", "快哭了", "阴险", "亲亲", "吓", "可怜", "菜刀", "西瓜", "啤酒", "篮球", "乒乓", "咖啡", "饭", "猪头", "玫瑰", "凋谢", "示爱", "爱心", "心碎", "蛋糕", "闪电", "炸弹", "刀", "足球", "瓢虫", "便便", "月亮", "太阳", "礼物", "拥抱", "强", "弱", "握手", "胜利", "抱拳", "勾引", "拳头", "差劲", "爱你", "NO", "OK", "爱情", "飞吻", "跳跳", "发抖", "怄火", "转圈", "磕头", "回头", "跳绳", "挥手", "激动", "街舞", "献吻", "左太极", "右太极", "嘿哈", "捂脸", "奸笑", "机智", "皱眉", "耶", "红包", "鸡"];
        if (!text) {
          return text;
        }
        text = text.replace(/\[[\u4E00-\u9FA5]{1,3}\]/gi, function (word) {
          let newWord = word.replace(/\[|\]/gi, "");
          let index = list.indexOf(newWord);
          let backgroundPositionX = -index * 24;
          let imgHTML = "";
          if (index < 0) {
            return word;
          }
          if (isNoGif) {
            if (index > 104) {
              return word;
            }
            imgHTML = `<i class="static-emotion" style="background:url(https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/default218877.gif) ${backgroundPositionX}px 0;"></i>`;
          } else {
            let path =
              index > 104
                ? "/img"
                : "https://res.wx.qq.com/mpres/htmledition/images/icon";
            imgHTML = `<img class="static-emotion-gif" style="vertical-align: middle" src="${path}/emotion/${index}.gif">`;
          }
          return imgHTML;
        });
        return text;
      }
    },
    created() {
      this.init();
    }
  };
</script>

<style lang="scss" scoped>
  .publish {
    margin-top: 20px;
    &-action {
      display: flex;
      width: 100%;
      &-input {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding-left: 20px;
        outline: 0;
        border: 0;
        word-break: break-all;
        font-size: 14px;
        width: 690px;
        height: 65px;
        user-select: text;
        white-space: pre-wrap;
        text-align: left;
        &[contenteditable=true] {
          user-modify: read-write-plaintext-only;
          &:empty:before {
            content: attr(placeholder);
            display: block;
            color: #ccc;
          }
        }
      }
      &-button {
        width: 106px;
        margin-left: 10px;
      }
    }
  }
</style>

<style scoped>
  .wxchat-container {
    /*width: 100%;*/
    /*height: 100%;*/
    /*z-index: 100;*/
    /*position: fixed;*/
    /*left: 0;*/
    /*top: 0;*/
    /*overflow: hidden;*/
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.2;
  }

  .window {
    min-width: 400px;
    background: #fafbfd;
    border: 1px solid #EEEEEE;
    box-shadow: inset 0 0 5px 0 rgba(0,0,0,0.10);
    border-radius: 2px;
    margin: 0 auto;
    overflow: hidden;
    padding: 0;
    height: 100%;
    position: relative;
    z-index: 101;
  }

  .w100 {
    width: 100%;
  }

  .mt5 {
    margin-top: 5px;
  }

  .mt10 {
    margin-top: 10px;
  }

  .mt20 {
    margin-top: 20px;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mb20 {
    margin-bottom: 20px;
  }

  .fs0 {
    font-size: 0;
  }

  .title {
    background: #000;
    text-align: center;
    color: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
  }

  .loading,
  .no-more {
    text-align: center;
    color: #b0b0b0;
    line-height: 100px;
  }

  .no-more {
    line-height: 60px;
  }

  .pull-right {
    float: right;
  }

  .link-line {
    text-decoration: underline;
  }

  .message {
    height: 100%;
    padding: 10px 15px;
    overflow-y: auto;
    min-height: 730px;
  }

  .message li {
    margin-bottom: 15px;
    left: 0;
    position: relative;
    display: block;
  }

  .message .time {
    margin: 10px 0;
    text-align: center;
  }



  .message .avatar {
    float: left;
    margin: 0 10px 0 0;
    border-radius: 3px;
    background: #fff;
  }

  .message .time > span {
    display: inline-block;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 22px;
  }

  .message .system > span {
    background: #EEEEEE;
    border-radius: 12px;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 25px;
    min-width: 529px;
    height: 75px;
    padding: 15px 5px;
    margin-bottom: 20px;
    text-align: center;
  }

  .message .text:before {
    content: " ";
    position: absolute;
    /* top: 9px;
    right: 100%;
    border: 6px solid transparent;
    border-right-color: #fff; */
    /* width: 10px;
    height: 10px;
    transform: rotate(90deg); */
    width: 5px;
    height: 5px;
    transform: rotate(135deg);
    background-color: #fff;
    left: -2px;
    box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.1);
   
  }

  .message .text {
    box-shadow: 0 0 5px 0 rgba(0,0,0,0.10);
    display: inline-block;
    position: relative;
    max-width: calc(75%);
    min-height: 35px;
    line-height: 2.1;
    font-size: 15px;
    padding: 15px 20px;
    text-align: left;
    word-break: break-all;
    border-radius: 12px;
  }
  .message .self {
    text-align: right;
  }

  .message .self .avatar {
    float: right;
    margin: 0 0 0 10px;
  }

  .message .self .text {
    background: #F6FFFF;

    /* background-color: #9eea6a; */

  }

  .message .self .text:before {
    /* right: inherit; */
    /* left: 100%;
    le */
    left: auto;
    right: -2px;
    box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: #F6FFFF;
    /* border-right-color: transparent; */
    /* border-left-color: #F6FFFF; */
  }

  .message .image {
    max-width: 200px;
  }

  img.static-emotion-gif,
  img.static-emotion {
    vertical-align: middle !important;
  }

  .an-move-left {
    left: 0;
    animation: moveLeft 0.7s ease;
    -webkit-animation: moveLeft 0.7s ease;
  }

  .an-move-right {
    left: 0;
    animation: moveRight 0.7s ease;
  }

  .an-move-center {
    left: 0;
    animation: moveCenter 0.5s ease;
  }

  .bgnone {
    background: none;
  }

  @keyframes moveRight {
    0% {
      left: -20px;
      opacity: 0;
    }
    100% {
      left: 0;
      opacity: 1;
    }
  }

  @-webkit-keyframes moveRight {
    0% {
      left: -20px;
      opacity: 0;
    }

    100% {
      left: 0px;
      opacity: 1;
    }
  }

  @keyframes moveLeft {
    0% {
      left: 20px;
      opacity: 0;
    }

    100% {
      left: 0px;
      opacity: 1;
    }
  }

  @-webkit-keyframes moveLeft {
    0% {
      left: 20px;
      opacity: 0;
    }
    100% {
      left: 0px;
      opacity: 1;
    }
  }

  @keyframes moveCenter {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes moveCenter {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @media (max-width: 367px) {
    .fzDInfo {
      width: 82%;
    }
  }
</style>