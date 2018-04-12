<!--验证码-->
<style lang='scss' scoped>
</style>
<template>
    <div id="pinCodeDiv" @click="getPinCode"></div>
</template>
<script>
    import {mapState} from "vuex"
    export default {
        name: 'pinCode',
        data(){
            return {
                pinCodeValue: ""
            }
        },
        watch:{
            "$store.state.pinCodeRefresh": function (val) {
                if(val) {
                    this.getPinCode();
                    this.$store.commit("pinCodeRefresh_setter", 0);
                }
            }
        },
        methods: {
            randomNum(min, max){
                return Math.floor(Math.random() * (max - min) + min);
            },
            randomColor(min, max) {
                const r = this.randomNum(min, max);
                const g = this.randomNum(min, max);
                const b = this.randomNum(min, max);
                return "rgb(" + r + "," + g + "," + b + ")";
            },
            getPinCode(){
                const pinCodeDiv = document.getElementById("pinCodeDiv");
                pinCodeDiv.innerHTML = "";
                const pinCodeCanvas = document.createElement("canvas");
                pinCodeCanvas.width = pinCodeDiv.offsetWidth;
                pinCodeCanvas.height = pinCodeDiv.offsetHeight;
                pinCodeDiv.appendChild(pinCodeCanvas);
                let ctx = pinCodeCanvas.getContext('2d');
                ctx.textBaseline = 'bottom';

                /**绘制背景色**/
                ctx.fillStyle = this.randomColor(180, 240); //颜色若太深可能导致看不清
                ctx.fillRect(0, 0, pinCodeCanvas.width, pinCodeCanvas.height);
                /**绘制文字**/
                this.pinCodeValue = "";
                const str = 'ABCEFGHJKLMNPQRSTWXY123456789';
                for (let i = 0; i < 4; i++) {
                    const txt = str[this.randomNum(0, str.length)];
                    ctx.fillStyle = this.randomColor(50, 160);  //随机生成字体颜色
                    ctx.font = this.randomNum(15, 30) + 'px SimHei'; //随机生成字体大小
                    const x = 5 + i * 20;
                    const y = this.randomNum(20, 30);
                    const deg = this.randomNum(-45, 45);
                    //修改坐标原点和旋转角度
                    ctx.translate(x, y);
                    ctx.rotate(deg * Math.PI / 180);
                    ctx.fillText(txt, 0, 0);
                    //恢复坐标原点和旋转角度
                    ctx.rotate(-deg * Math.PI / 180);
                    ctx.translate(-x, -y);
                    this.pinCodeValue += txt;
                }
//                /**绘制干扰线**/
//                for (let j = 0; j < 8; j++) {
//                    ctx.strokeStyle = this.randomColor(40, 180);
//                    ctx.beginPath();
//                    ctx.moveTo(this.randomNum(0, pinCodeCanvas.width), this.randomNum(0, pinCodeCanvas.height));
//                    ctx.lineTo(this.randomNum(0, pinCodeCanvas.width), this.randomNum(0, pinCodeCanvas.height));
//                    ctx.stroke();
//                }
                /**绘制干扰点**/
                for (let k = 0; k < 100; k++) {
                    ctx.fillStyle = this.randomColor(155, 255);
                    ctx.beginPath();
                    ctx.arc(this.randomNum(0, pinCodeCanvas.width), this.randomNum(0, pinCodeCanvas.height), 1, 0, 2 * Math.PI);
                    ctx.fill();
                }
                this.$store.commit("pinCodeValue_setter", this.pinCodeValue);
            }
        },
        mounted: function () {
            this.getPinCode();
        }
    }
</script>