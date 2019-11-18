let serverIp_ = "h5.hdiandian.com";//h5正式，game测试
var userId = localStorage.getItem("userId");
var boxNumber = localStorage.getItem("boxNumber");
//对话框提示
$("body").append(`<div id="dailog" style="width: 100%;height: 100%;background: rgba(0,0,0,.5);position: absolute;top: 0;display: none;z-index: 100;">
    <p class="dailogInfo" style="width: 300px;height: 200px;background: white;position: absolute;top:50%;left:50%;transform: translate(-50%,-50%);text-align: center;line-height: 200px"></p>
</div>`);

let elValue = 0.1;

// 长按事件
var time = null, //初始化起始时间
    $cont = $('#prog'),
    $bar = $cont.find('.progress'),
    value = 0,
    times = 0;//发送力度以速度计算
function reset() {
    clearInterval(time);
    time = null;
    value = 0;
    $bar.css('height', '0%');
    time = setInterval(function () {
        increment();
    }, 50)
}
function increment() {
    value += 1;
    $bar.css('height', value + '%').text(value + '%');
    if (value === 100) {
        clearInterval(time);
	    time = null;
	    value = 0;
        return;
    }
}

var anniu = document.getElementById("anniu");
var pg = document.getElementById('pg');
anniu.addEventListener('touchstart', function () {
    //anniu.src = "/h5/public/image/shandiangou/up.png";
    //$('.anniu').css("background", "url(/h5/public/image/shandiangou/up.png) no-repeat center/100% 100%");
    reset();
}, false);
anniu.addEventListener("touchend", function () {
    /*当提示看大屏幕的字体*/
    showBg();
    // anniu.src = "/h5/public/image/shandiangou/down.png";
    //$('.anniu').css("background", "url(/h5/public/image/shandiangou/down.png) no-repeat center/100% 100%");
    clearInterval(time);
    time = null;
    if (value === 0) {
        elValue = 0.1;
    } else if (value === 100) {
        elValue = 1 / 1000;
    } else {
        elValue = (100 - value) / 1000;
    }
    value = 0;
    $bar.css('height', '0%').text('');
    startGame();
}, false);

var buffer;
var sendData = {
    sendId: userId,
    receiverId: boxNumber,
    type: 1,
    msg: ""
};
function enCodeMsg(data) {
    protobuf.load("/h5/public/protobuf/common.proto", function (err, root) {
        if (err) throw err;
        var Common = root.lookup("Common");
        var message = Common.create(data);
        buffer = Common.encode(message).finish();
        ws.send(buffer)
    });
}

/*轮盘首页界面样式---------------------------------------------------------*/
let userName = '';
let headUrl = '';

//1.获取用户信息
$.ajax({
    url: serverUrl + "/wxbackstage/wechat/member/info/" + userId,
    type: "get",
    dataType: "json",
    data: "",
    async: false,//取消异步
    success: function (data) {
        headUrl = data.data.avatarUrl;
        userName = data.data.name;
        //alert("1获取用户信息成功");
    }
});

//点击开始游戏
//显示灰色 jQuery 遮罩层
function startGame() {
    let msg = { userId: userId, money: 0, time: elValue };
    msg = JSON.stringify(msg);
    sendData.msg = msg;
    sendData.type = 4;
    enCodeMsg(sendData);
}
// 提示提示看大屏幕"
function showBg() {
    var bh = $("body").height();
    var bw = $("body").width();
    $("#fullbg").css({
        height: bh,
        width: bw,
        display: "block"
    });
    $("#dialog").show();
    // setTimeout(function () {//5秒后隐藏
    //     $("#fullbg,#dialog").hide();/*3秒后那个提示看大屏幕的消息隐藏*/
    // }, 3000);
}

/*判断屏幕的横屏，还是竖屏*/
(function rotate() {
    var orientation = window.orientation;
    if (orientation == 90 || orientation == -90) {

        document.body.style.display = 'none';
        //alert("为方便使用，请使用竖屏访问！，请把选择页面选择锁定竖屏");
    }
    window.onorientationchange = function () {
        document.body.style.display = "block";
        rotate();
    };
})();

