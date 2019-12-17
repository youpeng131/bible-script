'use strict';
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sqldb/Bible-NVI.db');

const fs = require('fs');
const request = require('request');
var md5 = require('md5');
const async = require('async');
const replaceall = require("replaceall");
const dlXlsx = require('../../sqldb/dlXlsx');
const dlXlsx_improt = require('../../sqldb/dlXlsx_improt');
const _ = require('lodash');
const xml2js = require('xml2js').parseString;






module.exports.findAll = function (req, res) {


    // 获取书籍  --- start

    // let xml = '<books><book><id>30892</id><bookName>国编杀手</bookName><ksCategoryId>14</ksCategoryId><ksCategoryPid>3</ksCategoryPid><categoryId>64486</categoryId><categoryPid>64472</categoryPid></book><book><id>46320</id><bookName>洪荒东皇</bookName><ksCategoryId>30</ksCategoryId><ksCategoryPid>2</ksCategoryPid><categoryId>64502</categoryId><categoryPid>64471</categoryPid></book><book><id>73928</id><bookName>剑绝龙泉</bookName><ksCategoryId>19</ksCategoryId><ksCategoryPid>1</ksCategoryPid><categoryId>64491</categoryId><categoryPid>64470</categoryPid></book></books>'
    // xml2js(xml, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
    //     console.log(result.books);
    // });
    // request('http://hezuo.kanshu.cn/newoffer/booklist.php?cono=100530', function (error, response, body) {

    //     if (!error && response.statusCode == 200) {
    //         xml2js(body, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
    //             console.log(result);
    //             getBook(result.books.book[0].id);
    //             // _.map(result.books.book, function (item) {
    //             //     getBook(item.id);
    //             // });
    //         });
    //     }
    // })



    // function getBook(book_id) {
    //     request('http://hezuo.kanshu.cn/newoffer/getchapterlist.php?cono=100530&bookid=' + parseInt(book_id, 0) + '&chapternum=' + 0 + '', function (error, response, body) {

    //         if (!error && response.statusCode == 200) {

    //             xml2js(body, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
    //                 // getBookContent(result.chapters.chapter[0].chapterId, book_id);
    //                 _.map(result.chapters.chapter, function (item) {
    //                     getBookContent(item.chapterId, book_id);
    //                 })
    //             });
    //         }
    //     })
    // }


    // function getBookContent(chapter_id, book_id) {
    //     console.log(chapter_id, book_id);
    //     request('http://hezuo.kanshu.cn/newoffer/getcontent.php?cono=100530&bookid=' + parseInt(book_id, 10) + '&chapterid=' + parseInt(chapter_id, 10) + ' ', function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             xml2js(body, { explicitArray: false, ignoreAttrs: true }, function (err, result) {
    //                 console.log(result.chapters.chapter.chapterid);
    //                 console.log(result.chapters.chapter.content);
    //             });
    //         } else {
    //             console.log(error);
    //         }
    //     })
    // }

    // res.status(200).send({ data: 1, status: 200 });

    // 获取书籍  --- end



    // 提取关键词  -- start

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


    // 提取关键词  -- end




    // Pre-processing -- start


    const luren = [{
        "puyu_main_user_name": "Hermínia"
    }, {
        "puyu_main_user_name": "Lúcia"
    }, {
        "puyu_main_user_name": "Aline"
    }, {
        "puyu_main_user_name": "Rosário"
    }, {
        "puyu_main_user_name": "Mariazinha"
    }, {
        "puyu_main_user_name": "Luana"
    }, {
        "puyu_main_user_name": "Josefina"
    }, {
        "puyu_main_user_name": "Luísa"
    }, {
        "puyu_main_user_name": "Manuela"
    }, {
        "puyu_main_user_name": "Feliciano"
    }, {
        "puyu_main_user_name": "Hugo"
    }, {
        "puyu_main_user_name": "Adriano"
    }, {
        "puyu_main_user_name": "Fabricio"
    }, {
        "puyu_main_user_name": "Elias"
    }, {
        "puyu_main_user_name": "Vítor"
    }, {
        "puyu_main_user_name": "Fortunato"
    }, {
        "puyu_main_user_name": "Diego"
    }, {
        "puyu_main_user_name": "Bruno"
    }, {
        "puyu_main_user_name": "Henrique"
    }, {
        "puyu_main_user_name": "Octávio"
    }, {
        "puyu_main_user_name": "Florencio"
    }, {
        "puyu_main_user_name": "Edu"
    }, {
        "puyu_main_user_name": "Modesto"
    }, {
        "puyu_main_user_name": "Artur"
    }, {
        "puyu_main_user_name": "Marciano"
    }, {
        "puyu_main_user_name": "Ronaldo"
    }, {
        "puyu_main_user_name": "Hermenegildo"
    }, {
        "puyu_main_user_name": "Roberto"
    }, {
        "puyu_main_user_name": "Brian"
    }, {
        "puyu_main_user_name": "Antónia"
    }, {
        "puyu_main_user_name": "Palmira"
    }, {
        "puyu_main_user_name": "Nelinha"
    }, {
        "puyu_main_user_name": "Cassandra"
    }, {
        "puyu_main_user_name": "Neves"
    }, {
        "puyu_main_user_name": "Brígida"
    }, {
        "puyu_main_user_name": "Clara"
    }, {
        "puyu_main_user_name": "Domitila"
    }, {
        "puyu_main_user_name": "Helena"
    }, {
        "puyu_main_user_name": "Vera"
    }, {
        "puyu_main_user_name": "Roque"
    }, {
        "puyu_main_user_name": "Zezé"
    }, {
        "puyu_main_user_name": "Eugênio"
    }, {
        "puyu_main_user_name": "Gaspar"
    }, {
        "puyu_main_user_name": "Fábio"
    }, {
        "puyu_main_user_name": "Lucas"
    }, {
        "puyu_main_user_name": "Guálter"
    }, {
        "puyu_main_user_name": "Maximiliano"
    }, {
        "puyu_main_user_name": "António"
    }, {
        "puyu_main_user_name": "Tiago"
    }, {
        "puyu_main_user_name": "Custódio"
    }, {
        "puyu_main_user_name": "Cipriano"
    }, {
        "puyu_main_user_name": "Danilo"
    }, {
        "puyu_main_user_name": "Nelinho"
    }, {
        "puyu_main_user_name": "Marquinhos"
    }, {
        "puyu_main_user_name": "Carlinhos"
    }, {
        "puyu_main_user_name": "Marciano"
    }, {
        "puyu_main_user_name": "Atílio"
    }, {
        "puyu_main_user_name": "Isac"
    }, {
        "puyu_main_user_name": "Manoel"
    }, {
        "puyu_main_user_name": "Diana"
    }, {
        "puyu_main_user_name": "Julie"
    }, {
        "puyu_main_user_name": "Nicole"
    }, {
        "puyu_main_user_name": "Mia"
    }, {
        "puyu_main_user_name": "Palmira"
    }, {
        "puyu_main_user_name": "Maristela"
    }, {
        "puyu_main_user_name": "Maristela"
    }, {
        "puyu_main_user_name": "Rosa"
    }, {
        "puyu_main_user_name": "Victória"
    }, {
        "puyu_main_user_name": "Maiara"
    }, {
        "puyu_main_user_name": "Noemí"
    }, {
        "puyu_main_user_name": "Moema"
    }, {
        "puyu_main_user_name": "Irene"
    }, {
        "puyu_main_user_name": "Valéria"
    }, {
        "puyu_main_user_name": "Narcisa"
    }, {
        "puyu_main_user_name": "Clotilde"
    }, {
        "puyu_main_user_name": "Úrsula"
    }, {
        "puyu_main_user_name": "Neves"
    }, {
        "puyu_main_user_name": "Luciana"
    }, {
        "puyu_main_user_name": "Liliana"
    }, {
        "puyu_main_user_name": "Dimas"
    }, {
        "puyu_main_user_name": "Helder"
    }, {
        "puyu_main_user_name": "David"
    }, {
        "puyu_main_user_name": "Caio"
    }, {
        "puyu_main_user_name": "Jeremias"
    }, {
        "puyu_main_user_name": "Celso"
    }, {
        "puyu_main_user_name": "Jordão"
    }, {
        "puyu_main_user_name": "Cipriano"
    }, {
        "puyu_main_user_name": "Fortunato"
    }, {
        "puyu_main_user_name": "Rolando"
    }, {
        "puyu_main_user_name": "Severina"
    }, {
        "puyu_main_user_name": "Gertrudes"
    }, {
        "puyu_main_user_name": "Priscila"
    }, {
        "puyu_main_user_name": "Eulália"
    }, {
        "puyu_main_user_name": "Dulce"
    }, {
        "puyu_main_user_name": "Benigna"
    }, {
        "puyu_main_user_name": "Amanda"
    }, {
        "puyu_main_user_name": "Octávia"
    }, {
        "puyu_main_user_name": "Vanda"
    }, {
        "puyu_main_user_name": "Eufêmia"
    }, {
        "puyu_main_user_name": "Gertrudes"
    }, {
        "puyu_main_user_name": "Lucinda"
    }, {
        "puyu_main_user_name": "Iolanda"
    }, {
        "puyu_main_user_name": "Salomé"
    }, {
        "puyu_main_user_name": "Lurdes"
    }, {
        "puyu_main_user_name": "Yasmin"
    }, {
        "puyu_main_user_name": "Tereza"
    }, {
        "puyu_main_user_name": "Clotilde"
    }, {
        "puyu_main_user_name": "Alberta"
    }, {
        "puyu_main_user_name": "Clotilde"
    }, {
        "puyu_main_user_name": "Anselmo"
    }, {
        "puyu_main_user_name": "Kevin"
    }, {
        "puyu_main_user_name": "Ivo"
    }, {
        "puyu_main_user_name": "Olegário"
    }, {
        "puyu_main_user_name": "Maximiliano"
    }, {
        "puyu_main_user_name": "Paulino"
    }, {
        "puyu_main_user_name": "Noah"
    }, {
        "puyu_main_user_name": "Vicente"
    }, {
        "puyu_main_user_name": "Gaspar"
    }, {
        "puyu_main_user_name": "Maurício"
    }, {
        "puyu_main_user_name": "Luna"
    }, {
        "puyu_main_user_name": "Anita"
    }, {
        "puyu_main_user_name": "Teodora"
    }, {
        "puyu_main_user_name": "Calixta"
    }, {
        "puyu_main_user_name": "Esmeralda"
    }, {
        "puyu_main_user_name": "Helena"
    }, {
        "puyu_main_user_name": "Lucília"
    }, {
        "puyu_main_user_name": "Gisela"
    }, {
        "puyu_main_user_name": "Luna"
    }, {
        "puyu_main_user_name": "Alexandrina"
    }, {
        "puyu_main_user_name": "Ernesto"
    }, {
        "puyu_main_user_name": "Saturnino"
    }, {
        "puyu_main_user_name": "Desidério"
    }, {
        "puyu_main_user_name": "Fernão"
    }, {
        "puyu_main_user_name": "Antelmo"
    }, {
        "puyu_main_user_name": "Paulinho"
    }, {
        "puyu_main_user_name": "Feliciano"
    }, {
        "puyu_main_user_name": "Ambrósio"
    }, {
        "puyu_main_user_name": "Aristides"
    }, {
        "puyu_main_user_name": "Gláucio"
    }, {
        "puyu_main_user_name": "Margarida"
    }, {
        "puyu_main_user_name": "Palmira"
    }, {
        "puyu_main_user_name": "Monica"
    }, {
        "puyu_main_user_name": "Alice"
    }, {
        "puyu_main_user_name": "Clarissa"
    }, {
        "puyu_main_user_name": "Cristina"
    }, {
        "puyu_main_user_name": "Ondina"
    }, {
        "puyu_main_user_name": "Aurora"
    }, {
        "puyu_main_user_name": "Lena"
    }, {
        "puyu_main_user_name": "Sol"
    }, {
        "puyu_main_user_name": "Tadeu"
    }, {
        "puyu_main_user_name": "Graciano"
    }, {
        "puyu_main_user_name": "Emilio"
    }, {
        "puyu_main_user_name": "Alfredo"
    }, {
        "puyu_main_user_name": "Ruy"
    }, {
        "puyu_main_user_name": "Geraldo"
    }, {
        "puyu_main_user_name": "Cezar"
    }, {
        "puyu_main_user_name": "Paulino"
    }, {
        "puyu_main_user_name": "Elias"
    }, {
        "puyu_main_user_name": "Gualberto"
    }, {
        "puyu_main_user_name": "Vitória"
    }, {
        "puyu_main_user_name": "Lívia"
    }, {
        "puyu_main_user_name": "Marciane"
    }, {
        "puyu_main_user_name": "Luna"
    }, {
        "puyu_main_user_name": "Thalita"
    }, {
        "puyu_main_user_name": "Rosalia"
    }, {
        "puyu_main_user_name": "Desidéria"
    }, {
        "puyu_main_user_name": "Maiara"
    }, {
        "puyu_main_user_name": "Lígia"
    }, {
        "puyu_main_user_name": "Érica"
    }, {
        "puyu_main_user_name": "Arden"
    }, {
        "puyu_main_user_name": "Arrow"
    }, {
        "puyu_main_user_name": "Auden"
    }, {
        "puyu_main_user_name": "Baker"
    }, {
        "puyu_main_user_name": "Bellamy"
    }, {
        "puyu_main_user_name": "Blair"
    }, {
        "puyu_main_user_name": "Bowie"
    }, {
        "puyu_main_user_name": "Briar"
    }, {
        "puyu_main_user_name": "Channing"
    }, {
        "puyu_main_user_name": "Charleston"
    }, {
        "puyu_main_user_name": "Cleo"
    }, {
        "puyu_main_user_name": "Devon"
    }, {
        "puyu_main_user_name": "Drew"
    }, {
        "puyu_main_user_name": "Egypt"
    }, {
        "puyu_main_user_name": "Ellison"
    }, {
        "puyu_main_user_name": "Ever"
    }, {
        "puyu_main_user_name": "Everest"
    }, {
        "puyu_main_user_name": "Frankie"
    }, {
        "puyu_main_user_name": "Gentry"
    }, {
        "puyu_main_user_name": "Grey"
    }, {
        "puyu_main_user_name": "Halo"
    }, {
        "puyu_main_user_name": "Holland"
    }, {
        "puyu_main_user_name": "Indigo"
    }, {
        "puyu_main_user_name": "Jules"
    }, {
        "puyu_main_user_name": "Kingsley"
    }, {
        "puyu_main_user_name": "Landry"
    }, {
        "puyu_main_user_name": "Lennox"
    }, {
        "puyu_main_user_name": "Linden"
    }, {
        "puyu_main_user_name": "Memphis"
    }, {
        "puyu_main_user_name": "Milan"
    }, {
        "puyu_main_user_name": "Miller"
    }, {
        "puyu_main_user_name": "Monroe"
    }, {
        "puyu_main_user_name": "Navy"
    }, {
        "puyu_main_user_name": "Oakley"
    }, {
        "puyu_main_user_name": "Ocean"
    }, {
        "puyu_main_user_name": "Quincy"
    }, {
        "puyu_main_user_name": "Raleigh"
    }, {
        "puyu_main_user_name": "Rebel"
    }, {
        "puyu_main_user_name": "Remy"
    }, {
        "puyu_main_user_name": "Rio"
    }, {
        "puyu_main_user_name": "Ripley"
    }, {
        "puyu_main_user_name": "Sailor"
    }, {
        "puyu_main_user_name": "Scout"
    }, {
        "puyu_main_user_name": "Shay"
    }, {
        "puyu_main_user_name": "Shiloh"
    }, {
        "puyu_main_user_name": "Sutton"
    }, {
        "puyu_main_user_name": "Tobin"
    }, {
        "puyu_main_user_name": "Wilder"
    }, {
        "puyu_main_user_name": "Wren"
    }, {
        "puyu_main_user_name": "Zephyr"
    }, {
        "puyu_main_user_name": "Adlai"
    }, {
        "puyu_main_user_name": "Amory"
    }, {
        "puyu_main_user_name": "Austen"
    }, {
        "puyu_main_user_name": "Avis"
    }, {
        "puyu_main_user_name": "Bergen"
    }, {
        "puyu_main_user_name": "Blue"
    }, {
        "puyu_main_user_name": "Breslin"
    }, {
        "puyu_main_user_name": "Brighton"
    }, {
        "puyu_main_user_name": "Callaway"
    }, {
        "puyu_main_user_name": "Campbell"
    }, {
        "puyu_main_user_name": "Carmel"
    }, {
        "puyu_main_user_name": "Clancy"
    }, {
        "puyu_main_user_name": "Clarke"
    }, {
        "puyu_main_user_name": "Denver"
    }, {
        "puyu_main_user_name": "Gentry"
    }, {
        "puyu_main_user_name": "Hollis"
    }, {
        "puyu_main_user_name": "Honor"
    }, {
        "puyu_main_user_name": "Indiana"
    }, {
        "puyu_main_user_name": "Jazz"
    }, {
        "puyu_main_user_name": "Jules"
    }, {
        "puyu_main_user_name": "Kirby"
    }, {
        "puyu_main_user_name": "Lake"
    }, {
        "puyu_main_user_name": "Laramie"
    }, {
        "puyu_main_user_name": "Marlo"
    }, {
        "puyu_main_user_name": "Mercury"
    }, {
        "puyu_main_user_name": "Merit"
    }, {
        "puyu_main_user_name": "Murphy"
    }, {
        "puyu_main_user_name": "Nicky"
    }, {
        "puyu_main_user_name": "Ocean"
    }, {
        "puyu_main_user_name": "Oswin"
    }, {
        "puyu_main_user_name": "Peace"
    }, {
        "puyu_main_user_name": "Perry"
    }, {
        "puyu_main_user_name": "Poet"
    }, {
        "puyu_main_user_name": "Ramsey"
    }, {
        "puyu_main_user_name": "Reilly"
    }, {
        "puyu_main_user_name": "Revel"
    }, {
        "puyu_main_user_name": "Ridley"
    }, {
        "puyu_main_user_name": "Robin"
    }, {
        "puyu_main_user_name": "Rumi"
    }, {
        "puyu_main_user_name": "Seneca"
    }, {
        "puyu_main_user_name": "Sidney"
    }, {
        "puyu_main_user_name": "Storm"
    }, {
        "puyu_main_user_name": "Tennessee"
    }, {
        "puyu_main_user_name": "Tennyson"
    }, {
        "puyu_main_user_name": "Texas"
    }, {
        "puyu_main_user_name": "Timber"
    }, {
        "puyu_main_user_name": "Tory"
    }, {
        "puyu_main_user_name": "Valentine"
    }, {
        "puyu_main_user_name": "Wisdom"
    }, {
        "puyu_main_user_name": "Wynn"
    }]

    // 主要人物姓名
    const main_characters = {
        books: [
            {
                '混沌天体': [
                    // { 'main_user_name': '慕容', 'en_main_user_name': 'Murong', 'puyu_main_user_name': 'Murong' },
                    { 'main_user_name': '赵芷晴', 'en_main_user_name': 'Nicole Keith', 'puyu_main_user_name': 'Nicole Keith' },
                    { 'main_user_name': '尤梦青', 'en_main_user_name': 'Gill George', 'puyu_main_user_name': 'Gill George' },
                    { 'main_user_name': '蓝可儿', 'en_main_user_name': 'Antonia Gary', 'puyu_main_user_name': 'Antonia Gary' },
                    { 'main_user_name': '穆丽月', 'en_main_user_name': 'Elsa David', 'puyu_main_user_name': 'Elsa David' },
                    { 'main_user_name': '司徒萱', 'en_main_user_name': 'Martina Christian', 'puyu_main_user_name': 'Martina Christian' },
                    { 'main_user_name': '慕容羽', 'en_main_user_name': 'Murong Feather', 'puyu_main_user_name': 'Murong Pena' },
                ]
            }
        ]
    };

    // 同姓名字自由分配

    // 非主要人物姓名
    const no_main_characters = {
        books: [
            {
                '混沌天体': []
            }
        ]
    };


    // #书籍唯一标识
    // #书名
    // #书籍简介
    // #书籍封面图片链接
    // #书籍总字数
    // #书籍卷宗数
    // #书籍章节数
    // #书籍标签

    let a1 = [{
        "book_id": 1,
        "book_title": '混沌天体',
        "book_intro": '书籍简介',
        "cover_url": '书籍封面图片链接',
        "word_count": '101001',
        "volume_count": '??',
        "chapter_count": 1024,
        "plotlabel": '玄幻',
    }]


    // const Xlsx_data = dlXlsx_improt('./sqldb/混沌天体.xlsx');

    // const filter_xlsx_data = _.filter(Xlsx_data, function (item) {
    //     return item.name.length <= 4 && item.ne === 'PER'
    // });

    // // 找出同姓的分类  先取开始一个字
    // const first_name = [];
    // const shoudong = [];
    // console.log(main_characters.books[0]['混沌天体']);
    // const main_characters_1 = main_characters.books[0]['混沌天体'];
    // _.map(filter_xlsx_data, function (item) {
    //     _.map(main_characters_1, function (value) {
    //         if (item.name === value.main_user_name) {
    //             shoudong.push({ name: item.name, puyu_main_user_name: value.puyu_main_user_name });
    //         } else {

    //             first_name.push(item.name.substr(0, 1));

    //         }
    //     });

    // });
    // // es6 去重
    // const ee6_set = Array.from(new Set(first_name))
    // // 姓氏分组
    // const first_group = [];
    // for (let i = 0; i < filter_xlsx_data.length; i++) {
    //     for (let j = 0; j < ee6_set.length; j++) {
    //         if (filter_xlsx_data[i].name.substr(0, 1) === ee6_set[j]) {

    //             if (filter_xlsx_data[i].name.indexOf('慕容') === -1 &&
    //                 filter_xlsx_data[i].name.indexOf('芷晴') === -1 &&
    //                 filter_xlsx_data[i].name.indexOf('蓝可儿') === -1 &&
    //                 filter_xlsx_data[i].name.indexOf('丽月') === -1 &&
    //                 filter_xlsx_data[i].name.indexOf('司徒') === -1
    //             ) {
    //                 first_group.push({ 'name': filter_xlsx_data[i].name });
    //             }

    //         }
    //     }
    // }

    // // console.log(shoudong);
    // // console.log(luren.length);
    // // console.log(first_group);

    // const retLuren = [];
    // for (let index = 0; index < luren.length; index++) {
    //     const element = luren[index];
    //     const element1 = first_group[index];
    //     retLuren.push({ name: element1.name, puyu_main_user_name: element.puyu_main_user_name });
    // }

    // var name_concat = _.concat(shoudong, retLuren);

    // 翻译
    function RemoveArr(result) {
        if (result.length > 0) {
            for (var x = 0; x < result.length; x++) {
                for (var y = x + 1; y < result.length;) {
                    if (result[x].dst === result[y].dst) {
                        result.splice(y, 1)
                    } else {
                        y++
                    }
                }
            }
            return result
        }

    }

    fs.readFile('./sqldb/末世全系魔法师-柠檬雪糕.txt', function (err, data) {
        // 读取文件失败/错误
        if (err) {
            throw err;
        }
        // 读取文件成功
        let ret = data.toString();
        // let s = ret.split('------------');
        function d(num) {
            console.log('num:' + num);
            let a = ret;

            // for (let x = 0; x < name_concat.length; x++) {
            //     const element = name_concat[x];
            //     if (a.indexOf(element.name) !== -1) {
            //         a = replaceall(element.name, element.puyu_main_user_name, a);
            //     }
            // }



            // 章节组成数据库 -- start





            let Remainder = parseInt(a.length / 500, 10);
            let i = 0;
            function f() {

                console.log('-------------------' + Remainder + '--------------------------');
                console.log('i:' + i);
                let char_name = a.substring(i * 500, (i * 500) + 500);

                let random = Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, 10 - 1));
                let sign = md5('20191129000361606' + char_name + '' + random + 'wsGzEeINGV89z04AGZNQ');
                let url = 'http://api.fanyi.baidu.com/api/trans/vip/translate?q=' + char_name + '&from=zh&to=pt&appid=20191129000361606&salt=' + random + '&sign=' + sign + '';
                let retxls = [];
                request(encodeURI(url), function (error, response, body) {

                    if (!error && response.statusCode == 200) {
                        body = JSON.parse(body);
                        let array = RemoveArr(body.trans_result);
                        console.log(array);
                        for (let index = 0; index < array.length; index++) {
                            const element = array[index];
                            // {
                            //     "book_id": int, #书籍唯一标识
                            //     "content_id": int, #书籍内容标识
                            //     "volume_id": int,  #卷宗唯一标识
                            //     "volume_order": int, ##卷宗排序号
                            //     "volume_title": string, ##卷宗名称
                            //     "title": string, ##章节名
                            //     "word_count": int, #章节总字数
                            //     "order": int, ##章节排序号
                            //     "content": string, ## 章节内书籍内容
                            // }

                            // retxls.push({
                            //     book_id: 1,
                            //     content_id:1,
                            //     volume_id:index,
                            //     volume_order:index,
                            //     volume_order:index,
                            //     volume_order:index,
                            // });


                            fs.appendFile('./sqldb/末世全系魔法师-柠檬雪糕_pt.txt', element.dst + '\n', 'utf8', function (err, ret) {
                                if (err) {

                                    throw err

                                }

                                // console.log('success')

                            })
                        }


                    } else {
                        console.log('22');
                        console.log(error);
                    }
                })
                i++;
                if (i <= 400) {
                    console.log('i的值:' + i);
                    setTimeout(f, 2000);
                } else {
                    setTimeout(arguments.callee, 1000);
                    // num++;
                    // if (num === Remainder) {
                    //     setTimeout(arguments.callee, 1000);
                    // } else {
                    //     d(num)
                    // }

                }
            }

            f();
        }

        d(0);

    })

    // -----------------------------------
    // fs.readFile('./sqldb/我的极品美女总裁-平庸的上帝_pt.txt', function (err, data) {
    //     // 读取文件失败/错误
    //     if (err) {
    //         throw err;
    //     }
    //     // 读取文件成功
    //     let ARR = [];
    //     let ret = data.toString();
    //     let array = ret.split(/(Capítulo)\s[0-9]+/g);
    //     console.log(array);
    //     let i = 0;
    //     for (let index = 1; index < array.length; index += 1) {

    //         const element = array[index];
    //         //console.log(element);
    //         // if (element.length > 200) {
    //         //     i++;
    //         //     ARR.push({
    //         //         "book_id": 5,
    //         //         "content_id": 1,
    //         //         "volume_id": 1,
    //         //         "volume_order": 1,
    //         //         "volume_title": '',
    //         //         "title": 'Capítulo ' + (i),
    //         //         "word_count": element.length,
    //         //         "order": (i),
    //         //         "content": element,
    //         //     });
    //         // }
    //     }


    //     // for (let i = 0; i < ARR.length; i++) {
    //     //     const element = ARR[i];
    //     //     const regex = /(Capítulo)\s\s[0-9]+|(Capítulo)\s\s\w+/g;
    //     //     const str = element.content;
    //     //     const subst = `    `;
    //     //     element.content = str.replace(regex, subst);
    //     // }

    //     // dlXlsx(ARR);
    //     // console.log(ARR);
    // })
    //----------------------------------------------------



    // 路人姓氏
    // const luren = [];
    // fs.readFile('./sqldb/姓氏.txt', function (err, data) {
    //     // 读取文件失败/错误
    //     if (err) {
    //         throw err;
    //     }
    //     // 读取文件成功
    //     let ret = data.toString();
    //     let array = ret.split(/[\r\n]/);
    //     // console.log(array.length);
    //     for (let i = 0; i < array.length; i++) {
    //         const element = array[i].split(' ');
    //         //console.log(element);
    //         luren.push({ puyu_main_user_name: element[0] });
    //     }

    //     fs.readFile('./sqldb/中性名字.txt', function (err, data) {
    //         // 读取文件失败/错误
    //         if (err) {
    //             throw err;
    //         }
    //         // 读取文件成功
    //         let ret1 = data.toString();
    //         let array1 = ret1.split(/[\r\n]/);
    //         // console.log(array.length);
    //         for (let j = 0; j < array1.length; j++) {
    //             const element1 = array1[j];
    //             luren.push({ puyu_main_user_name: element1 });
    //         }

    //         console.log(JSON.stringify(Array.from(new Set(luren))));

    //     })



    // })





    res.status(200).send({ data: 'a', status: 200 });

    // Pre-processing -- end


    //  章节组成数据库 -- start
    // let arr = [];
    // // 获取token
    // let url = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
    // request({
    //     url: url,
    //     method: "POST",
    //     json: true,
    //     headers: {
    //         "content-type": "application/json",
    //     },
    //     body: {
    //         q: '天清气朗，万里无云，好一个晴天。',
    //         from: 'zh',
    //         to: 'en',
    //         appid: '20191109000355055',
    //         salt: '8989',
    //         sign,
    //     }
    // }, function (error, response, body) {

    //     if (!error && response.statusCode == 200) {

    //         body = JSON.parse(body);
    //         console.log(body);
    //         if (body.access_token) { }
    //     }
    // })


    //  章节组成数据库-- end


    // 心情自动脚本 -- start

    // let textArr = [];
    // let nvi_en_pb = [{
    //     _id: 1,
    //     name_en: 'Genesis',
    //     name_pb: 'Gênesis ',
    //     name: 'Gênesis'
    // },
    // { _id: 2, name_en: 'Exodus', name_pb: 'Êxodo', name: 'Êxodo' },
    // {
    //     _id: 3,
    //     name_en: 'Leviticus',
    //     name_pb: 'Levítico',
    //     name: 'Levítico'
    // },
    // {
    //     _id: 4,
    //     name_en: 'Numbers',
    //     name_pb: 'Números ',
    //     name: 'Números'
    // },
    // {
    //     _id: 5,
    //     name_en: 'Deuteronomy',
    //     name_pb: 'Deuteronômio ',
    //     name: 'Deuteronômio'
    // },
    // { _id: 6, name_en: 'Joshoa', name_pb: 'Josué', name: 'Josué' },
    // { _id: 7, name_en: 'Judges', name_pb: 'Juízes', name: 'Juízes' },
    // { _id: 8, name_en: 'Ruth', name_pb: 'Rute', name: 'Rute' },
    // {
    //     _id: 9,
    //     name_en: '1 Samuel',
    //     name_pb: '1 Samuel ',
    //     name: '1 Samuel'
    // },
    // {
    //     _id: 10,
    //     name_en: '2 Samuel',
    //     name_pb: '2 Samuel ',
    //     name: '2 Samuel'
    // },
    // {
    //     _id: 11,
    //     name_en: '1 Kings',
    //     name_pb: '1 Reis ',
    //     name: '1 Reis'
    // },
    // {
    //     _id: 12,
    //     name_en: '2 Kings',
    //     name_pb: '2 Reis ',
    //     name: '2 Reis'
    // },
    // {
    //     _id: 13,
    //     name_en: '1 Chronicles',
    //     name_pb: '1 Crônicas ',
    //     name: '1 Crônicas'
    // },
    // {
    //     _id: 14,
    //     name_en: '2 Chronicles',
    //     name_pb: '2 Crônicas ',
    //     name: '2 Crônicas'
    // },
    // { _id: 15, name_en: 'Ezra', name_pb: 'Esdras', name: 'Esdras' },
    // {
    //     _id: 16,
    //     name_en: 'Nehemiah',
    //     name_pb: 'Neemias ',
    //     name: 'Neemias'
    // },
    // { _id: 17, name_en: 'Esther', name_pb: 'Ester', name: 'Ester' },
    // { _id: 18, name_en: 'Job', name_pb: 'Jó', name: 'Jó' },
    // { _id: 19, name_en: 'Psalms', name_pb: 'Salmos ', name: 'Salmos' },
    // {
    //     _id: 20,
    //     name_en: 'Proverbs',
    //     name_pb: 'Provérbios',
    //     name: 'Provérbios'
    // },
    // {
    //     _id: 21,
    //     name_en: 'Ecclesiastes',
    //     name_pb: 'Eclesiastes',
    //     name: 'Eclesiastes'
    // },
    // {
    //     _id: 22,
    //     name_en: 'Song of solomon',
    //     name_pb: 'Cântico dos Cânticos',
    //     name: 'Cântico dos Cânticos'
    // },
    // { _id: 23, name_en: 'Isaiah', name_pb: 'Isaías ', name: 'Isaías' },
    // {
    //     _id: 24,
    //     name_en: 'Jeremiah',
    //     name_pb: 'Jeremias',
    //     name: 'Jeremias'
    // },
    // {
    //     _id: 25,
    //     name_en: 'Lamentations',
    //     name_pb: 'Lamentações ',
    //     name: 'Lamentações'
    // },
    // {
    //     _id: 26,
    //     name_en: 'Ezekiel',
    //     name_pb: 'Ezequiel ',
    //     name: 'Ezequiel'
    // },
    // { _id: 27, name_en: 'Daniel', name_pb: 'Daniel', name: 'Daniel' },
    // { _id: 28, name_en: 'Hosea', name_pb: 'Oseias ', name: 'Oseias' },
    // { _id: 29, name_en: 'Joel', name_pb: 'Joel', name: 'Joel' },
    // { _id: 30, name_en: 'Amos', name_pb: 'Amós', name: 'Amós' },
    // {
    //     _id: 31,
    //     name_en: 'Obadiah',
    //     name_pb: 'Obadias ',
    //     name: 'Obadias'
    // },
    // { _id: 32, name_en: 'Jonah', name_pb: 'Jonas ', name: 'Jonas' },
    // {
    //     _id: 33,
    //     name_en: 'Micah',
    //     name_pb: 'Miqueias ',
    //     name: 'Miqueias'
    // },
    // { _id: 34, name_en: 'Nahum', name_pb: 'Naum', name: 'Naum' },
    // {
    //     _id: 35,
    //     name_en: 'Habakkuk',
    //     name_pb: 'Habacuque',
    //     name: 'Habacuque'
    // },
    // {
    //     _id: 36,
    //     name_en: 'Zephaniah',
    //     name_pb: 'Sofonias',
    //     name: 'Sofonias'
    // },
    // { _id: 37, name_en: 'Haggai', name_pb: 'Ageu', name: 'Ageu' },
    // {
    //     _id: 38,
    //     name_en: 'Zechariah',
    //     name_pb: 'Zacarias ',
    //     name: 'Zacarias'
    // },
    // {
    //     _id: 39,
    //     name_en: 'Malachi',
    //     name_pb: 'Malaquias',
    //     name: 'Malaquias'
    // },
    // { _id: 40, name_en: 'Matthew', name_pb: 'Mateus', name: 'Mateus' },
    // { _id: 41, name_en: 'Mark', name_pb: 'Marcos ', name: 'Marcos' },
    // { _id: 42, name_en: 'Luke', name_pb: 'Lucas', name: 'Lucas' },
    // { _id: 43, name_en: 'John', name_pb: 'João', name: 'João' },
    // { _id: 44, name_en: 'Acts', name_pb: 'Atos', name: 'Atos' },
    // {
    //     _id: 45,
    //     name_en: 'Romans',
    //     name_pb: 'Romanos',
    //     name: 'Romanos'
    // },
    // {
    //     _id: 46,
    //     name_en: '1 Corinthians',
    //     name_pb: '1 Coríntios ',
    //     name: '1 Coríntios'
    // },
    // {
    //     _id: 47,
    //     name_en: '2 Corinthians',
    //     name_pb: '2 Coríntios ',
    //     name: '2 Coríntios'
    // },
    // {
    //     _id: 48,
    //     name_en: 'Galatians',
    //     name_pb: 'Gálatas',
    //     name: 'Gálatas'
    // },
    // {
    //     _id: 49,
    //     name_en: 'Ephesians',
    //     name_pb: 'Efésios',
    //     name: 'Efésios'
    // },
    // {
    //     _id: 50,
    //     name_en: 'Philippians',
    //     name_pb: 'Filipenses',
    //     name: 'Filipenses'
    // },
    // {
    //     _id: 51,
    //     name_en: 'Colossians',
    //     name_pb: 'Colossenses',
    //     name: 'Colossenses'
    // },
    // {
    //     _id: 52,
    //     name_en: '1 Thessalonians',
    //     name_pb: '1 Tessalonicenses ',
    //     name: '1 Tessalonicenses'
    // },
    // {
    //     _id: 53,
    //     name_en: '2 Thessalonians',
    //     name_pb: '2 Tessalonicenses ',
    //     name: '2 Tessalonicenses'
    // },
    // {
    //     _id: 54,
    //     name_en: '1 Timothy',
    //     name_pb: '1 Timóteo ',
    //     name: '1 Timóteo'
    // },
    // {
    //     _id: 55,
    //     name_en: '2 Timothy',
    //     name_pb: '2 Timóteo ',
    //     name: '2 Timóteo'
    // },
    // { _id: 56, name_en: 'Titus', name_pb: 'Tito ', name: 'Tito' },
    // {
    //     _id: 57,
    //     name_en: 'Philemon',
    //     name_pb: 'Filemom ',
    //     name: 'Filemom'
    // },
    // {
    //     _id: 58,
    //     name_en: 'Hebrews',
    //     name_pb: 'Hebreus ',
    //     name: 'Hebreus'
    // },
    // { _id: 59, name_en: 'James', name_pb: 'Tiago ', name: 'Tiago' },
    // {
    //     _id: 60,
    //     name_en: '1 Peter',
    //     name_pb: '1 Pedro ',
    //     name: '1 Pedro'
    // },
    // {
    //     _id: 61,
    //     name_en: '2 Peter',
    //     name_pb: '2 Pedro ',
    //     name: '2 Pedro'
    // },
    // { _id: 62, name_en: '1 John', name_pb: '1 João', name: '1 João' },
    // { _id: 63, name_en: '2 John', name_pb: '2 João', name: '2 João' },
    // { _id: 64, name_en: '3 John', name_pb: '3 João', name: '3 João' },
    // { _id: 65, name_en: 'Jude', name_pb: 'Judas ', name: 'Judas' },
    // {
    //     _id: 66,
    //     name_en: 'Revelation',
    //     name_pb: 'Apocalipse',
    //     name: 'Apocalipse'
    // }]
    // fs.readFile('./sqldb/mood/peace.txt', function (err, data) {
    //     // 读取文件失败/错误
    //     if (err) {
    //         throw err;
    //     }
    //     // 读取文件成功
    //     let ret = data.toString();
    //     let array = ret.split(/[\r\n]/);

    //     for (let index = 0; index < array.length; index++) {
    //         if (!array[index]) {
    //             array.splice(index, 1)
    //         }
    //         // else {
    //         //     textArr.push({ s_name: array.split(' ') });
    //         // }
    //     }

    //     const arrRet = [];
    //     for (let x = 0; x < array.length; x++) {
    //         const element = array[x];
    //         const s = element.split(' ');

    //         if (s.length === 4) {
    //             const maohao = s[3].split(':');
    //             console.log(maohao);
    //             const henggang = maohao[1].split('-');
    //             arrRet.push({
    //                 ori_name_en: '' + s[0] + ' ' + s[1] + ' ' + s[2] + '', space: maohao[0], from: henggang[0], to: henggang[1] ? henggang[1] : ''
    //             });
    //         }

    //         if (s.length === 3) {
    //             const maohao = s[2].split(':');
    //             console.log(maohao);
    //             const henggang = maohao[1].split('-');
    //             arrRet.push({
    //                 ori_name_en: '' + s[0] + ' ' + s[1] + '', space: maohao[0], from: henggang[0], to: henggang[1] ? henggang[1] : ''
    //             });
    //         }

    //         if (s.length === 2) {
    //             const maohao = s[1].split(':');
    //             const henggang = maohao[1].split('-');
    //             arrRet.push({ ori_name_en: s[0], space: maohao[0], from: henggang[0], to: henggang[1] ? henggang[1] : '' });

    //         }
    //     }
    //     console.log(arrRet);

    //     const a = [];
    //     for (let k = 0; k < nvi_en_pb.length; k++) {
    //         for (let y = 0; y < arrRet.length; y++) {
    //             if (nvi_en_pb[k].name_en.indexOf(arrRet[y].ori_name_en) !== -1) {
    //                 a.push({ name: nvi_en_pb[k].name, mode_type_id: 6, chapter: nvi_en_pb[k]._id, space: arrRet[y].space, from: arrRet[y].from, to: arrRet[y].to });
    //             }

    //         }
    //     }

    //     dlXlsx(a);
    // 心情自动脚本 -- end


    // 心情前期处理 -- start
    // for (let j = 0; j < array.length; j++) {
    //     const element = array[j];
    //     nvi_en_pb[j]['name_pb'] = element;
    // }


    // db.all("select * from BOOK_CHAPTER", function (err, ret) {
    //     if (!err) {
    //         for (let i = 0; i < nvi_en_pb.length; i++) {
    //             if (nvi_en_pb[i].name_pb.indexOf(ret[i].CHAPTER) !== -1) {
    //                 nvi_en_pb[i]['name'] = ret[i].CHAPTER;
    //             }

    //         }

    //         console.log(nvi_en_pb);

    //     } else {
    //         console.log(err);
    //     }
    // });

    // 心情前期处理 -- end


    // 语音处理 -- start

    // for (let index = 0; index < array.length; index++) {
    //     const element = array[index];
    //     // if (element.indexOf('-->') !== -1) {
    //     //     // console.log(element, index);
    //     //     array.splice(index, 1);
    //     // }

    //     if (element.match(/[a-z]/i)) {

    //         textArr.push(element);

    //     }
    // }

    // console.log(textArr);
    // RemoveArr(textArr)
    // function RemoveArr(result) {
    //     for (var x = 0; x < result.length; x++) {
    //         for (var y = x + 1; y < result.length;) {
    //             if (result[x] === result[y]) {
    //                 result.splice(y, 1)
    //             } else {
    //                 y++
    //             }
    //         }
    //     }
    //     return result
    // }

    // for (let i = 0; i < textArr.length; i++) {
    //     console.log('00000000' + (i + 1) + '    ' + textArr[i]);
    // }

    // 语音处理 -- end


    //})

    //res.status(200).send({ data: 1, status: 200 });

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
