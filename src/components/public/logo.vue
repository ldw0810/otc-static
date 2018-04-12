<template>
    <div class="logoBg">
        <div class="logo">
            <img src="../../static/images/LOGO.png">
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        data(){
            return {};
        },
        methods: {}
    }
</script>
<style lang='scss' scoped>
    .logoBg {
        width: 100%;
        height: 100px;
        position: relative;
        /* position: relative;
        width: 480px;
        height: 100px;
        
        margin: 136px auto 0 auto; */
        background: #F4F6F9;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
    }

    .logo {
        width: 195px;
        height: 30px;
        position: relative;
        left: 143px;
        top: 35px;
    }

    .logo img {
        object-fit: cover;
        object-position: 0 0;
        width: 100%;
        height: 100%;
    }
</style>
