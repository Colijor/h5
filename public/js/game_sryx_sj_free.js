$(document).ready(function(e) {
    //向下滑动
    $("#chachatupian").click(function() {
        //div标标往下移动
        $("#fullbg,#tanchu").hide();
    });
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

function UrlSearch()
{
    var str=window.location.href;
    str = decodeURIComponent(str);
    var num = str.indexOf("?");
    var num2 = str.substr(num+1).indexOf("?");
    str = str.substr(num+num2+2);
    var arr=str.split("&");
    var name,value;
    for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            if(name == 'boxNumber'){
                return value;
            }
        }
    }
}

var buffer;
var timer;
var boxNumber = UrlSearch();
localStorage.setItem("boxNumber",boxNumber);
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
                        $("#noGame").hide();
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
}