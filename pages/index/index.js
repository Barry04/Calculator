// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    result: '',//结果
    step: '=',//
    prevResult: '',//上一次运算表达式
    oper:0 ,//用于判断输入两次运算符的
    iscalc:false, //首次计算为false，计算后为true再次开始计算false
  },

isOperator :function(value) {
  var operatorString = '+-*/()×÷%';
  return operatorString.indexOf(value) > -1;
},

getPriority:function (value) {
  if (value == '-' || value == '+') {
      return 1;
  } else if (value == '*' || value == '/' || value == '×' || value ==
      '÷'|| value =='%') { return 2; } else { return 0; }
},

priority: function (v1, v2) {
  return this.getPriority(v1) <= this.getPriority(v2);
},

infix2Rpn: function (exp) {
  var inputStack = []; //存储中缀表达式各个元素的栈
  var optStack = []; //运算符栈
  var outputQueue = []; //后缀表达式栈
  var firstIsOperator = false;
  // 双/间表示正则表达式，/s表示任意非Unicode空白符的字符，g表示全局匹配而不是找到一个就停止
  exp.replace(/\s/g, '');
  if (this.isOperator(exp[0])) {
      exp = exp.substring(1);
      firstIsOperator = true;
  }
  for (var i = 0, max = exp.length; i < max; i++) {
      if (!this.isOperator(exp[i]) && !this.isOperator(exp[i - 1]) && (i != 0)) {
          // 如果当前元素和前一个元素均是数字，表明这是一个完整数字，则将栈顶元素和当前扫描到的元素连接，形成新的栈顶元素
          inputStack[inputStack.length - 1] = inputStack[inputStack.length - 1] + exp[i] + '';
      } else {
          // 其他情况（扫描到个位数、运算符），直接压入栈顶
          inputStack.push(exp[i]);
      }
  }
  // 如果输入栈第一个是运算符，说明是-号，把该元素加-号
  if (firstIsOperator) {
      inputStack[0] = -inputStack[0]
  }
  // 从inputStack循环遍历中缀表达式的元素
  while (inputStack.length > 0) {
      var cur = inputStack.shift(); //shift()把数组的第一个元素从其中删除，并返回第一个元素的值。
      // 如果扫描到运算符，则分情况判断
      if (this.isOperator(cur)) {
          if (cur == '(') {
              optStack.push(cur);
          } else if (cur == ')') {
              // 扫描到右括号时，弹出运算符栈中的元素压入输出队列，直至遇到左括号
              var po = optStack.pop(); //pop()删除并返回数组的最后一个元素，模拟出栈。
              while (po != '(' && optStack.length > 0) {
                  outputQueue.push(po);
                  po = optStack.pop();
              }
          } else {
              // 当前运算符优先级小于等于运算符栈顶元素时，栈顶运算符出栈压入输出队列中
              while (this.priority(cur, optStack[optStack.length - 1]) && optStack.length > 0) {
                  outputQueue.push(optStack.pop());
              }
              optStack.push(cur)
          }
      } else { // 如果扫描到数字，则直接压入后缀表达式栈中
          outputQueue.push(Number(cur));
      }
  }
  // 经过上面的遍历后如果运算符栈中还有元素，则全部压入输出队列中
  if (optStack.length > 0) {
      while (optStack.length > 0) {
          outputQueue.push(optStack.pop());
      }
  }
  return outputQueue;
},

calRpnExp : function (rpnArr) {
  var stack = [];
  for (var i = 0, max = rpnArr.length; i < max; i++) {
      // 如果是数字，则压入堆栈
      if (!this.isOperator(rpnArr[i])) {
          stack.push(rpnArr[i]);
      } else { // 如果是运算符，则从栈顶取出两个数字进行运算，结果压回栈中
          var num1 = stack.pop();
          var num2 = stack.pop();
          if (rpnArr[i] == '-') {
              var num = num2 - num1;
          } else if (rpnArr[i] == '+') {
              var num = num2 + num1;
          } else if (rpnArr[i] == '*' || rpnArr[i] == '×') {
              var num = num2 * num1;
          } else if (rpnArr[i] == '/' || rpnArr[i] == '÷') {
              var num = num2 / num1;
          }else if(rpnArr[i] == '%' ){
              var num = num2 % num1;
          }
          stack.push(num);
      }
  }
  return stack[0];
},

calInfixExp:function (exp) {
  var rpnArr = this.infix2Rpn(exp);
  return this.calRpnExp(rpnArr)
},

click:function(evt){
  let iscalc = this.data.iscalc
  if(iscalc){
    this.setData({
      iscalc:false,
      prevResult: '',
      result:'' 
    })
  }
    //console.log(evt.currentTarget.dataset.value)
    this.data.result+=evt.currentTarget.dataset.value
    //console.log( this.data.result)
    let result = this.data.result
    this.setData({
      result:result,
      oper:0
     })
   
  },

  equal:function(evt){
    // 
    let expression = this.data.result
    //console.log(expression)
  
    this.setData({
      iscalc:true,
      prevResult:  expression, 
      result: this.calInfixExp(expression),
    })
  },

  operator: function(evt){
    let iscalc = this.data.iscalc
  if(iscalc){
    this.setData({
      iscalc:false,
      prevResult: '', 
    })
  }
    let oper = this.data.oper
    oper++
    // console.log(oper)
    let result = this.data.result
     let op = evt.currentTarget.dataset.value
    if(oper===2){
    
      result = result.length === 1 ? '' : result.substring(0, result.length - 1)
      oper = 1
    }
    result += op
    this.setData({
      oper:oper,
      result:result
    })
   
  },

 clear:function(){
  this.setData({
    result:'',
    step: '',
    prevResult: ''
   })
 },

 detel:function(){
  let result = this.data.result
  this.setData({
    result: result.length === 1 ? '' : result.substring(0, result.length - 1)
  })
 },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
