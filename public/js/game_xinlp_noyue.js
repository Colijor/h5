wordId=0;//每条词条的ID标记
var globalWords;//词条数组
var randomWord=new Object();//随机词条
var initialValue=90;//退出游戏总时长
var thumbsUp=300;//点赞倒计时总时长
randomWord.title="";
randomWord.gameRule="";
let isConnect=true;
let serverIp_ = "game.hdiandian.com";//h5正式，game测试
var userId = localStorage.getItem("userId");
//对话框提示
$("body").append(`<div id="dailog" style="width: 100%;height: 100%;background: rgba(0,0,0,.5);position: absolute;top: 0;display: none;z-index: 100;">
    <p class="dailogInfo" style="width: 300px;height: 200px;background: white;position: absolute;top:50%;left:50%;transform: translate(-50%,-50%);text-align: center;line-height: 200px"></p>
</div>`);

//退出游戏
var escGameBtn = document.getElementById("escGameBtn");
escGameBtn.addEventListener('touchstart', function () {
    escGameBtn.src = "/h5/public/image/roulette/escGame.png";
}, false);
escGameBtn.addEventListener('touchend', function () {
    escGameBtn.src = "/h5/public/image/roulette/escGamePress.png";
}, false);


//点击“修改”按钮按钮背景变换
var modify = document.getElementById("modify");
modify.addEventListener('touchstart',function() {
    modify.src = ("/h5/public/image/roulette/xiugai2.png");
},false);
modify.addEventListener('touchend',function() {
    modify.src = ("/h5/public/image/roulette/xiugai.png");
},false);


//退出游戏倒计时
function jump(){
    if(initialValue>=0){
        $(".countDown").text(initialValue--);
    }else {
        clearInterval(time);
        isConnect=false;
        // WebSocketTest('escGame');//发送退出游戏消息给服务器
        ws.close();
    };
};
//time = setInterval(jump,1000);

//重置退出游戏倒计时
function reCountDown() {
    if(time){
        clearInterval(time);
    };
    initialValue=300;
    time =setInterval(jump,1000);
}

//退出游戏
$("#escGameBtn").click(function () {
    //clearInterval(time);
    //isConnect=false;
    //WebSocketTest('escGame');//发送退出游戏消息给服务器
    ws.close();
    $(".escGame").hide();
});

var buffer;
var boxNumber = $.getUrlParam('boxNumber');
var userId = localStorage.getItem("userId");
var userName = localStorage.getItem("userName");
var headUrl = localStorage.getItem("headUrl");

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

var i = 0;
var enablePlay = true;
let isTopay = true;

//1、调用接口随机获取一条词库展示
$.ajax({
    type: "GET",
    // url: "https://"+ serverIp_ +"/wxbackstage/game/get/allWheelDiscRules/123",
    url: "https://"+ serverIp_ +"/wxbackstage/client/lp/random",
    data: {boxId: boxId_},
    dataType: "json",
    async: false,
    success: function (data) {
        //alert("接收的词条：");
        //alert(data.data.gameRule);
        var words = data.data;
        if(words){
            $("#cikuFont").text(words.gameRule);
        }
    },
    error: function (data) {
        //alert("请求获取词库失败");
    }
});

var glodNum = 10;//根据后台游戏码一致（注：区分测试和正式）现在测试和正式的gameCode都是10
$.ajax({//支付金额
    type:"get",
    contentType: 'application/json; charset=UTF-8',
    url: "https://"+ serverIp_ +"/wxbackstage/payItem/get/",
    dataType: "json",
    data:{
        "boxId": boxNumber,
        "gameCode": glodNum
    },
    success: function(res){
        var money = (res.data[0].money)/100;
        if(money<10 && money != 0.01){
            money = money+".00";
        }else if(money > 10) {
            money = money+".0";
        }
        $("#accountNum").text(money);
    },
    error: function(res){
        //alert("获取支付金额失败")
    }
})


