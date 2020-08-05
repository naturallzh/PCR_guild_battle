const vm = new Vue({
  el: '#index-body',
  data: {
    combineCalcInput: {}, // 合刀计算器输入数据
    progressCalcInput: {}, // 进度计算器输入数据
    expCalcInput: {}, // 进度计算器输入数据
  },

  computed: {
    combineCalcRes: function () {
      return calcCombineRes(this.combineCalcInput.remainH,this.combineCalcInput.damageA,this.combineCalcInput.damageB)
    },
  },

  created () {
    this.init();
  },

  mounted () {
    addClass(getEl('index-body'),['fade-in']);
    this.timer = setTimeout(()=>{
      getEl('index-body').style.opacity = '100%';
      removeClass(getEl('index-body'),['fade-in']);
    },1510);
  },

  destroyed () {},

  methods: {
    init: function () {
      const combineCalcInput = {
        remainH: '',
        damageA: '',
        damageB: '',
      }
      this.combineCalcInput = combineCalcInput;
    }
  }
});