var ws = null;
var thisServerWs;
var heartCheck = {
    timeout: 60000,//60ms
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function () {
        setInterval(this.timeoutObj);
        // clearTimeout(this.serverTimeoutObj);
        this.start();
    },
    start: function () {
        // var self = this;
        this.timeoutObj = setInterval(function () {
            ws.send("HeartBeat");
            // self.serverTimeoutObj = setTimeout(function(){
            //     ws.close();
            // }, self.timeout)
        }, this.timeout)
    },
};

//连接服务器
WebSocketInit();
function WebSocketInit() {
    if ("WebSocket" in window) {
        thisServerWs = "wss://" + serverIp_ + "/newGameServer/websocket?id=" + userId + "&screenCode=" + boxNumber;
        ws = new WebSocket(thisServerWs);
        ws.onopen = function () {
            heartCheck.start();//心跳发送
            //alert("连接成功")
            let msg = {
                userId: userId,
                userName: userName,
                headUrl: headUrl
            };
            msg = JSON.stringify(msg);
            sendData.msg = msg;
            sendData.type = 1;
            enCodeMsg(sendData);
        };
        ws.onmessage = function (evt) {
            heartCheck.reset();//重置心跳
            var data = evt.data;
            protobuf.load("/h5/public/protobuf/common.proto", function (err, root) {
                if (err) throw err;
                var Common = root.lookup("Common");
                var reader = new FileReader();
                reader.readAsArrayBuffer(data);
                reader.onload = function (ev) {
                    var buf = new Uint8Array(reader.result);
                    var message = Common.decode(buf);
                    if (message.msg != '') {
                        message.msg = JSON.parse(message.msg);
                    }
                    var obj = message;
                    // alert("返回的数据data")
                    // alert(obj.type)
                    if (obj.type == 71) {//游戏通知玩家游戏正在进行中
                        // /*当提示看大屏幕的字体*/
                        // showBg();
                        /*玩家按钮显示后，中间按钮图片隐藏*/
                        $(".LotteryResults").hide();
                        // 中奖结果隐藏
                    } else if (obj.type == 72 && obj.msg) {//游戏通知玩家抽奖结果
                        /*当提示看大屏幕的字体消失*/
                        $("#fullbg,#dialog").hide();
                        /*显示中奖结果*/
                        if (obj.msg.name === "谢谢惠顾") {
                            document.getElementById('tipImg').src = "/h5/public/image/shandiangou/wzjtishi.png";
                            $(".lotteryTip").text('');
                            $(".LotteryResults").show();
                        } else {
                            document.getElementById('tipImg').src = "/h5/public/image/shandiangou/zjtishi.png";
                            $(".lotteryTip").text("获得 " + obj.msg.name);
                            $(".LotteryResults").show();
                        }
                    } else if (obj.type == 73) {//游戏结束，重新再来一局
                        /*当提示看大屏幕的字体消失*/
                        $("#fullbg,#dialog").hide();
                        // 中奖结果隐藏
                        $(".lotteryTip").text("");
                        $(".LotteryResults").hide();
                    } else if (obj.type == 12) {
                        //alert("您已退出游戏，请重新扫码");
                        ws = null;
                        $("#dailog").show();
                        $(".dailogInfo").text("您已退出游戏，请重新扫码");//提示对话框测试

                    } else if (obj.type == 2) {
                        ws = null;
                        $("#dailog").show();
                        $(".dailogInfo").text("人数已满，请稍后连接");//提示对话框测试
                    } else if (obj.type == -4) {
                        ws = null;
                        $("#dailog").show();
                        $(".dailogInfo").text("游戏不在线");//提示对话框测试
                    }
                }
            })
        };

        ws.onclose = function () {
            ws = null;
            $("#dailog").show();
            $(".dailogInfo").text("您已断开连接,请重新扫码");//提示对话框测试
        };
    } else {
        alert("您的浏览器不支持 WebSocket!");
    };
}

function WebSocketTest(type) {
    if (ws == null) {
        WebSocketInit();
    }
    var boxNumber = localStorage.getItem("boxNumber");
    if (boxNumber && boxNumber != null) {

    } else {
        alert("网络不好，请退出重新扫码！");
    }
}

// 查看我的奖券
function wdjqFun() {
    wx.miniProgram.navigateTo({ url: '/pages/wd/wdjq/wdjq?userId=' + userId });
}

function closeTip() {
    $(".LotteryResults").hide();
}