// 显示灰色游戏规则界面的 jQuery 遮罩层
function ysgz_showBg() {

    $("#container_yxgz").show();
    $(".modify").addClass("modifydown");
//遮罩
    var bh = $("body").height();
    var bw = $("body").width();
    $("#ysgz_fullbg").css({
        height: bh,
        width: bw,
        display: "block"
    });
    $("#ysgz_dialog").show();
    $("#neirong").val("");

    var gameRule=$("#cikuFont").text();
    $("#neirong").val(gameRule);

}

//修改数据
function modifyBtn() {
    var gameRule=$("#neirong").val();
    if(gameRule == ''){
        gameRule = "正在使用的词库..."
    }
    $.ajax({//获取余额
        type:"get",
        contentType: 'application/json; charset=UTF-8',
        url: "https://"+ serverIp_ +"//wxbackstage/memberAccount/info/"+userId,
        data:"",
        dataType: "json",
        success: function(data){
            if(data.code==0){
                var account=Number(data.data.account);//单位分
                var money = account/100;
                $('.yueSpan').text("余额："+ money +"元");
                if(account>=1){//查询余额
                    if(isTopay == true){
                        $.ajax({//消费余额
                            type: "post",
                            contentType: 'application/json; charset=UTF-8',
                            async:true,
                            url: "https://"+ serverIp_ +"//wxbackstage/memberAccount/spend",
                            data:JSON.stringify({
                                account:1,
                                memberId:userId
                            }),
                            dataType: "json",
                            success: function(data){
                                $("#cikuFont").text(gameRule);
                                ysgz_closeBg();//关闭弹窗
                            },
                            error:function (data) {
                                //alert("消费失败");
                            }
                        });
                    }
                }else {
                    // alert("余额不足，请充值，充值完成重新提交即可");
                    //跳转到微信小程序中支付中...
                    wx.miniProgram.navigateTo({url:'/pages/wdfx/chongzhi/chongzhi?userId=' + userId});
                }
            };
            if(data.code==-1){
                // alert("余额不足，请充值，充值完成重新提交即可");
                //跳转到微信小程序中支付中...
                wx.miniProgram.navigateTo({url:'/pages/wdfx/chongzhi/chongzhi?userId=' + userId});
            };
        },
        error:function (data) {
            //alert("请求余额失败");
        }
    });
}

//关闭灰色 jQuery 遮罩
function ysgz_closeBg() {
    //更新数据
    $("#container_yxgz").hide();
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
})()

//显示灰色 jQuery 遮罩层
function showBg() {
    var randomWord = $("#cikuFont").text();
    // if (enablePlay){
    if(randomWord){
        WebSocketTest('actionsReq', "词库", randomWord);
    }
    var bh = $("body").height();
    var bw = $("body").width();
    $("#fullbg").css({
        height: bh,
        width: bw,
        display: "block"
    });
    $("#dialog").show();
    setTimeout(function () {//5秒后隐藏
        $("#fullbg,#dialog").hide();/*3秒后那个提示看大屏幕的消息隐藏*/
    }, 3000);
    // }else {
    //     // alert("请等待下一局");
    //     $("#dailog").show();
    //     $(".dailogInfo").text("请等待下一局");//提示对话框测试
    // };
}

var ws = null;
var thisServerWs ;
var heartCheck = {
    timeout: 60000,//60ms
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        setInterval(this.timeoutObj);
        // clearTimeout(this.serverTimeoutObj);
        this.start();
    },
    start: function(){
        // var self = this;
        this.timeoutObj = setInterval(function(){
            ws.send("HeartBeat");
            // self.serverTimeoutObj = setTimeout(function(){
            //     ws.close();
            // }, self.timeout)
        }, this.timeout)
    },
};

