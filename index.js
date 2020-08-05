const vm = new Vue({
  el: '#index-body',
  data: {
    combineCalcInput: {}, // 合刀计算器输入数据
    progressCalcInput: {}, // 进度计算器输入数据
    expCalcInput: {}, // 进度计算器输入数据

    modals: {}, // 控制模态框是否显示的标识
    modalsContent: {},
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
      this.combineCalcInput = {
        remainH: '', damageA: '', damageB: '',
      };
      // 初始化进度计算器输入数据
      this.progressCalcInput = {
      };
      // 初始化进度计算器输入数据
      this.expCalcInput = {
        curLvl: '', curExp: '', tarLvl: '',
        dailyPow2: false, dailyExp2: false,
      };
      // 初始化模态框标识状态
      this.modals = {
        playerExpInfo: false,
      };
      this.modalsContent = DATA_modalsContent;
    },

  }
});
