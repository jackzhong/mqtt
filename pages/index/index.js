//index.js
//获取应用实例
const app = getApp()
var mqtt = require('../../utils/mqtt.js');
var client = null;
var topicMsg = "mqtt/loop/message";
var revmsg1 = null;
Page({
  data: {
    revmsg:'test',
    sendmsg:null,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
 
  connectServer: function() {
    const options = {
        connectTimeout: 4000, // 超时时间
        clientId: 'wx_mobile',
        port: 8083,  //重点注意这个,坑了我很久
        // username: 'xxx',
        // password: 'xxx',
    }

    client = mqtt.connect('wx://81.70.155.157/mqtt', options);
    client.that = this;
    client.on('reconnect', (error) => {
        console.log('正在重连:', error)
    });

    client.on('error', (error) => {
        console.log('连接失败:', error)
    });
   
    client.on('connect', (e) => {
        console.log('成功连接服务器')
　　　　　　　//订阅一个主题
        client.subscribe(topicMsg, {
            qos: 0
        }, function(err) {
            if (!err) {
                console.log("订阅成功")
            }
        })
    })
    client.on('message', function (topic, message) {
        console.log('received msg:' + message.toString());
        this.that.setData({
          revmsg:message.toString()
        });
    })
},
  publishMqtt: function(){
    client.publish(topicMsg, this.data.sendmsg);
},
connectMqtt:function()
{
  this.connectServer();
},

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getMsg:function(e){
    var val = e.detail.value;
    this.setData({
      sendmsg:val
    })
  }
})
