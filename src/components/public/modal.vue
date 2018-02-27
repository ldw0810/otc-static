<template>
    <Modal
            v-model='showModal'
            class-name="public-modal"
            :mask-closable="true"
            :closable="false"
    >
        <header class='header'>
            <Logo/>
        </header>
        <article class='content'>
            <slot></slot>
        </article>
    </Modal>
</template>
<script>
    import Logo from '@/components/public/logo'
    export default {
        components: {
            Logo,
        },
        data() {
            return {
                showModal: false,
            }
        }
    }
</script>
<style lang="scss">
    .public-modal {
        .logoBg {
            width: 100%;
        }
        .ivu-modal-body {
            padding: 0;
        }
    }
</style>
