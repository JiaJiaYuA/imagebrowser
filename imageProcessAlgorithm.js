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

// fit line
function fitLine(pntArray)
{
	let pntNmum = pntArray.length;
    if (pntNmum<3)
    {
        return [-1, -1, -1, -1];
    }

	let v00_1 = 0, v01_1 = 0, v10_1 = 0, v11_1 = 0, v00_2 = 0, v01_2 = 0, v10_2 = 0;
	for(let i = 0; i < pntArray.length; i++)
	{
		v00_1 += pntArray[i][0]*pntArray[i][2];
		v01_1 += pntArray[i][0];
		v10_1 += pntArray[i][1]*pntArray[i][2];
		v11_1 += pntArray[i][1];
		
		v00_2 += pntArray[i][2]*pntArray[i][2];
		v01_2 += pntArray[i][2];
		v10_2 += pntArray[i][2];
	}
	
	let col1P1 = [v00_1, v01_1];
	let col2P1 = [v10_1, v11_1];
	let P1 = [col1P1, col2P1];
	
	let col1P2 = [v00_2, v01_2];
	let col2P2 = [v10_2, pntArray.length];
	let P2 = [col1P2, col2P2];
	
	let P = multiply(P1,inv(P2));
	
	return [P[0][1], P[1][1], 0.0, P[0][1] + P[0][0], P[1][1] + P[1][0], 1.0];
	//linePnt1.x = P[0][1];
	//linePnt1.y = P[1][1];
	//linePnt1.z = 0.0;
	//
	//linePnt2.x = P[0][1] + P[0][0];
	//linePnt2.y = P[1][1] + P[1][0];
	//linePnt2.z = 1.0;

	//Eigen::Matrix2f P1, P2;
	//
	//float v00_1 = 0, v01_1 = 0, v10_1 = 0, v11_1 = 0, v00_2 = 0, v01_2 = 0, v10_2 = 0;
	//for (int i = 0; i < pntSize; i++)
	//{
	//	v00_1 += pnts[i].x*pnts[i].z;
	//	v01_1 += pnts[i].x;
	//	v10_1 += pnts[i].y*pnts[i].z;
	//	v11_1 += pnts[i].y;
	//
	//	v00_2 += pnts[i].z*pnts[i].z;
	//	v01_2 += pnts[i].z;
	//	v10_2 += pnts[i].z;
	//}
	//P1 << v00_1, v01_1, v10_1, v11_1;
	//P2 << v00_2, v01_2, v10_2, pntSize;
	//Eigen::Matrix2f P = P1*P2.inverse();
	//
	//line.pt1.x = P(0, 1); line.pt1.y = P(1, 1); line.pt1.z = 0;
	//line.pt2.x = P(0, 1)+P(0, 0); line.pt2.y = P(1, 1) + P(1, 0); line.pt2.z = 1;
}

function fitLine2D(pntArray)
{
	let pntNmum = pntArray.length;
    if (pntNmum<3)
    {
        return [-1, -1, -1, -1];
    }

    var pntMat1 = [];
    var pntMat2 = [];

    let mat300 = 0;
    let mat301 = 0;
	for(let i = 0; i < pntArray.length; i++)
	{
		pntMat1.push([pntArray[i][0], 1]);
        pntMat2.push([pntArray[i][1]]);
        mat300 += pntArray[i][0]*pntArray[i][0];
        mat301 += pntArray[i][0];
	}

	let pntMat3 = [];
    pntMat3.push([mat300, mat301]);
    pntMat3.push([mat301, pntArray.length]);

    //let lineInfoMat = inv(pntMat3)*transpose(pntMat1)*pntMat2;
    let lineInfoMatR1 = multiply(inv(pntMat3),transpose(pntMat1));
    let lineInfoMatR2 = multiply(lineInfoMatR1,pntMat2);

	return [0, lineInfoMatR2[1][0], 0, 1, lineInfoMatR2[1][0] + lineInfoMatR2[0][0], 0];
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

// 矩阵运算
// 转置矩阵
    function transpose(matrix) {    let result = new Array(matrix[0].length).fill(0).map(arr => new Array(matrix.length).fill(0));
    for (let i = 0; i < result.length; i++) {
        for (let j = 0; j < result[0].length; j++) {
            result[i][j] = matrix[j][i];
        }
    }
    return result;
}
    // 行列式
    function det(square) {
    // 方阵约束
    if (square.length !== square[0].length) {
        throw new Error();
    }
    // 方阵阶数
    let n = square.length;

    let result = 0;
    if (n > 3) {
        // n 阶
        for (let column = 0; column < n; column++) {
            // 去掉第 0 行第 column 列的矩阵
            let matrix = new Array(n - 1).fill(0).map(arr => new Array(n - 1).fill(0));
            for (let i = 0; i < n - 1; i++) {
                for (let j = 0; j < n - 1; j++) {
                    if (j < column) {
                        matrix[i][j] = square[i + 1][j];
                    } else {
                        matrix[i][j] = square[i + 1][j + 1];
                    }
                }
            }
            result += square[0][column] * Math.pow(-1, 0 + column) * det(matrix);
        }
    } else if (n === 3) {
        // 3 阶
        result = square[0][0] * square[1][1] * square[2][2] +
                 square[0][1] * square[1][2] * square[2][0] +
                 square[0][2] * square[1][0] * square[2][1] -
                 square[0][2] * square[1][1] * square[2][0] -
                 square[0][1] * square[1][0] * square[2][2] -
                 square[0][0] * square[1][2] * square[2][1];
    } else if (n === 2) {
        // 2 阶
        result = square[0][0] * square[1][1] - square[0][1] * square[1][0];
    } else if (n === 1) {
        // 1 阶
        result = square[0][0];
    }
    return result;
}
    // 伴随矩阵
    function adjoint(square) {
    // 方阵约束
    if (square[0].length !== square.length) {
        throw new Error();
    }

    let n = square.length;

    let result = new Array(n).fill(0).map(arr => new Array(n).fill(0));
    for (let row = 0; row < n; row++) {
        for (let column = 0; column < n; column++) {
            // 去掉第 row 行第 column 列的矩阵
            let matrix = [];
            for (let i = 0; i < square.length; i++) {
                if (i !== row) {
                    let arr = [];
                    for (let j = 0; j < square.length; j++) {
                        if (j !== column) {
                            arr.push(square[i][j]);
                        }
                    }
                    matrix.push(arr);
                }
            }
            result[row][column] = Math.pow(-1, row + column) * det(matrix);
        }
    }
    return transpose(result);
}
    // 逆矩阵
    function inv(square) {
        if (square[0].length !== square.length) {
            throw new Error();
        }
        let detValue = det(square);
        let result = adjoint(square);
        
        console.log(JSON.stringify(detValue))
        for (let i = 0; i < result.length; i++) {
            for (let j = 0; j < result.length; j++) {
                result[i][j] /= detValue;
            }
        }
        return result;
    }
    // 矩阵相乘
    function multiply(a, b) {
    // 相乘约束
    if (a[0].length !== b.length) {
        throw new Error();
    }
    let m = a.length;
    let p = a[0].length;
    let n = b[0].length;

    // 初始化 m*n 全 0 二维数组
    let c = new Array(m).fill(0).map(arr => new Array(n).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            for (let k = 0; k < p; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return c;
}