class Tool {
  //格式化日期
  formatDate(value, format) {
    //value: 日期对象 || 日期字符串
    //format: 格式 ==> 比如 yyyy-MM-dd hh:mm:ss
    //月日时分秒不足十补零, 比如 M 不需要补零, 如果是MM, 并且月份不足十，则需要补零

    if (Object.prototype.toString.call(value) !== ['object Date']) {
      value = new Date(value);
    }

    //获取年份
    let yearReg = /(y+)/;

    if (yearReg.test(format)) {

      //获取匹配组的内容
      let yearContent = RegExp.$1;


      //获取年份
      let year = value.getFullYear().toString();


      let yearText = year.slice(4 - yearContent.length);

      format = format.replace(yearContent, yearText);

    }

    let dateObject = {
      M: value.getMonth() + 1,
      d: value.getDate(),
      h: value.getHours(),
      m: value.getMinutes(),
      s: value.getSeconds()
    };

    //遍历dateObject替换format
    for (let key in dateObject) {

      //动态创建正则表达式
      let reg = new RegExp(`(${key}+)`);


      if (reg.test(format)) {


        //获取匹配组的内容
        let content = RegExp.$1;

        format = format.replace(content, content.length === 1 ? dateObject[key] : dateObject[key] >= 10 ? dateObject[key] : `0${dateObject[key]}`);

      }

    }


    return format;
  }
  // 日期格式化
  parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
      return null;
    }
    const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
      date = time;
    } else {
      if (typeof time === "string" && /^[0-9]+$/.test(time)) {
        time = parseInt(time);
      } else if (typeof time === "string") {
        time = time
          .replace(new RegExp(/-/gm), "/")
          .replace("T", " ")
          .replace(new RegExp(/\.[\d]{3}/gm), "");
      }
      if (typeof time === "number" && time.toString().length === 10) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === "a") {
        return ["日", "一", "二", "三", "四", "五", "六"][value];
      }
      if (result.length > 0 && value < 10) {
        value = "0" + value;
      }
      return value || 0;
    });
    return time_str;
  }
  //el-form 表单信息重置
  resetForm(formName) {
    this.$refs[formName].resetFields();
  }
  //语音播报
  voiceBroadcast() {
    var text = `“那还不赶紧去催！”
　　“是！”
　　可没过一会儿，前去催促的船员就回来了，还带来了一个不好的消息。
　　“什么？没有了？”
　　“是……对方说他的酒窖在昨天不知道被什么人给端了，连一桶小麦酒都没给他留下。现在说什么都来不及完成和我们的这笔交易了。”
　　`;
    var msg = new SpeechSynthesisUtterance(text);
    msg.value = 2;  // 音量
    msg.lang = "zh-CN";//使用的语言:中文
    msg.volume = 1;//声音音量:0-1
    msg.rate = 0.8;//语速:0-10
    msg.pitch = 0.8;//音高:0-1
    window.speechSynthesis.speak(msg);//播放
    msg.onend = () => {
      console.log("语音播报结束");
    }
  }
}

export const tool = new Tool();