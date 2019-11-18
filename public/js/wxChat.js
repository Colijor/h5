
var serverIp_ = "game.hdiandian.com";//h5正式，game测试

//对话框提示
$("body").append(`<div id="dailog" style="width: 100%;height: 100%;background: rgba(0,0,0,.5);position: absolute;top: 0;display: none;z-index: 100;">
    <p class="dailogInfo" style="width: 300px;height: 200px;background: white;position: absolute;top:50%;left:50%;transform: translate(-50%,-50%);text-align: center;line-height: 200px"></p>
</div>`);

function autoWidth(){
    $('.question_text').css('max-width',$('.question').width()-50);
    $('.answer_text').css('max-width',$('.answer').width()-50);
}
autoWidth();

var userId = localStorage.getItem("userId");
var buffer;
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
        //alert("1获取用户信息成功");
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

var ws = null;
var thisServerWs ;
var heartCheck = {
    timeout: 60000,//60ms
    timeoutObj: null,
    serverTimeoutObj: null,
    reset: function(){
        setInterval(this.timeoutObj);
        this.start();
    },
    start: function(){
        this.timeoutObj = setInterval(function(){
            ws.send("HeartBeat");
        }, this.timeout)
    },
};

WebSocketInit();
function WebSocketInit() {
    if ("WebSocket" in window){
        thisServerWs = "wss://"+ serverIp_ +"/newGameServer/websocket?id="+userId+"&screenCode="+boxNumber;
        ws = new WebSocket(thisServerWs);
        ws.onopen = function () {
            heartCheck.start();//心跳发送
            //alert("连接成功");
            let msg = {
                userName: userName,
            };
            msg = JSON.stringify(msg);
            sendData.msg = msg;
            sendData.type = 131;
            enCodeMsg(sendData);
        };
        ws.onmessage = function (evt) {
            heartCheck.reset();//重置心跳
            var data = evt.data;
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
                    //alert(obj.type);
                    // if (obj.type == 3){//连接webSocket成功
                    //     var notice = '<div class="chat-notice">欢迎'+userName+'加入聊天吧</div>';
                    //     $('.speak_box').append(notice);
                    // }else
                    if (obj.type == 131 && obj.msg) {//接收其他人的消息
                        var notice = '<div class="chat-notice">欢迎'+obj.msg.userName+'加入聊天吧</div>';
                        $('.speak_box').append(notice);
                    } else if (obj.type == 133 && obj.msg) {//接收其他人的消息
                        //alert(JSON.stringify(obj.msg));
                        var ans = '<div class="answer"><div class="heard_img left"><img src=' + obj.msg.headUrl + '></div>';
                        ans += '<div class="answer_name_you">' + obj.msg.userName + '</div>';
                        ans += '<div class="answer_text"><p>' + obj.msg.message + '</p><i></i>';
                        ans += '</div></div>';
                        $('.speak_box').append(ans);
                        autoWidth();
                        for_bottom();
                    } else if (obj.type == 12) {
                        ws.close();
                        $("#dailog").show();
                        $(".dailogInfo").text("您已退出群聊，请重新扫码");//提示对话框测试
                    }
                }
            })
        };

        ws.onclose = function () {
            ws = null;
            $("#dailog").show();
            $(".dailogInfo").text("您已退出群聊，请重新扫码");//提示对话框测试
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

function to_write(){
    $('.write_box').show();
    $('.write_box input').focus();
    for_bottom();
}

function up_send(){
    // headUrl = "/h5/public/image/wxChat/dglvyou.jpg";
    // userName = "蓝精灵";
    var text = $('.write_box input').val(),
        str  = '<div class="question">';
        str += '<div class="heard_img right"><img src='+headUrl+'></div>';
        str += '<div class="question_text clear"><div class="answer_name_my">'+userName+'</div><p>'+text+'</p><i></i>';
        str += '</div></div>';

    if(text == ''){
        $('.write_box input').focus();
    }else{
        $('.speak_box').append(str);
        let msg = {
            userName: userName,
            headUrl: headUrl,
            message: text
        };
        msg = JSON.stringify(msg);
        sendData.msg = msg;
        sendData.type = 132;
        enCodeMsg(sendData);

        $('.write_box input').val('');
        $('.write_box input').focus();
        autoWidth();
        for_bottom();
    }
}

function keyup(){
    var footer_height = $('.wenwen-footer').outerHeight(),
        text = $('.write_box input').val();
}

function for_bottom(){
    var speak_height = $('.speak_box').height();
    $('.speak_box,.speak_window').animate({scrollTop:speak_height},500);
}