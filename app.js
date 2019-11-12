var express = require("express");
var app = express();
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./sqldb/Bible-NVI.db');
// const gloabUrl = 'http://localhost:8083/';
app.use(express.static('views'));

var path = __dirname + '/views/';
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/api/thing', require('./api/thing'));

console.log(path);
router.get('/', function (req, res) {
    res.sendFile(path + "index.html");
});

router.get("/livros/:name", function (req, res) {
    res.sendFile(path + "livros.html");

});

app.use("/", router);

app.use("/:url(api|views)/*", function (req, res) {
    res.sendFile(path + "404.html");
});

app.listen(8083, function () {
    console.log('Example app listening on port 8083!')
});
