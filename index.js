let vm = new Vue({
  el: '#index-body',
  data: {
    nameMap: [],
    mobParas: [],
    combineRule: [],
    actionData: [],

    loadingMask: true,

    time: {
      updateTime: new Date(2020,4,14,16,25),
      startTime: new Date(2020,4,7,5),
      curTime: new Date(),
      endTime: new Date(2020,4,14,23,59),
      countdownTimer: null,
    },
    genSit: null,   // general situation
    combineParas: {
      remainHealth: "",
      damageA: "",
      damageB: "",
    },
    historyDateObj: {},
    damageFigurePara: [],

    popupFlags: {
      damageFigure: false,
      historyLogDone: false,
      historyLogTodo: false,
    },
  },

  computed: {
    combineRes: function () {
      const _this = this;
      let {remainHealth, damageA, damageB} = this.combineParas;
      let res = [];
      const flag1 = remainHealth==parseInt(remainHealth);
      const flag2 = damageA==parseInt(damageA);
      const flag3 = damageB==parseInt(damageB);
      const flag4 = (parseInt(damageA) + parseInt(damageB)) > parseInt(remainHealth);
      const flag5 = parseInt(remainHealth)>0 && parseInt(damageA)>0 && parseInt(damageB)>0;
      if (flag1 && flag2 && flag3 && flag4 && flag5) {
        const num1 = parseInt(damageB)/(parseInt(remainHealth)-parseInt(damageA));
        const num2 = parseInt(damageA)/(parseInt(remainHealth)-parseInt(damageB));
        res = [calcRefund(num1),calcRefund(num2)];
      }

      function calcRefund(num) {
        for (let i=0;i<_this.combineRule.length-1;i++) {
          if (num<_this.combineRule[i+1].factor) {
            return _this.combineRule[i+1].refund;
          }
        }
        return 90;
      }
      return res;
    },

    damageFigureData :function () {
      return this.playerTotalDamageByDay(this.damageFigurePara);
    }
  },

  beforeCreate () {},
  created () {
    this.initData();
    this.time.countdownTimer = setInterval(()=>{this.time.curTime = new Date()},498);
    this.checkData();
  },

  beforeMount () {},
  mounted () {
    this.loadingMask = false;
  },

  destroyed () {
    clearInterval(this.time.countdownTimer);
  },

  methods: {

    initData: function () {
      this.nameMap = DATA_nameMap;
      this.mobParas = DATA_mobParas;
      this.combineRule = DATA_combineRule;
      this.actionData = DATA_actionData;

      this.genSit = {
        curDay: Math.ceil((this.time.curTime - this.time.startTime)/1000/3600/24),
        curBossIdx: this.actionData[this.actionData.length-1].bossIdx,
        remainHealth: "",
        remainHealthPer: "",
      };

      this.historyDateObj = {
        curSelect: 0,
        dateArr: [],
      };
      for (let i=1;i<=this.genSit.curDay;i++) {
        this.historyDateObj.dateArr[i-1] = i;
        this.damageFigurePara[i-1] = false;
      }
      this.damageFigurePara[this.genSit.curDay-1] = true;
    },

    // 检查输入(人名和伤害)
    checkData: function () {
      const nameMap = this.nameMap;
      const mobParas = this.mobParas;
      const actionData = this.actionData;

      for (let i=0; i<actionData.length; i++) {
        for (let j=0; j<actionData[i].log.length; j++) {
          const nameStr = actionData[i].log[j].name;
          if (!checkName(nameStr)) {
            console.log(actionData[i].day + "-" + actionData[i].bossIdx + "-" + nameStr);
          }
        }
      }
      console.log("name check finish");
      console.log("%==============================%");

      let healthSum = 0;
      let curBossIdx = 1;
      for (let i=0; i<actionData.length; i++) {
        let maxDamage = 0;
        for (let j=0; j<actionData[i].log.length; j++) {
          healthSum += actionData[i].log[j].damage;
          if (actionData[i].log[j].damage>maxDamage) {
            maxDamage = actionData[i].log[j].damage;
          }
          if (actionData[i].log[j].damage===0) {
            actionData[i].log[j].desc = "吞刀";
          }
        }
        actionData[i].maxDamage = maxDamage;
        const remainHealth = (mobParas[curBossIdx-1].health-healthSum);
        if (remainHealth <= 0) {
          if (remainHealth === 0 && actionData[i].day>1) {
            actionData[i].log[actionData[i].log.length-1].desc = "尾刀";
          }
          else if (remainHealth < 0 && actionData[i].day>1) {
            actionData[i].log[actionData[i].log.length-1].desc = "合刀";
            actionData[i].log[actionData[i].log.length-1].realDamage = actionData[i].log[actionData[i].log.length-1].damage + remainHealth;
          }
          console.log("boss-" + curBossIdx + ": " + remainHealth);
          healthSum = 0;
          curBossIdx++;
        }
      }
      this.genSit.curBossIdx = curBossIdx;
      this.genSit.remainHealth = mobParas[curBossIdx-1].health-healthSum;
      this.genSit.remainHealthPer = (this.genSit.remainHealth/mobParas[curBossIdx-1].health*100).toFixed(2);
      console.log("boss-" + curBossIdx + ": " + (mobParas[curBossIdx-1].health-healthSum));
      console.log("mob health check finish");
      console.log("%==============================%");

      function checkName(nameStr) {
        for (let i=0; i<nameMap.length; i++) {
          if (nameMap[i].name === nameStr) {
            return true;
          }
        }
        return false;
      }
    },

    processDateStr: function (dateObj) {
      let dateStr = "";
      dateStr += dateObj.getFullYear() + "年";
      dateStr += (dateObj.getMonth()+1) + "月";
      dateStr += dateObj.getDate() + "日 ";
      dateStr += dateObj.getHours() + ":";
      dateStr += dateObj.getMinutes()<10?"0"+dateObj.getMinutes():dateObj.getMinutes();
      return dateStr;
    },

    ms2timeStr: function (ms) {
      let timeStr = "";
      const D = Math.floor(ms/1000/3600/24);
      ms -= D*1000*3600*24;
      const H = Math.floor(ms/1000/3600);
      ms -= H*1000*3600;
      const M = Math.floor(ms/1000/60);
      ms -= M*1000*60;
      const S = Math.floor(ms/1000);
      timeStr = D+"天 "+(H>=10?"":"0")+H+":"+(M>=10?"":"0")+M+":"+(S>=10?"":"0")+S;
      return timeStr;
    },

    actionLogByDay: function (date) {

      const actionData = this.actionData;
      const nameMap = this.nameMap;

      const actionLog = {
        todo: [],
        done: [],
        todoNum: 0,
        doneNum: 0,
      };

      for (let i=0; i<nameMap.length; i++) {
        actionLog.todo[i] = {name: nameMap[i].name, todoNum: 3};
        actionLog.todoNum += 3;
      }

      for (let i=0; i<actionData.length; i++) {
        if (actionData[i].day !== date) {continue;}
        actionLog.done.push(actionData[i]);
        for (let j=0; j<actionData[i].log.length; j++) {
          if (actionData[i].log[j].desc==="合刀" || actionData[i].log[j].desc==="尾刀") {}
          else {
            actionLog.doneNum++;
            actionLog.todoNum--;
            for (let k=0; k<actionLog.todo.length; k++) {
              if (actionLog.todo[k].name === actionData[i].log[j].name) {
                actionLog.todo[k].todoNum--;
              }
            }
          }
        }
      }
      return actionLog;
    },

    playerTotalDamageByDay: function (dateArr) {
      const nameMap = this.nameMap;
      const mobParas = this.mobParas;
      const actionData = this.actionData;

      const dateArr2Num = [];
      for (let i=0;i<dateArr.length;i++) {
        if (dateArr[i]) {
          dateArr2Num.push(i+1);
        }
      }
      dateArr = dateArr2Num;

      const outputArr = [];
      for (let i=0;i<nameMap.length;i++) {
        outputArr[i] = {
          name: nameMap[i].name,
          total: 0,
          detail: []
        }
      }

      let dateIdx = 0;
      for (let i=0;i<actionData.length;i++) {
        if (dateArr[dateIdx] < actionData[i].day) {dateIdx++}
        if (dateIdx>dateArr.length-1) {break;}
        if (dateArr[dateIdx] > actionData[i].day) {continue}

        for (let j=0;j<actionData[i].log.length;j++) {
          for (let k=0;k<outputArr.length;k++) {
            if (actionData[i].log[j].name===outputArr[k].name) {
              outputArr[k].total += actionData[i].log[j].realDamage?actionData[i].log[j].realDamage:actionData[i].log[j].damage;
              let flag = true;
              for (let l=0;l<outputArr[k].detail.length;l++) {
                if (outputArr[k].detail[l].bossIdx===actionData[i].bossIdx) {
                  outputArr[k].detail[l].damage += actionData[i].log[j].realDamage?actionData[i].log[j].realDamage:actionData[i].log[j].damage;
                  flag = false;
                  break;
                }
              }
              if (flag) {
                outputArr[k].detail.push({bossIdx: actionData[i].bossIdx, damage: actionData[i].log[j].realDamage?actionData[i].log[j].realDamage:actionData[i].log[j].damage});
              }
            }
          }
        }
      }

      // 排序
      let resArr = [];
      resArr[0] = outputArr[0];
      for (let i=1;i<outputArr.length;i++) {
        if (outputArr[i].total >= resArr[0].total) {
          resArr.splice(0,0,outputArr[i]);
          continue;
        }
        if (outputArr[i].total <= resArr[resArr.length-1].total) {
          resArr.push(outputArr[i]);
          continue;
        }
        for (let j=0;j<resArr.length-1;j++) {
          if (outputArr[i].total > resArr[j+1].total && outputArr[i].total < resArr[j].total) {
            resArr.splice(j+1,0,outputArr[i]);
            break;
          }
        }
      }
      // this.damageFigureData = resArr;
      // console.log(resArr)
      return resArr;
    },

    shiftHistoryLogDone: function (date) {
      this.popupFlags.historyLogDone = !this.popupFlags.historyLogDone;
      this.historyDateObj.curSelect = date;
    },
    shiftHistoryLogTodo: function (date) {
      this.popupFlags.historyLogTodo = !this.popupFlags.historyLogTodo;
      this.historyDateObj.curSelect = date;
    },
    shiftDamageFigure: function () {
      this.popupFlags.damageFigure = !this.popupFlags.damageFigure;
    }
  }
});