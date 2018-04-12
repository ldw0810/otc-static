<template>
  <div class="breadcrumb">
      <div class='breadcrumb-text' v-text="breadcrumbText"></div>
  </div>
</template>
<script>
export default {
  props: {
    breadcrumbText: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang='scss' scoped>
.breadcrumb {
  height: 44px;
  background: #fafbfd;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.breadcrumb-text {
  height: 44px;
  line-height: 44px;
  margin-left: 30px;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
}
</style>
