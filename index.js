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
      getEl('index-body').style.opacity = '1';
      removeClass(getEl('index-body'),['fade-in']);
    },1600);
  },

  destroyed () {},

  methods: {
    init: function () {
      // 初始化合刀计算器输入数据
      const combineCalcInput = {
        remainH: '', damageA: '', damageB: '',
      }
      this.combineCalcInput = combineCalcInput;
      // 初始化进度计算器输入数据
      const progressCalcInput = {
      }
      this.progressCalcInput = progressCalcInput;
      // 初始化进度计算器输入数据
      const expCalcInput = {
        curLvl: '', curExp: '', tarLvl: '',
        dailyPow2: false, dailyExp2: false,
      }
      this.expCalcInput = expCalcInput;
    },
  }
});
