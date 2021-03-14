<!--    页面加载完毕即加载Maichel Jackson-->
window.onload = function () {
    document.querySelector("#maichelJacksonLeft").src = "";
    document.querySelector("#maichelJacksonRight").src = "";
    document.oncontextmenu = function (e) {
        e.preventDefault();
    };
    document.body.parentNode.style.overflow = "hidden";
    <!--        console.log("document load");-->
}

// 选择文件路径
function getFileContent() {
    var contentReader = new FileReader();
    var file = document.querySelector("#myFile").files;
    contentReader.readAsDataURL(file[0]);

    contentReader.onload = function () {
        m_scale = 1.0;
        m_offX = 0;
        m_offY = 0;
        let canvas = document.querySelector('#myCanvas');
        let cxt = canvas.getContext('2d');

        m_img = new Image();
        m_img.onload = function () {
            let markJsonWidth = document.querySelector("#maichelJacksonLeft").width;
            let markJsonHeight = document.querySelector("#maichelJacksonLeft").height;
            // document.querySelector("#outputInfoArea").width = markJsonWidth;
            let xRadio = window.innerWidth / markJsonWidth;
            let yRadio = (window.innerHeight - 70) / markJsonHeight;
            let isFitWidth = (xRadio < yRadio) ? true : false;
            m_showRadio = (xRadio < yRadio) ? xRadio : yRadio;

            canvas.width = m_img.width;
            canvas.height = m_img.height;
            // if(m_img.width/markJsonWidth>m_showRadio)
            {
                let scale = m_img.height / m_img.width;
                if (isFitWidth) {
                    canvas.width = m_showRadio * markJsonWidth;
                    canvas.height = canvas.width * scale;
                } else {
                    canvas.height = m_showRadio * markJsonHeight;
                    canvas.width = canvas.height / scale;
                }
                // console.log("width1:"+window.innerWidth);
                // console.log("height1:"+window.innerHeight);
            }
            m_scale = canvas.width / m_img.width;
            originImageWidth = m_img.width;
            originImageHeight = m_img.height;
            drawImage(m_img);
        }
        m_img.src = contentReader.result;
    }
}

// 获取数据按钮事件
function getDataBtnSlot() {

    // var script = document.createElement('script');
    // script.type = 'text/javascript';
    //
    // // 传参并指定回调执行函数为onBack
    // script.src = 'http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz000007&scale=5&ma=5&datalen=240';
    // document.head.appendChild(script);
    // var d = window.frames["CN_MarketData.getKLineData"].document;
    // var preA = d.getElementsByTagName("pre");
    // a = 0;
    // // 回调执行函数
    // function onBack(res) {
    //     console.log(JSON.stringify(res));
    //     // alert(JSON.stringify(res));
    // }

		// let scriptDom = document.createElement("script");
		// scriptDom.type="text/javascript";
		// scriptDom.id = "scriptId";
		// scriptDom.src = "http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz000007&scale=5&ma=5&datalen=240";
		// document.body.appendChild(scriptDom);
        //
		// // scriptDom.remove();
		// let oldScriptDom =document.getElementById("scriptId");
		// var a = oldScriptDom.innerText;
		// var preStr = oldScriptDom.getElementsByTagName("pre");
		// a = 0;

     // var getJSON = function(url) {
     //   return new Promise(function(resolve, reject) {
     //    var xhr = new XMLHttpRequest();
     //     xhr.open('get', url, true);
     //     xhr.responseType = 'json';
     //    xhr.onload = function() {
     //       var status = xhr.status;
     //       if (status == 200) {
     //         resolve(xhr.response);
     //       } else {
     //         reject(status);
     //       }
     //     };
     //     xhr.send();
     //   });
     // };
     //
     // getJSON('http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData?symbol=sz000007&scale=5&ma=5&datalen=240').then(function(data) {
     //     // alert('Your Json result is:  ' + data); //you can comment this, i used it to debug
     //     //
     //     //
     //     // var html = '<ul>';
     //     // for (var i = 0; i < data.length; i++) {
     //     //     html += '<li>' + 'jobID is:'+data[i].jobID + ', file path is' +data[i].filePath + '</li>';
     //     // }
     //     // html += '</ul>';
     //
     //    document.querySelector("#outputInfoArea").textContent = data;
     //     // document.getElementById('result').innerHTML = html; //display the result in an HTML element
     // }, function(status) { //error detection....
     //   alert('Something went wrong.');
     // });


    // <script type="text/javascript" src="https://hq.sinajs.cn/list=sh601006,sh601001" charset="gb2312"></script>;

    // var xmlhttp=new XMLHttpRequest();
    // var url = "https://hq.sinajs.cn/list=sh601006,sh601001";
    // var another = open(url);
    //
    // // another
    // close();
    //document.querySelector("#outputInfoArea").textContent = realSharesData[0];
}

