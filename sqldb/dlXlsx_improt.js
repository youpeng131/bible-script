'use strict';

var fs = require('fs');

const xlsx = require('xlsx');

const dlXlsxExprot = (data) => {
    let workbook = xlsx.readFile(data);
    let sheetNames = workbook.SheetNames;
    // 获取第一个workSheet
    let sheet = workbook.Sheets[sheetNames[0]];

    let ret_data = xlsx.utils.sheet_to_json(sheet);

    return ret_data;
}

module.exports = dlXlsxExprot;
