$(document).ready(function(e) {
    //向上滑动
    // $("#fgTitle").click(function() {
    //     /*显示灰色 jQuery 遮罩层 */
    //     alert("弹出规则");
    //     var bh = $("body").height();
    //     var bw = $("body").width();
    //     $("#fullbg").css({
    //         height:bh,
    //         width:bw,
    //         display:"block"
    //     });
    //     //div标标往上移动
    //     if($('#tanchu').css('display') == 'none'){
    //         $("#tanchu").slideDown(100);
    //     }else{
    //         $("#fullbg,#tanchu").hide();
    //     }
    // });
    //向下滑动
    $("#chachatupian").click(function() {
        //div标标往下移动
        $("#fullbg,#tanchu").hide();
    });

    //刷新页面
    // $("#playAgain").attr("href","javascript:window.location.href = location.href+'?time='+((new Date()).getTime());");
    //退出  单次双选弹框
    // $("#escGame").click(function () {
    //     var dblChoseAlert = simpleAlert({
    //         "title":"温馨提示",
    //         "content":"确定退出游戏吗？",
    //         "buttons":{
    //             "确定":function () {
    //                 WebSocketTest('escGame');
    //                 dblChoseAlert.close();
    //             },
    //             "取消":function () {
    //                 dblChoseAlert.close();
    //             }
    //         }
    //     })
    // })
});

let againConnect=true;
(function rotate(){
    var orientation=window.orientation;
    if(orientation==90||orientation==-90){

        document.body.style.display='none';
        alert("为方便使用，请使用竖屏访问！，请把选择页面选择锁定竖屏");
    }
    window.onorientationchange=function(){
        document.body.style.display="block";
        rotate();
    };
})();

var ws = null;
let serverIp_ = "game.hdiandian.com";//h5正式，game测试

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

// function UrlSearch()
// {
//     var str=window.location.href;
//     str = decodeURIComponent(str);
//     var num = str.indexOf("?");
//     var num2 = str.substr(num+1).indexOf("?");
//     str = str.substr(num+num2+2);
//     var arr=str.split("&");
//     var name,value;
//     for(var i=0;i < arr.length;i++){
//         num=arr[i].indexOf("=");
//         if(num>0){
//             name=arr[i].substring(0,num);
//             value=arr[i].substr(num+1);
//             if(name == 'boxNumber'){
//                 return value;
//             }
//         }
//     }
// }

var buffer;
var timer;
let isToplay = true;
var userId = localStorage.getItem("userId");
var boxNumber = localStorage.getItem("boxNumber");
var userName = '';
var headUrl = '';

//1.获取用户信息
$.ajax({
    url : serverUrl + "/wxbackstage/wechat/member/info/" + userId,
    type : "get",
    dataType:"json",
    data:"",
    async : false,//取消异步
    success : function(data){
        headUrl = data.data.avatarUrl;
        userName = data.data.name;
    }
});

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

