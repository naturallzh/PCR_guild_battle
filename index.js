const vm = new Vue({
  el: '#index-body',
  data: {
    isLoading: true,
  },

  computed: {
  },

  created () {},

  mounted () {
    //setTimeout(()=>{this.isLoading = false;},1000)
    this.isLoading = false;
  },

  destroyed () {},

  methods: {
  }
});
