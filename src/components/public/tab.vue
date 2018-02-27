<template>
  <div class='tab' :class="{'tab-inner': tabType === 'inner'}">
    <div class="tab-bar">
      <div 
          class="tab-bar-item " 
          v-for='(item, index) in tabs'
          :key='index'
          :class="{'tab-bar-item-active': index === currentIndex}"
          @click='changeIndex(index)'>
        <span class='tab-bar-item-text'>{{item}}</span>
      </div>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tabType: {
      type: String,
      default: "outer"
    },
    tabs: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  methods: {
    changeIndex(index) {
      this.currentIndex = index;
      this.$emit("changeIndex", index);
    }
  },
  watch: {
    defaultIndex: {
      handler(newVal, val) {
        this.currentIndex = newVal;
      },
      deep: true
    }
  },
  created() {
    this.currentIndex = this.defaultIndex;
  }
};
</script>
<style lang="scss" scoped>
@import '~style/variables';
.tab {
  &-bar {
    height: 64px;
    background-color: #f4f6f9;
    display: flex;
    box-shadow: $base-box-shadow;
    &-item {
      transition: background-color 0.25s;
      padding: 20px 70px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #333333;
      cursor: pointer;
      &-text {
        position: relative;
        &:after {
          transition: opacity 0.25s;
          content: "";
          opacity: 0;
          position: absolute;
          display: block;
          background-image: linear-gradient(-134deg, #0bbfd5 0%, #6dd7b2 100%);
          min-width: 40px;
          width: 80%;
          height: 2px;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    &-item-active {
      background-color: #fff;
      .tab-bar-item-text {
        &:after {
          opacity: 1;
        }
      }
    }
  }
}
.tab-inner {
  box-shadow: $base-box-shadow;
  .tab-bar {
    box-shadow: none;
  }
  .tab-content {
    background-color: #fff;
    padding: 30px 30px 40px;
  }
}
</style>


