<!--手机发送验证码按钮-->
<template>
    <div class='send'>
        <a @click="send" class='send-btn send-primary' v-if="show && tempOnce">{{$t("user.auth_phone_code_send")}}</a>
        <a @click="send" class='send-btn send-primary' v-else-if="show && tempTime > 0">{{$t("user.auth_phone_code_reSend")}}</a>
        <a disabled v-else class='send-btn send-disabled'>{{$t("user.auth_phone_code_reSend_seconds").format(tempTime)}}</a>
    </div>
</template>

<script>
    export default {
        props: {
            time: {
                type: Number,
                default: 60
            },
            once: {
                type: Boolean,
                default: true
            },
        },
        data: function () {
            return {
                show: true,
                tempTime: this.time,
                tempOnce: this.once
            }
        },
        methods: {
            send(){
                if(this.tempOnce) {
                    this.tempOnce = false;
                }
                this.show = false;
                this.$emit("sendCode", 1);
                this.tempTime = this.time + 1;
                this.timer();
            },
            timer() {
                if (this.tempTime > 1) {
                    this.tempTime--;
                    setTimeout(this.timer, 1000);
                } else {
                    this.show = true;
                    this.tempTime = this.time;
                }
            },
            refresh(){
                this.tempOnce = true;
                this.show = true;
            }
        },
        computed: {
        }
    }
</script>
<style scoped>
    /* #sendButton {
        width: 100px;
        height: 50px;
    } */
</style>
<style lang="less" scoped>
@import '~style/lib/custom';
.send {
    margin-left: 16px;
    &-btn {
        font-size: 14px;
        display: inline-flex;
        align-items: center;
    }
    &-primary {
        color: @primary-color;
    }
    &-disabled {
        color: #999;
    }
}
</style>

