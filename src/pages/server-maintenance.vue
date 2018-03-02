<template>
    <div class='container'>
        <div class='message'>
            <p class='message-text'>{{$t('public.server_maintenance')}}</p>
            <a href='/' class='message-btn'>{{$t('public.refresh')}}</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'server-maintenance'
    }
</script>
<style lang='scss' scoped>
    .container {
        background: url('~images/Img-Error.svg') no-repeat center;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .message {
        margin-top: 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        &-text {
            line-height: 42px;
            font-size: 36px;
            color: #FFFFFF;
            letter-spacing: 0;
            margin-bottom: 35px;
            text-align: center;
        }
        &-btn {
            appearance: none;
            padding-left: 30px;
            padding-right: 30px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #FFFFFF;
            border: 1px solid rgba(0,0,0,0.10);
            box-shadow: 0 5px 5px 0 rgba(0,0,0,0.03);
            border-radius: 2px;
            font-size: 16px;
            color: #333333;
            line-height: 21px;
        }
    }
</style>