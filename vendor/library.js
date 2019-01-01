/**
 * library 常用库
 */


/**
 * 数组转json
 */
exports.arrToJson = function(arr) {
    if (!arr.length) return null;
    var i = 0;
    len = arr.length,
        array = [];
    for (; i < len; i++) {
        array.push({
            "projectname": arr[i][0],
            "projectnumber": arr[i][1]
        });
    }
     
    return JSON.stringify(array);
};