<template>
    <div class='avator g-shadow avator-online'
         :class="{'avator-online': status, 'avator-offline': !status}"
         :style="{width: size + 'px', height: size + 'px'}"
    >
        <span class='status' v-if='isStatus'></span>
    </div>
</template>
<script>
export default {
  props: {
    size: {
			type: Number,
			default: 50,
		},
    isStatus: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
$avatorImage: "../../static/images/DefaultHead.jpg";
.avator {
  flex-shrink: 0;
  position: relative;
  width: 50px;
  height: 50px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: url($avatorImage) no-repeat center;
  background-size: cover;
}

.status {
  position: absolute;
  right: 0;
  top: 0;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  border: 1px solid #fff;
}

.avator-online .status {
  background-image: linear-gradient(to bottom, #b5eb45, #7ed321);
}

.avator-offline .status {
  background-image: linear-gradient(to bottom, #d2d2d2, #aeaeae);
}
</style>
