wordId=0;//每条词条的ID标记
var globalWords;//词条数组
var randomWord=new Object();//随机词条
var initialValue=300;//退出游戏总时长
var thumbsUp=300;//点赞倒计时总时长
randomWord.title="";
randomWord.gameRule="";
let isConnect=true;
let serverIp_ = "game.hdiandian.com";//h5正式，game测试

//对话框提示
$("body").append(`<div id="dailog" style="width: 100%;height: 100%;background: rgba(0,0,0,.5);position: absolute;top: 0;display: none;">
    <p class="dailogInfo" style="width: 300px;height: 200px;background: white;position: absolute;top:50%;left:50%;transform: translate(-50%,-50%);text-align: center;line-height: 200px"></p>
</div>`);

/*点击--操作规则----触发的事件*/
$(".caozuoshuoming").click(function () {
    $("#container_lp").hide();
    /*轮盘首页界面*/
    $("#container_yxgz").hide();
    /*游戏规则界面*/
    $("#container_czsm").show();
    /*操作说明界面*/
});
/*点击--游戏规则----触发的事件*/
$(".youxiguize").click(function () {
    $("#container_lp").hide();
    /*轮盘首页界面*/
    $("#container_czsm").hide();
    /*操作说明界面*/
    $("#container_yxgz").show();
    /*游戏规则界面*/
});
/*点击---操作规则返回-----触发的事件*/
$(".container_czsm_fanhui").click(function () {
    $("#container_lp").show();
    /*轮盘首页界面*/
    $("#container_czsm").hide();
    /*操作说明界面*/
    $("#container_yxgz").hide();
    /*游戏规则界面*/
});
/*点击----游戏规则返回------的事件*/
$("#container_yxgz_fanhui").click(function () {
    $("#container_lp").show();
    /*轮盘首页界面*/
    $("#container_yxgz").hide();
    /*游戏规则界面*/
    $("#container_czsm").hide();
    /*操作说明界面*/
});

/*轮盘首页界面样式---------------------------------------------------------*/
$("div .caozuoshuoming").addClass('bg1'); // 初始化时给操作说明添加背景1
$("div .caozuoshuoming").click(function () {
    $(this).removeClass('bg1').addClass('bg2');
});

$("div .youxiguize").addClass('bgg1'); // 初始化时给游戏规则添加背景1
$("div .youxiguize").click(function () {
    $(this).removeClass('bgg1').addClass('bgg2');
});

/*点击点赞之后，点赞按钮会变暗 , 此处可发送消息到服务器*/
$("#button_dz").addClass("button_dz_bg1"); // 初始化时添加背景1
$("#button_dz").click(function () {
    WebSocketTest('pass');
    $("#button_dz").removeClass("button_dz_bg1").addClass("button_dz_bg2");
    $("#button_dz").unbind('click');
    /*取消点击事件*/
    clearInterval(time);//停止退出计时
});
//继续游戏
var back = document.getElementById("back");
back.addEventListener('touchstart', function () {
    back.src = "/h5/public/image/roulette/onGame1.png";
}, false);
back.addEventListener('touchend', function () {
    back.src = "/h5/public/image/roulette/onGame0.png";
}, false);
//刷新词条
var refresh = document.getElementById("refresh");
refresh.addEventListener('touchstart', function () {
    refresh.src = "/h5/public/image/roulette/refreshPress.png";
}, false);
refresh.addEventListener('touchend', function () {
    refresh.src = "/h5/public/image/roulette/refresh.png";
}, false);
//退出游戏
var escGameBtn = document.getElementById("escGameBtn");
escGameBtn.addEventListener('touchstart', function () {
    escGameBtn.src = "/h5/public/image/roulette/escGame.png";
}, false);
escGameBtn.addEventListener('touchend', function () {
    escGameBtn.src = "/h5/public/image/roulette/escGamePress.png";
}, false);

function RandomNumBoth(Min,Max){ //随机函数
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
};

//退出游戏倒计时
function jump(){
    if(initialValue>=0){
        $(".countDown").text(initialValue--);
    }else {
        clearInterval(time);
        console.log("取消定时器");
        isConnect=false;
        // WebSocketTest('escGame');//发送退出游戏消息给服务器
        ws.close();
    };
};
time = setInterval(jump,1000);

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
    clearInterval(time);
    console.log("取消定时器");
    isConnect=false;
    // WebSocketTest('escGame');//发送退出游戏消息给服务器
    ws.close();
    $(".escGame").hide();
});

