<template>
  <div class="wxchat-container" :style="{backgroundColor: wrapBg}">
    <div class="window" id="window-view-container" ref="scroll" :style="{height: maxHeight + 'px', width: 'auto'}">
      <!-- main -->
      <ScrollLoader class="container-main"
                    >
        <div class="message" ref="message">
          <ul>
            <li v-for="(chat, index) in msgList" :key="index" :class="{'an-move-right': +chat.type === 0,
                         'an-move-left': +chat.type === 1, 'an-move-center': +chat.type === 9}">
              <p class="time system" v-if="+chat.type === 9">
                <span v-html="new Date(chat.time).format('yyyy/MM/dd hh:mm:ss') +
                '<br/>' + toEmotion(chat.data)"></span>
              </p>
              <div :class="'main' + (+chat.type === 0 ? ' self': '')" v-else>
                <p class="time" v-if="chat.timeFlag">
                  <span v-text="new Date(chat.time).format('yyyy/MM/dd hh:mm:ss')"></span>
                </p>
                <div class="avatar">
                  <Avator :size='45' :isStatus='false'/>
                </div>
                <!-- 状态 -->
                <span class='chat-status' v-show='chat.status !== 1'>
                  <span class='chat-loading' v-show='chat.status === 0'></span>
                  <span :title='$t("order.order_chat_send_msg_fail")' class='chat-error' v-show='chat.status === -1'>
                    <Icon type="alert"></Icon>
                  </span>
                </span>
                <!-- 文本 -->
                <div class="text" v-html="toEmotion(chat.data)"></div>
                <!-- 图片 -->
                <div class="text" v-if="+chat.type === 3">
                  <img :src="chat.data" class="image" :alt="$t('order.order_chat_img')">
                </div>
              </div>
            </li>
          </ul>
        </div>
      </ScrollLoader>
    </div>
    <div id="publish" class='publish'>
      <div class="oper"></div>
      <div class='publish-action'>
        <div ref="input" :contenteditable="readOnly" class='g-mobile-shadow publish-action-input' v-html="toEmotion(inputText)"
             @keydown="inputKey" @onclick="getRange" @keyup="getRange"
             @focus="inputFocusFlag = true" @blur="inputFocusFlag = false"
              @input='checkLengh'
             ></div>
        <div class="publish-action-button">
          <i-button long type="primary" @click="sendInfo" :disabled="chatFlag">{{$t("public.send")}}
          </i-button>
        </div>
      </div>
      <!--&lt;!&ndash; 和发送&ndash;&gt;-->
      <!--<div class="face_container">-->
      <!--&lt;!&ndash; Icon，点击触发事件，动态生成并显示 &ndash;&gt;-->
      <!--<span @click=make_face() class="make_face"><i class="icon-emoji"></i></span>-->
      <!--<span class="make_img" @click="add_img()"><i class="icon-Pictuer"></i></span>-->
      <!--<span class="send" @click=send()>发送</span>-->
      <!--<span class="send"><input type="checkbox" name="top" id="top" value="top">本条置顶</span>-->
      <!--&lt;!&ndash; 容器 ，包裹生成的，绑定点击事件&ndash;&gt;-->
      <!--<div id="face" @click=choice_face($event)></div>-->
      <!--</div>-->
    </div>
  </div>