//2、连接服务器
WebSocketInit();
function WebSocketInit() {
    if ("WebSocket" in window){
        thisServerWs = "wss://"+ serverIp_ +"/newGameServer/websocket?id="+userId+"&screenCode="+boxNumber;
        ws = new WebSocket(thisServerWs);
        ws.onopen = function () {
            heartCheck.start();//心跳发送
            // var boxNumber = $.getUrlParam('boxNumber');
            //alert("连接成功")
            if (boxNumber && boxNumber != null) {
                let msg = {
                    userId: userId,
                    userName: userName,
                    headUrl: headUrl
                };
                msg = JSON.stringify(msg);
                sendData.msg = msg;
                sendData.type = 1;
                enCodeMsg(sendData);
            } else {
                alert("网络不好，请退出重新扫码！");
            };
        };
        ws.onmessage = function (evt) {
            heartCheck.reset();//重置心跳
            var data = evt.data;
            //var obj = eval('(' + data + ')');//将字符串转换成JSON
            protobuf.load("/h5/public/protobuf/common.proto",function(err,root) {
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
                    if (obj.type == 42) {//游戏通知玩家转盘正在转动
                        //隐藏取消游戏倒计时按钮
                        //clearInterval(time);
                        $(".escGame").hide();
                        $("#tip_zdz").show();
                        /*当提示看大屏幕的字体消失后，“等待其他玩家显示”*/
                        $(".anniu").hide();
                        /*玩家按钮显示后，中间按钮图片隐藏*/
                    } else if (obj.type == 43) {//游戏结束，重新再来一局
                        $(".anniu").show();
                        /*重新开一局的时候，中间的按钮图片显示*/
                        $("#tip_zdz").hide();
                        /*重新开一局的时候，“等待其他玩家显示” 隐藏*/
                        //重置退出游戏倒计时
                        $(".escGame").show();
                        //reCountDown();
                    } else if (obj.type == 12) {
                        //alert("您已退出游戏，请重新扫码");
                        ws.close();
                        $("#dailog").show();
                        $(".dailogInfo").text("您已退出游戏，请重新扫码");//提示对话框测试

                    } else if (obj.type == 2) {
                        //alert("人数已满，请稍后连接");
                        ws.close();
                        $("#dailog").show();
                        $(".dailogInfo").text("人数已满，请稍后连接");//提示对话框测试
                    } else if (obj.type == 10){//充值成功，直接扣费
                        //toFind();
                        modifyBtn();
                    }
                }
            })
        };

        ws.onclose = function () {
            //alert("您已断开连接,请重新扫码");
            // isConnect = false;
            // if(isConnect==true){
            //     ws = null;
            //     $("#dailog").show();
            //     $(".dailogInfo").text("您已断开连接,请重新扫码");//提示对话框测试
            //     //getInitData();
            //     //initUserInfo();
            //// }     //WebSocketInit();
            // }else {
            //     $("#dailog").show();
            //     $(".dailogInfo").text("您已断开连接,请重新扫码");//提示对话框测试

            ws = null;
            $("#dailog").show();
            $(".dailogInfo").text("您已断开连接,请重新扫码");//提示对话框测试
        };

        // ws.onerror = function () {
        //     alert(ws.readyState);
        //     if(ws.readyState != 1){
        //         thisServerWs = "wss://"+ serverIp_ +"/newGameServer/websocket?id="+userId+"&screenCode="+boxNumber;
        //         ws = new WebSocket(thisServerWs);
        //     }else{
        //         ws.close();
        //         thisServerWs = "wss://"+ serverIp_ +"/newGameServer/websocket?id="+userId+"&screenCode="+boxNumber;
        //         ws = new WebSocket(thisServerWs);
        //     }
        // }
    }else {
        alert("您的浏览器不支持 WebSocket!");
    };
}

function WebSocketTest(type, title, action) {
    if (ws == null) {
        WebSocketInit();
    }
    var boxNumber = $.getUrlParam('boxNumber');
    if (boxNumber && boxNumber != null) {
        if (type == 'power') {//two
            // if (enablePlay){
            //     ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"TruthAdventure_Control_power"}');
            //     enablePlay = false;
            // }
        } else if (type == 'actionsReq') {//one
            //ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"TruthAdventure_CurActionsReq","_msg_object_str":{\"titles\":\"' + title + '\", \"actions\":\"' + action + '\"}}');
            let msg = {title: title, content: action};
            msg = JSON.stringify(msg);
            sendData.msg = msg;
            sendData.type = 40;
            enCodeMsg(sendData);
        }
    } else {
        alert("网络不好，请退出重新扫码！");
    }
}


$("#neirong").focus(function(){
    $("#neirong").val("");
});