// 页面载入loading
Vue.component('page-loading', {
  template: `
<transition name="fadeInOut">
  <div class="loadingMask page-loading" v-if="isLoading">
    <div class="circle-image-1"></div>
    <div class="circle-image-2"></div>
    <div class="main-text">
      载入中
      <span class="dot-1">.</span>
      <span class="dot-2">.</span>
      <span class="dot-3">.</span>
    </div>
    <span class="sub-text">初次载入可能较慢 请耐心等待</span>
    <span class="sub-text">如长时间没有响应 可ctrl+f5强制刷新页面</span>
  </div>
</transition>
`,

  data: function () {
    return {
    }
  },
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },
  },
});

// 回到首页按钮
Vue.component('back2main', {
  template: `
<div class="back2main">
  <i-button to="index.html" target="_blank">返回首页</i-button>
</div>
`,
});
