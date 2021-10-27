// 一个宏，根据op字符串进行相应的运算
var math_it_up = {
    '+': function (x, y) {
        return x + y
    },
    '-': function (x, y) {
        return x - y
    },
    '*': function (x, y) {
        return x * y
    },
    '/': function (x, y) {
        return x / y
    }
};
// 生成n以内加减混合、3操作数、不带括号的完整算式全集（排除前两项如果是减法产生负数，排除前两项如果是加法产生大于n的数）
function gen_calculation_3_ops(n) {
    var arr = new Array();
    let ops = ['+', '-']
    for (let firstNum = 1; firstNum < n; firstNum++) {
        for (let firstOp of ops) {
            for (let secNum = 1; secNum < n; secNum++) {
                for (let secOp of ops) {
                    for (let thirdNum = 1; thirdNum < n; thirdNum++) {
                        let rs2 = math_it_up[firstOp](firstNum, secNum);
                        let rs = math_it_up[secOp](rs2, thirdNum);
                        if (rs < n && rs > 0 && rs2 > 0 && rs2 < n)
                            arr.push({
                                firstNum,
                                firstOp,
                                secNum,
                                secOp,
                                thirdNum,
                                brac: -1,
                                rs
                            })
                    }
                }
            }
        }
    }
    // console.log(arr.length)
    return arr
}
// 生成n以内加减混合、3操作数、后面带括号的完整算式全集（排除括号内减法产生负数，排除括号内加法大于n）
function gen_calculation_brac_3_ops(n) {
    var arr = new Array();
    let ops = ['+', '-']
    for (let firstNum = 1; firstNum < n; firstNum++) {
        for (let firstOp of ops) {
            for (let secNum = 1; secNum < n; secNum++) {
                for (let secOp of ops) {
                    for (let thirdNum = 1; thirdNum < n; thirdNum++) {
                        let rs2 = math_it_up[secOp](secNum, thirdNum);
                        let rs = math_it_up[firstOp](firstNum, rs2);
                        if (rs < n && rs > 0 && rs2 > 0 && rs2 < n)
                            arr.push({
                                firstNum,
                                firstOp,
                                secNum,
                                secOp,
                                thirdNum,
                                brac: 1,
                                rs
                            })
                    }
                }
            }
        }
    }
    // console.log(arr)
    return arr
}
// 生成n以内加减混合、2操作数、不带括号的完整算式全集
function gen_calculation_2_ops(n) {
    var arr = new Array();
    let ops = ['+', '-']
    for (let firstNum = 1; firstNum < n; firstNum++) {
        for (let firstOp of ops) {
            for (let secNum = 1; secNum < n; secNum++) {
                rs = math_it_up[firstOp](firstNum, secNum);
                if (rs < n && rs > 0)
                    arr.push({ firstNum, firstOp, secNum, rs })
            }
        }
    }
    // console.log(arr)
    return arr
}
// ===============================================================2操作数的题目生成========================================================================================
// 随机生成2操作数的num道n以内加减混合算式,20以内的退位减法只有45道左右
// ☑加减混合
// ☑进退位控制（是否进退位由addAndSub控制,0为无进退位，1为有进退位，其它为随机进退位）
// ☑算符控制（op为'+'时只生成加法，为'-'时只生成减法，为其它时随机生成加减法）
function plus_minus_2ops(num, n, addAndSub, op) {
    var arr = gen_calculation_2_ops(n)
    let count = 0;
    let proSet = new Set();
    switch (addAndSub) {
        //无进退位
        case 0:
            while (count < num) {
                let index = Math.floor(Math.random() * arr.length);
                let aas = math_it_up[arr[index].firstOp](arr[index].firstNum % 10, arr[index].secNum % 10);
                if (((arr[index].firstOp == op) || (op != '+' && op != '-')) && (aas < 10 && aas >= 0) && proSet.add(arr[index]).size > count)
                    count++;
            }
        //有进退位
        case 1:
            while (count < num) {
                let index = Math.floor(Math.random() * arr.length);
                let aas = math_it_up[arr[index].firstOp](arr[index].firstNum % 10, arr[index].secNum % 10);
                
                if (((arr[index].firstOp == op) || (op != '+' && op != '-')) && (aas >= 10 || aas < 0) && proSet.add(arr[index]).size > count)
                    count++;
            }
        //随机进退位
        default:
            while (count < num) {
                let index = Math.floor(Math.random() * arr.length);
                if (((arr[index].firstOp == op) || (op != '+' && op != '-')) && proSet.add(arr[index]).size > count)
                    count++;
            }
            break;
    }
    // let oo = 0;
    // for (let i of proSet.values()) {
    //     console.log(++oo + '. ', i.firstNum, i.firstOp, i.secNum, '=', i.rs);
    // }
    return proSet
}
// =================================================================3操作数的题目生成==========================================================================☑☒
// 随机生成num道n以内3操作数的算式
// ☑括号控制（是否有括号由brac控制,0为常无括号，1为常有括号，其它为随机出现括号）
// ☑进退位控制（是否进退位由addAndSub控制,0为无进退位，1为有进退位，其它为随机进退位）
// ☑加减操作控制（由op参数控制，'+'为全部连续加，'-'为全部连续减，'±'为随机连续加减，其它为加减混合）
// 注：带括号的运算不考虑连加连减
function plus_minus_3ops(num, n, brac, addAndSub, op) {
    let count = 0;
    let proSet = new Set();
    switch (brac) {
        // 常无括号,按顺序计算
        case 0:
            {
                var arr = gen_calculation_3_ops(n)
                while (count < num) {
                    let index = Math.floor(Math.random() * arr.length);
                    let aas = math_it_up[arr[index].firstOp](arr[index].firstNum % 10, arr[index].secNum % 10);
                    let aas2 = math_it_up[arr[index].secOp](aas%10, arr[index].thirdNum%10);

                    if (
                        (!(addAndSub^((aas>=10 || aas<0) || (aas2>=10 || aas2<0))) || (addAndSub!=1 && addAndSub!=0)) 
                        && ((arr[index].firstOp == arr[index].secOp && '±' == op) ||
                            (arr[index].firstOp == arr[index].secOp && arr[index].secOp == op)||
                            (('±'!= op) && ('-'!= op) && ('+'!= op)))
                        && proSet.add(arr[index]).size > count
                    )
                        count++;
                }
                break;
            }
        // 常有括号，一定在第二位置
        case 1:
            {
                var arrBrac = gen_calculation_brac_3_ops(n)
                while (count < num) {
                    let index = Math.floor(Math.random() * arrBrac.length);
                    let aas = math_it_up[arrBrac[index].secOp](arrBrac[index].secNum % 10, arrBrac[index].thirdNum % 10);
                    let aas2 = math_it_up[arrBrac[index].firstOp](arrBrac[index].firstNum%10,aas%10);
                    if (
                        (!(addAndSub^((aas>=10 || aas<0) || (aas2>=10 || aas2<0))) || (addAndSub!=1 && addAndSub!=0)) 
                        &&
                        ((arrBrac[index].firstOp == arrBrac[index].secOp && '±' == op) ||
                            (arrBrac[index].firstOp == arrBrac[index].secOp && arrBrac[index].secOp == op)||
                            (('±'!= op) && ('-'!= op) && ('+'!= op)))
                        && proSet.add(arrBrac[index]).size > count
                    )
                        count++;
                }
                break;
            }
        // 随机括号，一定在第二位置
        default:
            {
                var arr = gen_calculation_3_ops(n);
                var arrBrac = gen_calculation_brac_3_ops(n);
                while (count < num) {
                    let index = Math.floor(Math.random() * arr.length);
                    let isBrac = Math.floor(Math.random() * 2);
                    // console.log(isBrac)
                    if (isBrac == 0) {
                        let aas = math_it_up[arr[index].firstOp](arr[index].firstNum % 10, arr[index].secNum % 10);
                        let aas2 = math_it_up[arr[index].secOp](aas%10, arr[index].thirdNum%10);
                        if (
                            (!(addAndSub^((aas>=10 || aas<0) || (aas2>=10 || aas2<0))) || (addAndSub!=1 && addAndSub!=0)) 
                            &&
                            ((arr[index].firstOp == arr[index].secOp && '±' == op) ||
                        (arr[index].firstOp == arr[index].secOp && arr[index].secOp == op)||
                        (('±'!= op) && ('-'!= op) && ('+'!= op)))
                    &&proSet.add(arr[index]).size > count)
                            count++;
                    }
                    else {
                        let aas = math_it_up[arrBrac[index].secOp](arrBrac[index].secNum % 10, arrBrac[index].thirdNum % 10);
                         let aas2 = math_it_up[arrBrac[index].firstOp](arrBrac[index].firstNum%10,aas%10);
                        if (
                            (!(addAndSub^((aas>=10 || aas<0) || (aas2>=10 || aas2<0))) || (addAndSub!=1 && addAndSub!=0)) 
                        &&
                            ((arrBrac[index].firstOp == arrBrac[index].secOp && '±' == op) ||
                        (arrBrac[index].firstOp == arrBrac[index].secOp && arrBrac[index].secOp == op)||
                        (('±'!= op) && ('-'!= op) && ('+'!= op)))
                    &&proSet.add(arrBrac[index]).size > count)
                            count++;
                    }
                }
                break;
            }
    }

    return proSet
}

//==========================example==================
// plus_minus_3ops(100, 100,1,1,'p')