</template>
<script type="es6">
  import { VALI_CHAT } from 'config/validator'
  import { setCursorPosition } from 'utils/tools'
  import ScrollLoader from "./scrollLoader.vue";
  import Avator from "./avator.vue";

  export default {
    components: {
      ScrollLoader,
      Avator
    },
    props: {
      contact: {
        id: "",
        name: "",
        avatar: require("../../../static/images/DefaultHead.jpg")
      },
      owner: {
        id: "",
        name: "",
        avatar: require("../../../static/images/DefaultHead.jpg")
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
      }
    },
    data() {
      return {
        socket: null,
        inputText: "",
        minHeight: 700,
        msgList: this.chatList,
        inputFocusFlag: false,
        lastEditRange: null,
        chatTime: 0
      };
    },
    watch: {
      inputFocusFlag(val) {
        if (!val) {
          this.inputText = this.setMaxLength(this.$refs.input.innerHTML);
        }
      }
    },
    computed: {
      ajax_source_chat() {
        return this.$store.state.ajax_source.chat;
      },
      timeout: {
        set(val) {
          this.$store.state.timeout.chat = val;
        },
        get() {
          return this.$store.state.timeout.chat;
        }
      }
    },
    methods: {
      setMaxLength(str) {
        return str.substr(0, VALI_CHAT.max)
      },
      checkLengh($event) {
        const $el = $event.target;
        if ($el.innerHTML.length > VALI_CHAT.max) {
          $el.innerHTML = this.setMaxLength($el.innerHTML);
          setCursorPosition($el)
        }
      },
      scrollToBottom() {
        this.$nextTick(() => {
          if (this.$refs.scroll) {
            this.$refs.scroll.scrollTop = this.$refs.scroll.scrollHeight;
          }
        });
      },
      sendInfo() {
        if (this.inputText.trim()) {
          const inputInfo = this.htmlEncode(this.inputText.trim());
          const tempTime = new Date();
          this.$refs.input.innerHTML = "";
          this.inputText = "";
          let compareTime = this.msgList.length
            ? this.msgList[this.msgList.length - 1].compareTime
            : 0;
          let timeFlag = tempTime.getTime() - compareTime > 3 * 60 * 1000;
          this.$set(this.msgList, this.msgList.length, {
            type: 0,
            data: inputInfo,
            time: tempTime.format("yyyy/MM/dd hh:mm:ss"),
            compareTime: timeFlag ? tempTime.getTime() : compareTime,
            timeFlag: timeFlag,
            status: 0 // 0. 加载  1. 成功 -1 失败
          });
          this.scrollToBottom();
          this.$store
            .dispatch("ajax_send_msg", {
              order_id: this.orderId,
              to: this.contact.id,
              msg: inputInfo
            })
            .then(res => {
              if (res.data && +res.data.error === 0) {
                this.$nextTick(() => {
                  this.msgList[this.msgList.length - 1].status = 1;
                });
              } else {
                this.$nextTick(() => {
                  this.msgList[this.msgList.length - 1].status = -1;
                });
              }
            })
            .catch(err => {
              this.$nextTick(() => {
                this.msgList[this.msgList.length - 1].status = -1;
              });
            });
        } else {
          return false;
        }
      },
      getMsg() {
        this.$store
          .dispatch("ajax_chat", {
            order: this.orderId
          })
          .then(res => {
            this.scrollToBottom();
            if (res.data && +res.data.error === 0) {
              let compareTime = this.msgList.length
                ? this.msgList[this.msgList.length - 1].compareTime
                : 0;
              let timeFlag =
                +res.data.from === 0
                  ? false
                  : new Date().getTime() - compareTime > 3 * 60 * 1000;
              this.$set(this.msgList, this.msgList.length, {
                type: +res.data.from === 0 ? 9 : 1,
                data: res.data.msg,
                time: new Date().format("yyyy/MM/dd hh:mm:ss"),
                compareTime: timeFlag ? new Date().getTime() : compareTime,
                timeFlag: timeFlag
              });
              this.scrollToBottom();
              if (+res.data.from === 0) {
                this.$emit("refresh", 1);
              }
              this.getMsg();
            } else if (res.data && +res.data.error === 100002) {  //timeout
              this.getMsg();
            } else {
              let that = this;
              if(res.data && +res.data.cancel === 1) {
              } else {
                this.timeout && clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                  that.$emit("refresh", 1);
                  that.getMsg();
                }, 6 * 1000);
              }
            }
          })
          .catch(err => {
            let that = this;
            if(err && +err.cancel === 1) {
            } else {
              this.timeout && clearTimeout(this.timeout);
              this.timeout = setTimeout(() => {
                that.$emit("refresh", 1);
                that.getMsg();
              }, 6 * 1000);
            }
          });
      },
      inputKey(event) {
        if (+event.keyCode === 13) {
          event.preventDefault();
          if (event.ctrlKey === true) {
            //ctrl + enter
            // this.showRange(document.createElement("br"));
          } else {
            this.inputText = this.setMaxLength(this.$refs.input.innerText.trim());
            this.sendInfo();
          }
        } else {
          // this.inputText = event.target.innerHTML;
        }
      },
      getRange() {
        // 获取选定对象
        let selection = getSelection();
        // 设置最后光标对象
        this.lastEditRange = selection.getRangeAt(0);
      },
      htmlEncode(str) {
        let ele = document.createElement("span");
        ele.appendChild(document.createTextNode(str));
        // 正则匹配所有的html tags，并删除
        return ele.innerHTML.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
      },
      //解析
      htmlDecode(str) {
        let ele = document.createElement("span");
        ele.innerHTML = str;
        return ele.textContent;
      },
      init() {
        this.timeout && clearTimeout(this.timeout);
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
    },
    mounted() {
      this.scrollToBottom()
    },
    destroyed() {
      this.ajax_source_chat && this.ajax_source_chat.cancel({cancel: 1});
      this.timeout && clearTimeout(this.timeout);
    },
  };
