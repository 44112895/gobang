/*
    注：
        只完成了双人对战，人机对战可插入并修改82~90行
        横竖坐标颠倒了，相当于数组的行和列互换了，可以修改，但是比较麻烦，问题出在76~79行
*/

/*画棋盘*/
let canvas = $('#myCanvas');
let context = canvas[0].getContext('2d');

function drawingBoard() {
    for (let i = 0; i < 15; i++) {
        /*画行*/
        context.moveTo(20, i * 50 + 20);
        context.lineTo(canvas.innerWidth() - 20, i * 50 + 20);

        /*画列*/
        context.moveTo(i * 50 + 20, 20);
        context.lineTo(i * 50 + 20, canvas.innerHeight() - 20);
    }

    /*描线*/
    context.stroke();

    /*设置圆的颜色*/
    context.fillStyle = '#5f5f5f';

    /*中心圆*/
    context.beginPath();
    context.arc(canvas.width() / 2, canvas.height() / 2, 10, 0, Math.PI * 2);
    context.fill();

    /*左上圆*/
    context.beginPath();
    context.arc(canvas.width() / 2 - 50 * 4, canvas.height() / 2 - 50 * 4, 10, 0, Math.PI * 2);
    context.fill();

    /*右上圆*/
    context.beginPath();
    context.arc(canvas.width() / 2 + 50 * 4, canvas.height() / 2 - 50 * 4, 10, 0, Math.PI * 2);
    context.fill();

    /*右下圆*/
    context.beginPath();
    context.arc(canvas.width() / 2 + 50 * 4, canvas.height() / 2 + 50 * 4, 10, 0, Math.PI * 2);
    context.fill();

    /*左下圆*/
    context.beginPath();
    context.arc(canvas.width() / 2 - 50 * 4, canvas.height() / 2 + 50 * 4, 10, 0, Math.PI * 2);
    context.fill();

    context.beginPath();//清除最后一个圆的边框
}
drawingBoard();

/*初始化数组*/
let pointsArray = [];

function init() {
    for (let i = 0; i < 15; i++) {
        pointsArray[i] = [];
        for (let j = 0; j < 15; j++) {
            pointsArray[i][j] = 0;
        }
    }
}
init();

/*落子*/
let flag = true;
let message = document.querySelector('.message');
let count = 1;//用于记录步数

canvas.on('click', setArr);

function setArr(ev) {
    /*(ev.offset - 20) / 50获取对应的下标，Math.round()获取第几行第几列，找到那个点*/
    let ix = Math.round((ev.offsetX - 20) / 50);
    let iy = Math.round((ev.offsetY - 20) / 50);
    let x = ix * 50 + 20;
    let y = iy * 50 + 20;

    if (pointsArray[iy][ix] !== 0) {
        return;
    } else if (flag) {
        pointsArray[iy][ix] = 1;
        context.fillStyle = '#ffffff';
        message.innerHTML += '<div>第' + count + '步：<span>白子&nbsp;---&nbsp;</span>(' + (iy + 1) + ', ' + (ix + 1) + ')</div>';
    } else {
        pointsArray[iy][ix] = 2;
        context.fillStyle = '#000000';
        message.innerHTML += '<div>第' + count + '步：<span>黑子&nbsp;---&nbsp;</span>(' + (iy + 1) + ', ' + (ix + 1) + ')</div>';
    }

    count++;

    /*滚动条始终设置在底部*/
    message.scrollTop = count * 50;

    context.beginPath();
    context.arc(x, y, 20, 0, Math.PI * 2);
    context.fill();
    flag = !flag;
    context.beginPath();

    /*judge();*/
    canvas.delay(100).queue(function (next) {//延时一秒再进行判断，如果直接判断，那么能连在一起的第五颗棋子不会进行绘制，直接往下执行
        judge();
        next();
    });
}

/*判断输赢*/
function judge() {
    for (let j = 0; j < 11; j++) {//横向判断
        for (let i = 0; i < 15; i++) {
            if (pointsArray[i][j] !== 0 && pointsArray[i][j] === pointsArray[i][j + 1] && pointsArray[i][j] === pointsArray[i][j + 2] && pointsArray[i][j] === pointsArray[i][j + 3] && pointsArray[i][j] === pointsArray[i][j + 4]) {
                reset(i, j);
            }
        }
    }
    for (let j = 0; j < 15; j++) {//竖向判断
        for (let i = 0; i < 11; i++) {
            if (pointsArray[i][j] !== 0 && pointsArray[i][j] === pointsArray[i + 1][j] && pointsArray[i][j] === pointsArray[i + 2][j] && pointsArray[i][j] === pointsArray[i + 3][j] && pointsArray[i][j] === pointsArray[i + 4][j]) {
                reset(i, j);
            }
        }
    }
    for (let j = 0; j < 11; j++) {//右斜方向判断
        for (let i = 0; i < 11; i++) {
            if (pointsArray[i][j] !== 0 && pointsArray[i][j] === pointsArray[i + 1][j + 1] && pointsArray[i][j] === pointsArray[i + 2][j + 2] && pointsArray[i][j] === pointsArray[i + 3][j + 3] && pointsArray[i][j] === pointsArray[i + 4][j + 4]) {
                reset(i, j);
            }
        }
    }
    for (let j = 4; j < 15; j++) {//左斜方向判断
        for (let i = 0; i < 11; i++) {
            if (pointsArray[i][j] !== 0 && pointsArray[i][j] === pointsArray[i + 1][j - 1] && pointsArray[i][j] === pointsArray[i + 2][j - 2] && pointsArray[i][j] === pointsArray[i + 3][j - 3] && pointsArray[i][j] === pointsArray[i + 4][j - 4]) {
                reset(i, j);
            }
        }
    }
}

/*重新设置参数*/
function reset(row, col) {
    canvas.off('click');
    pointsArray[row][col] === 1 ? alert('白子获胜') : alert('黑子获胜');//弹出获胜信息
    init();//重新初始化数组
    context.clearRect(0, 0, canvas.width(), canvas.height());//清空画布
    drawingBoard();//重新绘制画布
    message.innerHTML = '<div>白子先行：</div>';//清空记录信息
    message.scrollTop = 0;//滚动条回到顶部
    flag = true;//flag重新赋值为true
    count = 1;//步数重新计算
    canvas.on('click', setArr);
}