function geomDrawTypeChange(selectIndex) {
    // console.log(selectIndex);
    if(selectIndex == 0)
    {
        m_currtDrawGeomType = GeometricType.CIRCLE;
    }
    else if(selectIndex == 1)
    {
        m_currtDrawGeomType = GeometricType.LINE;
    }
}

// 将图片绘制于canvas中, 适配canvas大小
function drawImage(image) {
    let ctImgWidth = originImageWidth * m_scale;
    let ctImgHeight = originImageHeight * m_scale;
    let canvas = document.querySelector('#myCanvas');
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    canvas.getContext('2d').drawImage(image, m_offX, m_offY, ctImgWidth, ctImgHeight);

    for (let i = 0; i < GeometricObjectsArray.length; i++) {
        drawGeometrixObject(canvas, GeometricObjectsArray[i]);
    }
}

//给content图片加鼠标事件
document.querySelector("#myCanvas").addEventListener("mousemove", function (e) {
    let canvas = document.querySelector('#myCanvas');
    let corrds = getCurrtMouseImgCorrd(e);
    let imgX = corrds[0];
    let imgY = corrds[1];
    let pickX = Math.floor((e.clientX - canvas.getBoundingClientRect().left) * 1000, 3) / 1000.;
    let pickY = Math.floor((e.clientY - canvas.getBoundingClientRect().top) * 1000, 3) / 1000.;
    let gray = this.getContext('2d').getImageData(pickX, pickY, 1, 1).data;

    document.querySelector("#MousePosition").textContent = "像素坐标： " + imgX + "px, " + imgY + "px" + "； 像素信息： ("
        + gray[0] + "," + gray[1] + "," + gray[2] + ")";
    if (e.buttons == 1) {
        //console.log("left button down move");
        if(m_currtDrawGeomType == GeometricType.CIRCLE)
        {
            let pickPnt2d = new Point2d(imgX, imgY);
            let ctRaduis = get_two_pnt_dis(pickPnt2d, m_leftDownPnt);
            let circle = new Circle(m_leftDownPnt, ctRaduis, 1, 'blue');
            drawImage(m_img);
            m_edgePnts = findRingEagePnts(canvas, circle, 5, 1);
            drawDetectCircle(canvas, circle, 5);
            drawPoints(canvas, m_edgePnts, 'red');
            // let fitCircleData = fitCircle(edgePnts);
            // console.log(edgePnts.length);
            // GeometricObjectsArray.push(circle);
        }
        else if(m_currtDrawGeomType == GeometricType.LINE)
        {
            m_leftUpPnt = new Point2d(imgX, imgY);
            let lineData = new Line2D(m_leftDownPnt, m_leftUpPnt, 1, 'blue');
            drawImage(m_img);
            drawLine2D(canvas, lineData);
        }
    } else if (e.buttons == 2) {
        //console.log("right button move");
    }
})

function getCanvasCorrd(e) {
    let canvas = document.querySelector('#myCanvas');
    let pickX = Math.floor((e.clientX - canvas.getBoundingClientRect().left) * 1000, 3) / 1000.;
    let pickY = Math.floor((e.clientY - canvas.getBoundingClientRect().top) * 1000, 3) / 1000.;

    return [pickX, pickY];
}

function getCurrtMouseImgCorrd(e) {
    let canvas = document.querySelector('#myCanvas');
    let pickX = Math.floor((e.clientX - canvas.getBoundingClientRect().left) * 1000, 3) / 1000.;
    let pickY = Math.floor((e.clientY - canvas.getBoundingClientRect().top) * 1000, 3) / 1000.;
    let offsetX = pickX / m_scale;
    let offsetY = pickY / m_scale;
    let imgX = offsetX - m_offX / m_scale;
    let imgY = offsetY - m_offY / m_scale;

    return [imgX, imgY];
}

