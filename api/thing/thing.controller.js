'use strict';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sqldb/Bible-NVI.db');

var fs = require('fs');
var request = require('request');
const async = require('async');
const dlXlsx = require('../../sqldb/dlXlsx');
const _ = require('lodash');
const xml2js = require('xml2js').parseString;





module.exports.findAll = function (req, res) {
    let xml = '<books><book><id>30892</id><bookName>国编杀手</bookName><ksCategoryId>14</ksCategoryId><ksCategoryPid>3</ksCategoryPid><categoryId>64486</categoryId><categoryPid>64472</categoryPid></book><book><id>46320</id><bookName>洪荒东皇</bookName><ksCategoryId>30</ksCategoryId><ksCategoryPid>2</ksCategoryPid><categoryId>64502</categoryId><categoryPid>64471</categoryPid></book><book><id>73928</id><bookName>剑绝龙泉</bookName><ksCategoryId>19</ksCategoryId><ksCategoryPid>1</ksCategoryPid><categoryId>64491</categoryId><categoryPid>64470</categoryPid></book></books>'
    xml2js(xml, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
        console.log(result.books);
    });
    request('http://hezuo.kanshu.cn/newoffer/booklist.php?cono=100530', function (error, response, body) {

        if (!error && response.statusCode == 200) {
            xml2js(body, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
                console.log(result);
                getBook(result.books.book[0].id);
                // _.map(result.books.book, function (item) {
                //     getBook(item.id);
                // });
            });
        }
    })



    function getBook(book_id) {
        request('http://hezuo.kanshu.cn/newoffer/getchapterlist.php?cono=100530&bookid=' + parseInt(book_id, 10) + ' ', function (error, response, body) {

            if (!error && response.statusCode == 200) {

                xml2js(body, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
                    console.log(result.chapters.chapter);
                    // getBookContent(result.chapters.chapter[0].chapterId, book_id);
                    _.map(result.chapters.chapter, function (item) {
                        getBookContent(item.chapterId, book_id);
                    })
                });
            }
        })
    }


    function getBookContent(chapter_id, book_id) {
        console.log(chapter_id, book_id);
        request('http://hezuo.kanshu.cn/newoffer/getcontent.php?cono=100530&bookid=' + parseInt(book_id, 10) + '&chapterid=' + parseInt(chapter_id, 10) + ' ', function (error, response, body) {

            if (!error && response.statusCode == 200) {

                xml2js(body, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
                    console.log(result);
                    // _.map(result.chapters.chapter, function (item) {
                    //     console.log(item.chapterid, item.content);
                    // })

                });
            } else {
                console.log(error);
            }
        })
    }

    res.status(200).send({ data: 1, status: 200 });



    // let arr = [];
    // // 获取token
    // let url = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=GGcpZzvzYIPfhNScNRP1tZyE&client_secret=ovQeQOVn4sAO0ihZKLwgDX4Op22ifSSm&';
    // request(url, function (error, response, body) {

    //     if (!error && response.statusCode == 200) {

    //         body = JSON.parse(body);
    //         console.log(body);
    //         if (body.access_token) {

    //             // 发起处理请求URL
    //             let baidubce = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer?charset=UTF-8&access_token=' + body.access_token + ''

    //             // 读取需要处理文章
    //             fs.readFile('./sqldb/霸仙绝杀.txt', function (err, data) {
    //                 // 读取文件失败/错误
    //                 if (err) {
    //                     throw err;
    //                 }
    //                 // 读取文件成功
    //                 // 根据总字数算出总共需要请求多少次
    //                 // 每2w个字符算请求一次
    //                 let ret = data.toString();
    //                 let Remainder = ret.length / 10000;
    //                 console.log(Remainder);
    //                 var i = 0, howManyTimes = Remainder;
    //                 // 递归调用每隔5s调用一次请求
    //                 function f() {

    //                     let sub = ret.substring(i * 10000, (i * 10000) + 10000);
    //                     request({
    //                         url: baidubce,
    //                         method: "POST",
    //                         json: true,
    //                         headers: {
    //                             "content-type": "application/json",
    //                         },
    //                         body: {
    //                             "text": sub
    //                         }
    //                     }, function (error, response, body) {

    //                         if (!error && response.statusCode == 200) {

    //                             //console.log(body);
    //                             for (let i = 0; i < body.items.length; i++) {
    //                                 if (body.items[i].ne === 'PER' ||
    //                                     body.items[i].ne === 'LOC' ||
    //                                     body.items[i].ne === 'ORG' ||
    //                                     body.items[i].ne === 'YY' ||
    //                                     body.items[i].ne === 'WLYY' ||
    //                                     body.items[i].ne === 'CNSH'


    //                                 ) {
    //                                     arr.push({ name: body.items[i].item, ne: body.items[i].ne });
    //                                 }

    //                             }


    //                         }
    //                     })
    //                     i++;
    //                     if (i <= howManyTimes) {
    //                         console.log(i);
    //                         setTimeout(f, 1000);
    //                     } else {


    //                         // 去重统计
    //                         function countId(data) {
    //                             var count = {};
    //                             for (var x = 0; x < data.length; x++) {
    //                                 if (count[data[x].name]) {
    //                                     count[data[x].name]++;
    //                                     continue;
    //                                 }
    //                                 count[data[x].name] = 1;
    //                             }
    //                             return count;
    //                         }
    //                         var countResult = countId(arr);

    //                         // 去重
    //                         function RemoveArr(result) {
    //                             for (var x = 0; x < result.length; x++) {
    //                                 for (var y = x + 1; y < result.length;) {
    //                                     if (result[x].name === result[y].name) {
    //                                         result.splice(y, 1)
    //                                     } else {
    //                                         y++
    //                                     }
    //                                 }
    //                             }
    //                             return result
    //                         }



    //                         let r = RemoveArr(arr);
    //                         // 比对 加入count字段
    //                         for (let index = 0; index < r.length; index++) {
    //                             for (var j in countResult) {
    //                                 if (r[index].name === j) {
    //                                     r[index]['count'] = countResult[j];
    //                                 }
    //                             }

    //                         }


    //                         _.orderBy(r, ['count'], ['desc']);
    //                         console.log('stop');
    //                         // 生成excel
    //                         dlXlsx(r);
    //                         // 强行终止
    //                         setTimeout(arguments.callee, 1000);
    //                     }
    //                 }
    //                 f();
    //             });


    //         }
    //     }
    // })









};

// module.exports.findAll = function(req, res) {
//   db.all("select * from BOOK_CHAPTER",function(err,ret){
//     if(!err) {
//       res.status(200).send({data: ret, status: 200});
//     } else {
//       console.log(err);
//     }
//   });
// };

module.exports.findById = function (req, res) {

};

// module.exports.findBySentence = function(req, res) {
//   let ret = req.params;
//   db.all("select * from CHAPTER_CONTENT where CHAPTER='"+ret.name+"' and SPACE = "+ret.content+" and SENTENCE = "+ret.sentence+"",function(err,ret){
//     if(!err) {
//       res.status(200).send({data: ret, status: 200});
//     } else {
//       console.log(err);
//     }
//   });
// };

// module.exports.findByCount = function(req, res) {
//   let ret = req.params;
//   db.all("select * from BOOK_CHAPTER where CHAPTER='"+ret.name+"'",function(err,ret){
//     if(!err) {
//       res.status(200).send({data: ret, status: 200});
//     } else {
//       console.log(err);
//     }
//   });
// };