//2、获取支付金额
var gameCode = 9;//根据后台游戏码一致
var accountNum = 1;//消费金额默认1分
let isFree = 1;//默认免费0,1收费
$.ajax({
    type:"get",
    contentType: 'application/json; charset=UTF-8',
    url: "https://"+ serverIp_ +"/wxbackstage/payItem/get/",
    dataType: "json",
    data:{
        "boxId": boxNumber,
        "gameCode": gameCode
    },
    async: false,
    success: function(res){
        isFree = res.data[0].isFree;
        accountNum = Number(res.data[0].money);
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

//3、获取用户余额
function toFind(){
    $.ajax({//获取余额
        type:"get",
        contentType: 'application/json; charset=UTF-8',
        url: "https://"+ serverIp_ + "//wxbackstage/memberAccount/info/"+userId,
        data:"",
        dataType: "json",
        sync: false,
        success: function (data) {
            var account = Number(data.data.account)/100;
            $('.yueSpan').text("余额："+account+"元");
        },
        error:function (data) {
            alert("请求余额失败");
        }
    });
}

var thisServerWs;
var obj;
function WebSocketInit() {
    if ("WebSocket" in window) {
        thisServerWs = "wss://"+ serverIp_ +"/newGameServer/websocket?id="+userId+"&screenCode="+boxNumber;
        ws = new WebSocket(thisServerWs);
        ws.onopen = function() {
            //alert("websocket连接成功！11");
        };
        ws.onmessage = function(evt) {
            var data = evt.data;
            protobuf.load("/h5/public/protobuf/common.proto",function(err,root) {
                if (err) throw err;
                var Common = root.lookup("Common");
                var reader = new FileReader();
                reader.readAsArrayBuffer(data);
                reader.onload = function (ev) {
                    var buf = new Uint8Array(reader.result);
                    var message = Common.decode(buf);
                    if(message.msg != ''){
                        message.msg = JSON.parse(message.msg);
                    }
                    obj = message;
                    if (obj.type == 51) {
                        if (obj.msg.role && obj.msg.role == 1) {//法官
                            $(".dd_contanir").hide();
                            $(".fg_contanir_1").show();//法官开始游戏
                            $(".fg_contanir_2").hide();
                            $(".fg_contanir_3").hide();
                            $(".fg_contanir_4").hide();
                        }else if (obj.msg.role && obj.msg.role == 2) {//猎人
                            $(".murderType").attr('src', "/h5/public/image/wolf/murder_57.png");
                            $(".dd_contanir").hide();
                            $(".fg_contanir_3").show();//玩家端开始
                        }  else if (obj.msg.role && obj.msg.role == 3) {//女巫
                            $(".murderType").attr('src', "/h5/public/image/wolf/murder_553.png");
                            $(".dd_contanir").hide();
                            $(".fg_contanir_3").show();//玩家端开始
                        } else if (obj.msg.role && obj.msg.role == 4) {//预言家
                            $(".murderType").attr('src', "/h5/public/image/wolf/murder_56.png");
                            $(".dd_contanir").hide();
                            $(".fg_contanir_3").show();//玩家端开始
                        } else if (obj.msg.role && obj.msg.role == 5) {//狼人
                            $(".murderType").attr('src', "/h5/public/image/wolf/murder_58.png");
                            $(".dd_contanir").hide();
                            $(".fg_contanir_3").show();//玩家端开始
                        } else if (obj.msg.role && obj.msg.role == 6) {//良民
                            $(".murderType").attr('src', "/h5/public/image/wolf/murder_59.png");
                            $(".dd_contanir").hide();
                            $(".fg_contanir_3").show();//玩家端开始
                        } else {
                            $(".dd_contanir").hide();
                            $(".fg_contanir_1").hide();
                            $(".fg_contanir_2").hide();
                            $(".fg_contanir_3").hide();
                            $(".fg_contanir_4").show();//玩家端等待开始
                        }
                    }else if(obj.type == 52){
                        $(".dd_contanir").hide();
                        $("#murderF").attr('src', "/h5/public/image/wolf/bt_xyb.png");//下一步
                        $(".fg_contanir_1").hide();
                        $(".fg_contanir_2").show();//法官开始游戏
                        $(".fg_contanir_3").hide();
                        $(".fg_contanir_4").hide();
                    }else if(obj.type == 53){
                        alert("人数不足!(最少6个人)");
                    }else if(obj.type == 12){
                        ws.close();
                        $("#noGame").show();
                        $("#noGame").append(`<img src="/h5/public/image/wolf/gemeOver.png" style="width: 100%;height: 100%;">`)
                    }else if(obj.type == 1) {//玩家进入游戏
                        // alert("玩家进入游戏")
                    }else if(obj.type == 3){//websocket连接成功
                        // alert("websocket连接成功")
                    }else if(obj.type == 10){
                        toFind();
                        toPlay();
                    }
                }
            })
        };
        ws.onclose = function() {
            // 关闭 websocket
            ws = null;
            againConnect=false;
        };
    }
    else {
        alert("您的浏览器不支持 WebSocket!");
    }
}
toFind();
toPlay();
WebSocketInit();
var next = 1;
var round = 1;
function WebSocketTest(type) {
    if(ws == null && againConnect==true) {
        WebSocketInit();
    };
    var boxNumber = localStorage.getItem("boxNumber");
    if (boxNumber && boxNumber != null) {
        if(type == 'start'){//开始游戏
            let msg = {screenCode: boxNumber};
            msg = JSON.stringify(msg);
            sendData.msg = msg;
            sendData.type = 50;
            enCodeMsg(sendData);
        }else if(type == 'next'){
            next = next+1;
            if(round == 1 && (next == 4 || next == 7)){
                next = next + 1;
            }else if(round == 1 && next == 15){
                next = next + 2;
            }else if(round == 1 && next == 18){
                next = 2;
                round = 2;
            }else if(round == 2 && next == 12){
                next = next + 2;
            }else if(round == 2 && next == 16){
                next = next + 1;
            }
            if(next ==21){
                next = 2;
                round = 2;
            }
            let msg = {step: next};
            msg = JSON.stringify(msg);
            sendData.msg = msg;
            sendData.type = 52;
            enCodeMsg(sendData);
        }else if(type == 'playerDie'){//退出
            ws.close();
            $("#noGame").show();
            $("#noGame").append(`<img src="/h5/public/image/wolf/duankai.png" style="width: 100%;height: 100%;">`)
        }else if(type == 'escGame'){//扫码重新加入
            ws.close();
            $("#noGame").show();
            $("#noGame").append(`<img src="/h5/public/image/wolf/duankai.png" style="width: 100%;height: 100%;">`)
        }else if(type=='rule'){
            /*显示灰色 jQuery 遮罩层 */
            // alert("弹出规则");
            var bh = $("body").height();
            var bw = $("body").width();
            $("#fullbg").css({
                height:bh,
                width:bw,
                display:"block"
            });
            //div标标往上移动
            if($('#tanchu').css('display') == 'none'){
                $("#tanchu").slideDown(100);
            }else{
                $("#fullbg,#tanchu").hide();
            }
        }else if(type == 'wxchongzhi'){
            //进入游戏之后点击的充值，不需要扣费
            isToplay = false;
            //跳转到微信小程序中支付中...
            wx.miniProgram.navigateTo({url:'/pages/wdfx/chongzhi/chongzhi?userId=' + userId});
        }
    } else {
        alert("网络不好，请退出重新扫码！");
    }
}

function getMyDate(strs){
    var oDate = new Date(strs),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth()+1,
        oDay = oDate.getDate(),
        oTime = oYear +"年"+ getzf(oMonth) +"月"+ getzf(oDay) +"日";//最后拼接时间
    return oTime;
};
//补0操作
function getzf(num){
    if(prseInt(num) < 10){
        num = '0'+num;
    }
    return num;
};
function toPlay(){
    if(isFree === 1) {
        $.ajax({//获取余额
            type: "get",
            contentType: 'application/json; charset=UTF-8',
            url: "https://" + serverIp_ + "//wxbackstage/memberAccount/info/" + userId,
            data: "",
            dataType: "json",
            success: function (data) {
                if (data.code == 0) {
                    var account = Number(data.data.account);//单位分
                    if (account >= accountNum) {//查询余额
                        if (isToplay == true) {
                            $.ajax({//消费余额
                                type: "post",
                                contentType: 'application/json; charset=UTF-8',
                                url: "https://" + serverIp_ + "//wxbackstage/memberAccount/spend",
                                data: JSON.stringify({
                                    account: accountNum,
                                    memberId: userId
                                }),
                                dataType: "json",
                                success: function (data) {
                                    $("#noGame").hide();
                                    toFind();
                                    isToplay = false;
                                    let msg = {
                                        userId: userId,
                                        userName: userName,
                                        headUrl: headUrl
                                    };
                                    msg = JSON.stringify(msg);
                                    sendData.msg = msg;
                                    sendData.type = 1;
                                    enCodeMsg(sendData);
                                },
                                error: function (data) {
                                    alert("消费失败");
                                }
                            });
                        }
                    } else {
                        // alert("余额不足，请充值，充值完成重新提交即可");
                        //跳转到微信小程序中支付中...
                        wx.miniProgram.navigateTo({url: '/pages/wdfx/chongzhi/chongzhi?userId=' + userId});
                    }
                }
                ;
                if (data.code == -1) {
                    // alert("余额不足，请充值，充值完成重新提交即可");
                    //跳转到微信小程序中支付中...
                    wx.miniProgram.navigateTo({url: '/pages/wdfx/chongzhi/chongzhi?userId=' + userId});
                }
                ;
            },
            error: function (data) {
                alert("请求余额失败");
            }
        });
    }else{
        $("#noGame").hide();
        isToplay = false;
        let msg = {
            userId: userId,
            userName: userName,
            headUrl: headUrl
        };
        msg = JSON.stringify(msg);
        sendData.msg = msg;
        sendData.type = 1;
        enCodeMsg(sendData);
    }
}