function addGeomtricDataToOutput(geomObj) {
    let outputTextArea = document.querySelector('#outputInfoArea');
    switch (geomObj.type) {
        case GeometricType.CIRCLE:
            outputTextArea.value = outputTextArea.value +
                'coord: ('+Math.floor(geomObj.centerPoint.x * 1000)/1000 + ',' +
            Math.floor(geomObj.centerPoint.y*1000)/1000 + ')' +
                '  raduis:' + Math.floor(geomObj.raduis*1000)/1000 +
                '  area:' + Math.floor(Math.PI*geomObj.raduis*geomObj.raduis*1000)/1000 + '\n';
            break;
        case GeometricType.POINT:
            break;
        case GeometricType.LINE:
            let x1 = Math.floor(geomObj.stLinePnt.x*1000)/1000;
            let y1 = Math.floor(geomObj.stLinePnt.y*1000)/1000;
            let x2 = Math.floor(geomObj.edLinePnt.x*1000)/1000;
            let y2 = Math.floor(geomObj.edLinePnt.y*1000)/1000;
            let dis = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));

            outputTextArea.value = outputTextArea.value +
                'distance:' + dis + ' pixel' + '\n';
            break;
    }
}

function resetMousePickData()
{
    m_leftUpPnt.x = -1;
    m_leftUpPnt.y = -1;
    m_leftDownPnt.x = -1;
    m_leftDownPnt.y = -1;
}

// 鼠标滚轮事件
document.querySelector("#myCanvas").addEventListener("mousewheel", function (e) {
    var prePnts = getCurrtMouseImgCorrd(e);
    var newImgPnts = getCurrtMouseImgCorrd(e);
    if (e.wheelDelta < 0 && m_scale > m_minSmallerRadio) {
        m_scale -= 0.1;
        newImgPnts = getCurrtMouseImgCorrd(e);
    } else if (e.wheelDelta > 0 && m_scale < m_maxBiggerRadio) {
        m_scale += 0.1;
        newImgPnts = getCurrtMouseImgCorrd(e);
    }
    m_offX += (newImgPnts[0] - prePnts[0]) * m_scale;
    m_offY += (newImgPnts[1] - prePnts[1]) * m_scale;
    //console.log([m_offX,m_offY]);
    drawImage(m_img);
})

//
document.querySelector("#myCanvas").addEventListener("mousedown", function (e) {
    let canvas = document.querySelector('#myCanvas');
    if (e.buttons == 1) {
        let pickPnt = getCurrtMouseImgCorrd(e);
        m_leftDownPnt.x = pickPnt[0];
        m_leftDownPnt.y = pickPnt[1];
        // drawCircle(canvas, circle);
        // GeometricObjectsArray.push(circle);
    } else if (e.buttons == 2) {
        let outputTextArea = document.querySelector('#outputInfoArea');
        outputTextArea.value = '';
        GeometricObjectsArray.length = 0;
        m_edgePnts.length = 0;
        drawImage(m_img);
    }
})

document.querySelector("#myCanvas").addEventListener("mouseup", function (e) {
    let canvas = document.querySelector('#myCanvas');
    // console.log(e);
    if (e.buttons == 0) {
        if(m_currtDrawGeomType == GeometricType.CIRCLE)
        {
            if (m_edgePnts.length > 3) {
            let fitCircleData = fitCircle(m_edgePnts);

            // let pickPnt = getCurrtMouseImgCorrd(e);
            // let pickPnt2d = new Point2d(pickPnt[0], pickPnt[1]);
            // let circle = new Circle(pickPnt2d, 10, 1,'blue');
            // drawCircle(canvas, circle);
            let singleData = new Circle(new Point2d(fitCircleData[0], fitCircleData[1]), fitCircleData[2],
                3, 'red');
            GeometricObjectsArray.push(singleData);
            addGeomtricDataToOutput(singleData);
            // console.log(fitCircleData);
            m_edgePnts = 0;
            drawImage(m_img);
            }
        }
        else if(m_currtDrawGeomType == GeometricType.LINE)
        {
            if(m_leftUpPnt.x != -1)
            {
                let drawLineData = new Line2D(new Point2d(m_leftDownPnt.x, m_leftDownPnt.y),
                    new Point2d(m_leftUpPnt.x, m_leftUpPnt.y), 1, 'red');
                GeometricObjectsArray.push(drawLineData);
                addGeomtricDataToOutput(drawLineData);
                drawImage(m_img);
                resetMousePickData();
            }
        }

        // console.log("left button up");
    } else if (e.buttons == 2) {
    }
})

//
var m_img;
var m_offX = 0;
var m_offY = 0;
var m_scale = 1.0;
var originImageWidth;
var originImageHeight;

var m_minSmallerRadio = 0.2;
var m_maxBiggerRadio = 10;
var m_showRadio = 2.8;

var m_edgePnts = [];
var m_leftDownPnt = new Point2d(-1, -1);
var m_leftUpPnt = new Point2d(-1, -1);
var m_currtDrawGeomType = GeometricType.CIRCLE;