</script>

<style lang="scss" scoped>
  .chat-status {
    margin-right: 5px;
  }

  .chat-loading {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: middle;
    animation: weuiLoading 1s steps(12, end) infinite;
    background: transparent url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=") no-repeat;
    background-size: 100%;
    &.weui-loading_transparent {
      background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMjAnIGhlaWdodD0nMTIwJyB2aWV3Qm94PScwIDAgMTAwIDEwMCc+PHBhdGggZmlsbD0nbm9uZScgZD0nTTAgMGgxMDB2MTAwSDB6Jy8+PHJlY3QgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjU2KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3RyYW5zbGF0ZSgwIC0zMCknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDMwIDEwNS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjQzKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA3NS45OCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjM4KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSg5MCA2NSA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjMyKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTguNjYgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4yOCknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoMTUwIDU0LjAyIDY1KScvPjxyZWN0IHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyB4PSc0Ni41JyB5PSc0MCcgZmlsbD0ncmdiYSgyNTUsMjU1LDI1NSwuMjUpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKDE4MCA1MCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjIpJyByeD0nNScgcnk9JzUnIHRyYW5zZm9ybT0ncm90YXRlKC0xNTAgNDUuOTggNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xNyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTEyMCA0MS4zNCA2NSknLz48cmVjdCB3aWR0aD0nNycgaGVpZ2h0PScyMCcgeD0nNDYuNScgeT0nNDAnIGZpbGw9J3JnYmEoMjU1LDI1NSwyNTUsLjE0KScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtOTAgMzUgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4xKScgcng9JzUnIHJ5PSc1JyB0cmFuc2Zvcm09J3JvdGF0ZSgtNjAgMjQuMDIgNjUpJy8+PHJlY3Qgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHg9JzQ2LjUnIHk9JzQwJyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LC4wMyknIHJ4PSc1JyByeT0nNScgdHJhbnNmb3JtPSdyb3RhdGUoLTMwIC01Ljk4IDY1KScvPjwvc3ZnPgo=");
    }
  }

  .chat-error {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background-color: #f76260;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    .ivu-icon-alert {
      color: #fff;
      transform-origin: center;
      transform: scale(0.8);
      font-size: 8px;
    }
  }

  @keyframes weuiLoading {
    0% {
      transform: rotate3d(0, 0, 1, 0deg);
    }

    100% {
      transform: rotate3d(0, 0, 1, 360deg);
    }
  }

  .publish {
    margin-top: 20px;
    &-action {
      display: flex;
      width: 100%;
      &-input {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        outline: 0;
        border: 0;
        word-break: break-all;
        font-size: 14px;
        width: 692px;
        min-height: 40px;
        max-height: 120px;
        padding: 8px 12px;
        user-select: text;
        white-space: pre-wrap;
        text-align: left;
        background: #ffffff;
        border: 1px solid #dddddd;
        &[contenteditable="true"] {
          -webkit-user-modify: read-write-plaintext-only;
          &:empty:before {
            content: attr(placeholder);
            display: block;
            color: #ccc;
          }
          &:focus {
            &:before{
              display: none;
            }
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

<style lang='scss' scoped>
  .wxchat-container {
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
    border: 1px solid #eeeeee;
    box-shadow: inset 0 0 5px 0 rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    margin: 0 auto;
    overflow: auto;
    @extend %scrollbar;
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
    padding: 10px 15px;
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
  }

  .message .time > span {
    display: inline-block;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    margin-bottom: 22px;
  }

  .message .system > span {
    background: #eeeeee;
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
    background-color: #fff;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
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
    background: #f6ffff;

    /* background-color: #9eea6a; */
  }

  .message .self .text:before {
    /* right: inherit; */
    /* left: 100%;
        le */
    left: auto;
    right: -2px;
    box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.1);
    background-color: #f6ffff;
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