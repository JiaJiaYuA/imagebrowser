
function GeometricObjects() {

}

var GeometricObjectsArray = []

var GeometricType =  {
    POINT:0,
    CIRCLE:1,
    LINE:2,
    RECT:3
}

// 2d point
function Point2d(vX, vY) {
    this.x = vX;
    this.y = vY;
}

// 3d point
function Point3d(vX, vY, vZ) {
    this.x = vX;
    this.y = vY;
    this.z = vZ;
}

// pixel pnt
function PixelPnt(vX, vY, vGray) {
    this.x = vX;
    this.y = vY;
    this.gray = vGray;
}

function Color(vR, vG, vB) {
    this.r = vR;
    this.g = vG;
    this.b = vB;
}

function transClientCoordToImgCoord(pickX, pickY) {
    let offsetX = pickX / m_scale;
    let offsetY = pickY / m_scale;
    let imgX = offsetX - m_offX / m_scale;
    let imgY = offsetY - m_offY / m_scale;
    return [imgX, imgY];
}

function transImgCoordToClientCoord(imgX, imgY) {
    let pickX = (imgX + m_offX / m_scale)*m_scale;
    let pickY = (imgY + m_offY / m_scale)*m_scale;
    return [pickX, pickY];
}

// 2d circle, img coordinate

function Circle(centPnt, raduis, width, color) {
    this.type = GeometricType.CIRCLE;
    this.color = color;
    this.width = width;
    this.centerPoint = centPnt;
    this.raduis = raduis;
}

function PointData(coord, color) {
    this.type = GeometricType.POINT;
    this.color = color;
    this.centerPoint = coord;
}

function Line2D(stPnt, edPnt, width, color) {
    this.type = GeometricType.LINE;
    this.color = color;
    this.width = width;
    this.stLinePnt = stPnt;
    this.edLinePnt = edPnt;
}

// draw circle
function drawCircle(canvas, circleData) {
    let ctx = canvas.getContext('2d');
    let centClinet = transImgCoordToClientCoord(circleData.centerPoint.x, circleData.centerPoint.y);
    ctx.beginPath();
    // ctx.moveTo(center.x, center.y);
    ctx.arc(centClinet[0], centClinet[1],
        circleData.raduis*m_scale, 0 * Math.PI / 180, 360 * Math.PI / 180, true);
    // ctx.closePath();

    ctx.strokeStyle = circleData.color;
    ctx.width = circleData.width;
    ctx.stroke();
}

// draw point
function drawPoint(canvas, pointData) {
    let ctx = canvas.getContext('2d');
    let centClinet1 = transImgCoordToClientCoord(pointData.centerPoint.x, pointData.centerPoint.y);
    let centClinet2 = transImgCoordToClientCoord(pointData.centerPoint.x + 1, pointData.centerPoint.y + 1);
    ctx.beginPath();
    ctx.moveTo(centClinet1[0], centClinet1[1]);
    ctx.lineTo(centClinet2[0], centClinet2[1]);
    ctx.strokeStyle = pointData.color;
    ctx.closePath();
    ctx.stroke();
}

// draw line
function drawLine2D(canvas, lineData2D) {
     let ctx = canvas.getContext('2d');
     let centClinet1 = transImgCoordToClientCoord(lineData2D.stLinePnt.x, lineData2D.stLinePnt.y);
     let centClinet2 = transImgCoordToClientCoord(lineData2D.edLinePnt.x, lineData2D.edLinePnt.y);
     ctx.beginPath();
     ctx.moveTo(centClinet1[0], centClinet1[1]);
     ctx.lineTo(centClinet2[0], centClinet2[1]);
     ctx.strokeStyle = lineData2D.color;
     ctx.closePath();
     ctx.stroke();
}

function drawPoints(canvas, pntArray, color) {
    for (let i = 0 ; i < pntArray.length; i++){
        let ctPntData = new PointData(pntArray[i], color);
        drawPoint(canvas, ctPntData);
    }
}

function drawDetectCircle(canvas, circleData, offset) {
    circleData.color = 'blue';
    drawCircle(canvas, circleData);

     let innerCircle = { ...circleData};
    innerCircle.color = 'red';
    innerCircle.raduis = (innerCircle.raduis - offset < 0) ? 0 : innerCircle.raduis - offset;
    drawCircle(canvas, innerCircle);

    let outCircle = { ...circleData};
    outCircle.color = 'green';
    outCircle.raduis = outCircle.raduis + offset;
    drawCircle(canvas, outCircle);
}

function drawGeometrixObject(canvas, geomObj) {
    switch (geomObj.type) {
        case GeometricType.CIRCLE:
            drawCircle(canvas,geomObj);
            break;
        case GeometricType.POINT:
            drawPoint(canvas, geomObj);
            break;
        case GeometricType.LINE:
            drawLine2D(canvas, geomObj)
            break;
    }
}