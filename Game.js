//load canvas//load images 
let canvas=document.getElementById("myCanvas");
let ctx=canvas.getContext("2d");
canvas.width=smartScale().gameW;
canvas.height=smartScale().gameH;
let gameW=canvas.width;
let gameH=canvas.height;

let imgBg=new Image();
let imgBird=[];
let imgCloud=new Image();
let imgGround=new Image();
let imgPipedown=new Image();
let imgPipeup=new Image();
let imgWelcome=new Image();
let mediaSwing=new Audio();
let mediaScore=new Audio();
//variables
let fno=0;
let score=0;
let t=0;
let alertFlag=0;
//1.bird;
let birdX=gameW*0.25;
let birdY=gameH*0.4;
let birdH=gameH*0.04;
let birdW=birdH*1.4;
// let birdSpeedDown=gameH*0.003;//vY
let birdSpeedDown=0;//vY
let birdSpeedUp=gameH*0.06;
let rdmNumB=Math.floor(Math.random()*3);
//2.bg
let bgX=0;
let bgY=0;
let bgW=gameW;
let bgH=gameH;
//3.cloud
let cloudX=0;
let cloudY=0;
let cloudW=gameW;
let cloudH=gameH*0.56;
//4.ground
let groundX=0;
let groundY=gameH*0.8;
let groundW=gameW;
let groundH=gameH*0.2;
//5.pipes
let pipeSpeed=1;
let creatNewAtX=gameW*0.3;
let pipeLen=gameH;
let pipeW=gameW*0.1;
let gap=birdH*5;
//first pipe
let pipeArr=[];
// 向第一根管道push左上角坐标
pipeArr[0]={
    pX0:gameW,
    pY0:-gameH*0.7
};
/*pY1:pipeArr[0].pY0+pipeLen+birdH*3*/
// 加载图片资源、产生随机颜色鸟、显示欢迎界面
function loadData() {
    mediaScore.src="media/score.mp3";
    mediaSwing.src="media/swing.mp3";
    imgBg.src="img/bg.png";
    imgBird.src="img/bird0_0.png";
    imgCloud.src="img/cloud.png";
    imgGround.src="img/ground.png";
    imgPipedown.src="img/pipedown.png";
    imgPipeup.src="img/pipeup.png";
    imgWelcome.src="img/welcome.png";
    randomBirdColor();
    //start game
    imgBird[0].onload=function () {
        welcome();
    }
}
function welcome() {
    ctx.drawImage(imgBg,bgX,bgY,bgW,bgH);
    ctx.drawImage(imgCloud,cloudX,cloudY,cloudW,cloudH);
    ctx.drawImage(imgGround,groundX,groundY,groundW,groundH);
    ctx.drawImage(imgWelcome,0,0,gameW,gameH);
    ctx.fillText("Highest Score:"+score,10,30);
    // 20毫秒更换一张图片setInterval方法
    let timer=setInterval(function () {
        ctx.drawImage(imgBird[fno%100%3],birdX,birdY,birdW,birdH);
        fno++;
        if (fno===1000) {
            fno=0;
        }
    },20);
    // onclick事件触发游戏开发
    document.onclick=function () {
        mediaSwing.play();
        mediaScore.play();
        document.onclick=null;//清除onclick事件
        clearInterval(timer);//清除计数器
        ctx.clearRect(0,0,gameW,gameH);
        /**
         * 开始游戏并添加事件,按下键盘+点击鼠标+触摸屏幕
         */
        start();
        document.addEventListener("click",birdUp);
        document.addEventListener("keydown",birdUp);
    }
}
function start() {
    //bg+cloud   +pipe+bird

    drawBg();
    drawBird();
    drawPipe();
    drawGround();
    // windows.requestAnimationFrame重绘画布更新动画
    requestAnimationFrame(start);
}
function smartScale() {
    //ip4:[320*480],Nexus 7[600*960]
    //cW[320-600],cH[480-960]
    let cW=document.documentElement.clientWidth;
    let cH=document.documentElement.clientHeight;
    if (cW<320) {
        cW=320;
    }else if(cW>600){
        cW=600;
    }
    if (cH<480) {
        cH=480;
    }else if(cH>960){
        cH=960
    }
    return {
        gameW:cW,
        gameH:cH
    }
}
// 随机颜色的鸟，三个动作图片
function randomBirdColor() {
    for (let i = 0; i < 3; i++) {
        // 令imgBird[i]数据类型为三个Image型
        imgBird[i]=new Image();
    }
    // 随机黄蓝红三种颜色
    switch (rdmNumB) {
        case 0:
            imgBird[0].src="img/bird0_0.png";
            imgBird[1].src="img/bird0_1.png";
            imgBird[2].src="img/bird0_2.png";
            break;
        case 1:
            imgBird[0].src="img/bird1_0.png";
            imgBird[1].src="img/bird1_1.png";
            imgBird[2].src="img/bird1_2.png";
            break;
        case 2:
            imgBird[0].src="img/bird2_0.png";
            imgBird[1].src="img/bird2_1.png";
            imgBird[2].src="img/bird2_2.png";
            break;
        default:
            break;
    }
}
function drawBg() {
    //向左运动x坐标减少
    bgX-=pipeSpeed;
    if (bgX==-gameW) {
        bgX=0;
    }
    ctx.drawImage(imgBg,bgX,bgY,bgW,bgH);
    ctx.drawImage(imgBg,bgX+gameW,bgY,bgW,bgH);
    cloudX-=pipeSpeed*2;
    if (cloudX==-gameW) {
        cloudX=0;
    }
    ctx.drawImage(imgCloud,cloudX,cloudY,cloudW,cloudH);
    ctx.drawImage(imgCloud,cloudX+gameW,cloudY,cloudW,cloudH);
}
function drawPipe() {
    for (let i = 0; i < pipeArr.length; i++) {
        //画出上下管道
        ctx.drawImage(imgPipeup,pipeArr[i].pX0,pipeArr[i].pY0,pipeW,pipeLen);
        ctx.drawImage(imgPipedown,pipeArr[i].pX0,pipeArr[i].pY0+pipeLen+gap,pipeW,pipeLen);
        console.log(pipeArr.length);
        gameOverJudge(pipeArr[i]);

        //如果最后一根管道x值为200px，push新管道
        if (pipeArr[i].pX0===200) {

            pipeArr.push({
                pX0:gameW,
                //gap=0.2h, 高度为随机值[-0.8h,-0.4h],ground0.2h
                pY0:gameH*(-Math.random()*0.4-0.4)
            });

        }
        pipeArr[i].pX0-=pipeSpeed;
    }
    // 显示分数
    ctx.fillText("Highest Score:"+score,10,30);
}
function drawGround() {
    groundX-=pipeSpeed;
    if (groundX===-gameW) {
        groundX=0;
    }
    ctx.drawImage(imgGround,groundX,groundY,groundW,groundH);
    ctx.drawImage(imgGround,groundX+gameW,groundY,groundW,groundH);
}
function drawBird() {
    // 每一毫秒fno加一
    (++fno)===1000?fno:0;
    //imgBird[fno%300%3]取值区间[0-299%3][0,1,2],减慢图片更换的速度的一种方法
    ctx.drawImage(imgBird[fno%300%3],birdX,birdY,birdW,birdH);
    birdY+=birdSpeedDown;
    t++;
    // 为了增加游戏体验，更改重力值
    birdSpeedDown=(2*t+1)*0.1;
}
function birdUp() {
    t=0;
    mediaSwing.play();//播放翅膀扇动声音
    birdY-=birdSpeedUp;
}
function gameOverJudge(nowPipe) {
    let birdLeft=birdX;
    let birdRight=birdX+birdW;
    //修正值
    let birdHead=birdY+5;
    let birdFoot=birdY+birdH-5;

    let pipeUpLeft=nowPipe.pX0;
    let pipeUpRight=nowPipe.pX0+pipeW;
    let pipeUpFoot=nowPipe.pY0+pipeLen;
    let pipeDownLeft=pipeUpLeft;
    let pipeDownRight=pipeUpRight;
    let pipeDownHead=pipeUpFoot+gap;

    let groundHead=groundY;
    if (Math.floor(pipeUpRight)==Math.floor(birdRight)) {
        mediaScore.play();
        score+=10;
    }

//碰撞检测
    if((birdFoot>groundHead)
        ||(birdRight>pipeUpLeft&&birdHead<pipeUpFoot&&birdLeft<pipeUpRight)
        ||(birdFoot>pipeDownHead&&birdRight>pipeDownLeft&&birdLeft<pipeDownRight)
    ){
        alertFlag++;
        if (alertFlag===1) {
            alert("Game Over\nYour score is :"+score);
            location.reload();
        }
        return true;
    }else {
        return false;
    }

}

