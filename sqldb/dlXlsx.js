'use strict';

var fs = require('fs');

const XLSX = require('xlsx');

const dlXlsx = (data) => {
    // console.log(a);
    // 将数据转成workSheet
    let jsonWorkSheet = XLSX.utils.json_to_sheet(data);
    // 构造workBook
    let workBook = {
        SheetNames: ['jsonWorkSheet'],
        Sheets: {
            'jsonWorkSheet': jsonWorkSheet,
        }
    };
    // 将workBook写入文件
    XLSX.writeFile(workBook, './sqldb/霸仙绝杀.xlsx');

}

module.exports = dlXlsx;