/*轮盘首页界面样式------------------------结束---------------------------------*/




/*游戏规则界面里面所用到的js----------------------------------------------------*/
var userId = localStorage.getItem("userId");
var boxNumber = localStorage.getItem("boxNumber");
var boxId_ = boxNumber;
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

var i = 0;
var enablePlay = true;

//2、词库展示
$.ajax({
    type: "GET",
    // url: "https://game.hdiandian.com/wxbackstage/game/get/allWheelDiscRules/123",
    url: "https://"+serverIp_+"/wxbackstage/game/get/allWheelDiscRules/" + boxId_,
    data: {boxId: boxId_},
    dataType: "json",
    async: false,
    success: function (data) {
        console.log("接收的词条：");
        console.log(data.data);
        globalWords = data.data;
        var words = data.data;
        $("#word_box").html("");
        for (var i = 0; i < words.length; i++) {
            $("#word_box").append(`<div class="word">
                        <span class="word_num">${words[i].id}</span>
                        <div class="word_main">
                            <span class="keywords">${words[i].title}</span>
                            <br>
                            <span class="state">${words[i].gameRule}</span>
                        </div>
                        <div class="modify_box">
                            <div class="modify" onclick="ysgz_showBg(${words[i].id});"></div>
                        </div>

                    </div>`)
        }

    },
    error: function (data) {
        console.log("请求失败");
    }
});

//3、获取支付项
var gameCode = 8;//根据后台游戏码一致（注：区分测试和正式）现在测试和正式的gameCode都是10
let accountNum = 1;//消费金额默认1分
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

// 显示灰色游戏规则界面的 jQuery 遮罩层
function ysgz_showBg(tempNum) {
    //点击“修改”按钮按钮背景变换
    var modify=document.querySelectorAll(".modify");
    for(let i=0;i<modify.length;i++){
        modify[i].addEventListener('touchstart',function(e) {
            console.log("touchstart");
            modify[i].classList.add("modifydown");
        },false);
        modify[i].addEventListener('touchend',function(e) {
            console.log("touchend");
            modify[i].classList.remove("modifydown");
        },false);
    }
//遮罩
    var bh = $("body").height();
    var bw = $("body").width();
    $("#ysgz_fullbg").css({
        height: bh,
        width: bw,
        display: "block"
    });
    $("#ysgz_dialog").show();
    $("#name").val("");
    $("#neirong").val("");

    //弹出对应的框
    wordId=tempNum;
    var title=$(".keywords").eq(wordId-1).text();
    var gameRule=$(".state").eq(wordId-1).text();
    $("#name").val(title);
    $("#neirong").val(gameRule);

}

//修改数据
function modifyBtn() {
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
                    // alert(data.data.account);
                    if (account >= accountNum) {//查询余额
                        // alert("account>=accountNum");
                        $.ajax({//消费余额
                            type: "post",
                            contentType: 'application/json; charset=UTF-8',
                            async: true,
                            url: "https://" + serverIp_ + "//wxbackstage/memberAccount/spend",
                            data: JSON.stringify({
                                account: accountNum,
                                memberId: userId
                            }),
                            dataType: "json",
                            success: function (data) {
                                updataCitiao();
                                ysgz_closeBg();//关闭弹窗
                            },
                            error: function (data) {
                                alert("消费失败");
                            }
                        });

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
        updataCitiao();
        ysgz_closeBg();//关闭弹窗
    }
}

//关闭灰色 jQuery 遮罩
function ysgz_closeBg() {
    //更新数据
    $("#word_box").empty();
    $.ajax({
        type: "GET",
        // url: "https://game.hdiandian.com/wxbackstage/game/get/allWheelDiscRules/123",
        url: "https://"+serverIp_+"/wxbackstage/game/get/allWheelDiscRules/"+boxId_,
        data: {boxId:boxId_},
        dataType: "json",
        success: function(data){
            console.log("接收的词条：");
            console.log(data.data);
            globalWords = data.data
            var words=data.data;
            for(var i=0;i<words.length;i++){
                $("#word_box").append(`<div class="word">
                        <span class="word_num">${words[i].id}</span>
                        <div class="word_main">
                            <span class="keywords">${words[i].title}</span>
                            <br>
                            <span class="state">${words[i].gameRule}</span>
                        </div>
                        <div class="modify_box">
                            <div class="modify" onclick="ysgz_showBg(${words[i].id});"></div>
                        </div>

                    </div>`)
            }
        },

        error:function (data) {
            console.log("请求失败");
        }
    });

    $("#ysgz_fullbg,#ysgz_dialog").hide();
}

