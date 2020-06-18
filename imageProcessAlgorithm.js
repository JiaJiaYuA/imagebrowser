// calc two pnt dis
function get_two_pnt_dis(pnt1, pnt2) {
    return Math.sqrt((pnt1.x - pnt2.x) * (pnt1.x - pnt2.x) + (pnt1.y - pnt2.y) * (pnt1.y - pnt2.y));
}

/* find circle ring edge
   from center to out: dir = 1Math.floor
*/
function findRingEagePnts(canvas, circleData, offset, dir) {
    let edgeNum = 36;
    let anglePitch = 360 / edgeNum;
    let centPnt = circleData.centerPoint;
    let outRaduis = circleData.raduis + offset;
    let innerRaduis = circleData.raduis - offset < 0 ? 0 : circleData.raduis - offset;

    // find each line
    let edgePntArray = []
    for (let i = 0; i < edgeNum; i++) {
        let linePixePntArray = [];
        let grayArray = []
        let innerPnt = new Point2d(centPnt.x + innerRaduis * Math.cos(i * anglePitch),
            centPnt.y + innerRaduis * Math.sin(i * anglePitch));
        let outPnt = new Point2d(centPnt.x + outRaduis * Math.cos(i * anglePitch),
            centPnt.y + outRaduis * Math.sin(i * anglePitch));
        let ringDis = get_two_pnt_dis(innerPnt, outPnt);

        let sumGray = 0;
        let samNum = Math.floor(ringDis + 0.5);
        for (let z = 0; z < samNum; z++) {
            let xPitch = (outPnt.x - innerPnt.x) / samNum;
            let yPitch = (outPnt.y - innerPnt.y) / samNum;
            let ctX = innerPnt.x + z * xPitch;
            let ctY = innerPnt.y + z * yPitch;
            let clientCoord = transImgCoordToClientCoord(ctX, ctY);
            let gray = canvas.getContext('2d').getImageData(clientCoord[0], clientCoord[1], 1, 1).data;
            let validGray = gray[0] * 0.299 + gray[1] * 0.587 + gray[2] * 0.114;
            linePixePntArray.push(new Point2d(ctX, ctY));
            grayArray.push(validGray);
            sumGray += validGray;
        }
        // find single pnt
        let avgGray = sumGray / samNum;
        // console.log(grayArray);
        let ctDir = grayArray[samNum - 1] - grayArray[0] > 0 ? 1 : 0; // inner < out: crDir = 1
        if (dir == 1) {
            for (let j = 0; j < samNum; j++) {
                if (ctDir == 1) {
                    if (grayArray[j] > avgGray) {
                        edgePntArray.push(linePixePntArray[j]);
                        break;
                    }
                } else {
                    if (grayArray[j] < avgGray) {
                        edgePntArray.push(linePixePntArray[j]);
                        break;
                    }
                }
            }
        } else {
            for (let j = samNum - 1; j > -1; j--) {
                if (ctDir == 1) {
                    if (grayArray[j] < avgGray) {
                        edgePntArray.push(linePixePntArray[j]);
                        break;
                    }
                } else {
                    if (grayArray[j] > avgGray) {
                        edgePntArray.push(linePixePntArray[j]);
                        break;
                    }
                }
            }
        }
    }

    return edgePntArray;
}

// fit circle
function fitCircle(pntArray) {
    let pntNmum = pntArray.length;
    if (pntNmum<3)
    {
        return [-1, -1, -1, -1];
    }

    let X1=0;
    let Y1=0;
    let X2=0;
    let Y2=0;
    let X3=0;
    let Y3=0;
    let X1Y1=0;
    let X1Y2=0;
    let X2Y1=0;

    for (let i=0;i<pntNmum;i++)
    {
        X1 = X1 + pntArray[i].x;
        Y1 = Y1 + pntArray[i].y;
        X2 = X2 + pntArray[i].x*pntArray[i].x;
        Y2 = Y2 + pntArray[i].y*pntArray[i].y;
        X3 = X3 + pntArray[i].x*pntArray[i].x*pntArray[i].x;
        Y3 = Y3 + pntArray[i].y*pntArray[i].y*pntArray[i].y;
        X1Y1 = X1Y1 + pntArray[i].x*pntArray[i].y;
        X1Y2 = X1Y2 + pntArray[i].x*pntArray[i].y*pntArray[i].y;
        X2Y1 = X2Y1 + pntArray[i].x*pntArray[i].x*pntArray[i].y;
    }

    let C,D,E,G,H,N;
    let a,b,c;
    N = pntNmum;
    C = N*X2 - X1*X1;
    D = N*X1Y1 - X1*Y1;
    E = N*X3 + N*X1Y2 - (X2+Y2)*X1;
    G = N*Y2 - Y1*Y1;
    H = N*X2Y1 + N*Y3 - (X2+Y2)*Y1;
    a = (H*D-E*G)/(C*G-D*D);
    b = (H*C-E*D)/(D*D-G*C);
    c = -(a*X1 + b*Y1 + X2 + Y2)/N;

    let A,B,R,area;
    A = a/(-2);
    B = b/(-2);
    R = Math.sqrt(a*a+b*b-4*c)/2;
    area = Math.PI*R*R;
    return [A, B, R, area];
}