/*游戏规则界面里面所用到的js--------------------------结束--------------------------*/


/*判断屏幕的横屏，还是竖屏*/
(function rotate() {
    var orientation = window.orientation;
    if (orientation == 90 || orientation == -90) {

        document.body.style.display = 'none';
        alert("为方便使用，请使用竖屏访问！，请把选择页面选择锁定竖屏");
    }
    window.onorientationchange = function () {
        document.body.style.display = "block";
        rotate();
    };
})()

//显示灰色 jQuery 遮罩层
function showBg() {
    var randomNum=RandomNumBoth(1,12);
    if(randomNum){
        randomWord.title=globalWords[randomNum].title;
        randomWord.gameRule=globalWords[randomNum].gameRule;
    }
    // if (enablePlay){
    WebSocketTest('actionsReq', randomWord.title, randomWord.gameRule);
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
    protobuf.load("/h5/public/protobuf/common.proto", function (err, root){
        if (err) throw err;
        var Common = root.lookup("Common");
        var message = Common.create(data);
        buffer = Common.encode(message).finish();
        ws.send(buffer);
    });
}

WebSocketInit();
function WebSocketInit() {
    // let serverIp = "game.hdiandian.com";
    if ("WebSocket" in window){
        //thisServerWs = "wss://" + serverIp + "/websocket.do?token="+
        thisServerWs = "wss://"+ serverIp_ +"/newGameServer/websocket?id="+userId+"&screenCode="+boxNumber;
        ws = new WebSocket(thisServerWs);
        ws.onopen = function () {
            heartCheck.start();//心跳发送
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
                    if (obj.type == 42 && obj.msg) {//游戏通知玩家转盘正在转动
                        if(obj.msg.userName == userName){//点转的玩家和没点转的玩家
                            //隐藏取消游戏倒计时按钮
                            clearInterval(time);
                            $(".escGame").hide();
                            $("#button_dd").show();
                            /*当提示看大屏幕的字体消失后，“等待其他玩家显示”*/
                            $(".anniu").hide();
                            /*玩家按钮显示后，中间按钮图片隐藏*/
                        }else{
                            $("#yonghuming").html(obj.msg.userName);
                            // 取消计时退出游戏按钮消失
                            clearInterval(time);
                            $(".escGame").hide();
                            $("#button_dz").show();
                            /*当提示看大屏幕的字体消失后，“点赞按钮显示”*/
                            //重置退出游戏倒计时
                            reCountDown();
                            $(".anniu").hide();
                            /*玩家按钮显示后，中间按钮图片隐藏*/
                            $("#button_dz").removeClass("button_dz_bg1").addClass("button_dz_bg2");
                            $("#button_dz").unbind('click');
                        }
                    } else if (obj.type == 45) {//通知玩家可以点赞
                        // 隐藏取消退出游戏倒计时按钮
                        clearInterval(time);
                        $(".escGame").hide();

                        $("#button_dz").show();
                        /*当提示看大屏幕的字体消失后，“点赞按钮显示”*/
                        $(".anniu").hide();
                        /*玩家按钮显示后，中间按钮图片隐藏*/
                        //点赞按钮处倒计时
                        reCountDown();
                        $("#button_dz").removeClass("button_dz_bg2").addClass("button_dz_bg1");
                        $("#button_dz").click(function () {
                            WebSocketTest('pass');
                            $("#button_dz").removeClass("button_dz_bg1").addClass("button_dz_bg2");
                            $("#button_dz").unbind('click');
                            clearInterval(time);//停止退出计时
                            /*取消点击事件*/
                        });
                    } else if (obj.type == 43) {//重新开始下一局
                        $(".anniu").show();
                        /*重新开一局的时候，中间的按钮图片显示*/
                        $("#button_dd").hide();
                        /*重新开一局的时候，“等待其他玩家显示” 隐藏*/
                        $("#button_dz").hide();
                        /*重新开一局的时候，“点赞按钮” 隐藏*/
                        //重置退出游戏倒计时
                        $(".escGame").show();
                        reCountDown();
                        $("#button_dz").removeClass("button_dz_bg2").addClass("button_dz_bg1");

                        $("#button_dz").click(function () {
                            WebSocketTest('pass');
                            $("#button_dz").removeClass("button_dz_bg1").addClass("button_dz_bg2");
                            $("#button_dz").unbind('click');
                            /*取消点击事件*/
                        });
                    } else if (obj.type == 2) {
                        // alert("人数已满，请稍后连接");
                        ws.close();
                        $("#dailog").show();
                        $(".dailogInfo").text("人数已满，请稍后连接");//提示对话框测试
                    } else if (obj.type == 12) {
                        //alert("您已退出游戏，请重新扫码");
                        ws.close();
                        $("#dailog").show();
                        $(".dailogInfo").text("您已退出游戏，请重新扫码");//提示对话框测试

                    }
                }
            });
        };

        ws.onclose = function () {
            // alert("您已断开连接,请重新扫码");
            if(isConnect==true){
                ws = null;
                $("#dailog").show();
                $(".dailogInfo").text("您已断开连接,请重新扫码");//提示对话框测试
                //getInitData();
                //initUserInfo();
                //WebSocketInit();//3
            }else {
                $("#dailog").show();
                $(".dailogInfo").text("您已断开连接,请重新扫码");//提示对话框测试
            }

        };
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
        if (type == 'power') {
            // if (enablePlay){
            //     alert("enablePlay")
            //     ws.send(boxNumber + ",888," + boxNumber + ',{"_msg_name":"TruthAdventure_Control_power"}');
            //     enablePlay = false;
            // }
        } else if (type == 'pass') {
            sendData.msg = "";
            sendData.type = 41;
            enCodeMsg(sendData);
        } else if (type == 'actionsReq') {
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

function checkHashIndex(indexs,index){
    var tempFlag = false;
    for(var tempIndex=0;tempIndex<indexs.length;tempIndex++){
        if(indexs[tempIndex]==index){
            tempFlag = true;
        }
    }
    return tempFlag;
}

$("#name").focus(function(){
    $("#name").val("");
});
$("#neirong").focus(function(){
    $("#neirong").val("");
});

//刷新
$("#fresh").click(function () {
    $.ajax({
        type: "GET",
        // url: "https://game.hdiandian.com/wxbackstage/game/get/allWheelDiscRules/123",
        url: "https://"+serverIp_+"/wxbackstage/game/get/allWheelDiscRules/"+boxId_,
        data: {boxId:boxId_},
        dataType: "json",
        success: function(data){
            // alert("接收的词条：");
            console.log(data.data);
            globalWords = data.data;
            var words=data.data;
            $("#word_box").html("");
            for(var i=0;i<words.length;i++){
                $("#word_box").append(`<div class="word">
                        <span class="word_num">${words[i].id}</span>
                        <div class="word_main">
                            <span class="keywords">${words[i].title}</span>
                            <br>
                            <span class="state">${words[i].gameRule}</span>
                        </div>
                        <div class="modify_box">
                            <div class="modify" onclick="ysgz_showBg(${words[i].id});"></div>
                        </div>

                    </div>`)
            }
        },
        error:function (data) {
            console.log("请求失败");
        }
    });
});

//更新词条
function updataCitiao() {
    var title=$("#name").val();
    var gameRule=$("#neirong").val();
    $.ajax({//更新词条
        type: "post",
        contentType: 'application/json; charset=UTF-8',
        async: false,
        url: "https://" + serverIp_ + "/wxbackstage/game/update/wheelDiscRules",
        data: JSON.stringify({
            replaceId: wordId,
            boxId: boxId_,
            title: title,
            gameRule: gameRule,
            memberId: userId
        }),
        dataType: "json",
        success: function (data) {
            console.log("更新的词条：");
            $.ajax({
                type: "GET",
                url: "https://" + serverIp_ + "/wxbackstage/game/get/allWheelDiscRules/" + boxId_,
                data: {boxId: boxId_},
                dataType: "json",
                async: false,
                success: function (data) {
                    console.log("接收的词条：");
                    console.log(data.data);
                    globalWords = data.data;
                },
                error: function (data) {
                    console.log("请求失败");
                }
            });

        },
        error: function (data) {
            console.log("请求失败");
        }
    });
}