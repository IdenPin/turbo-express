var express = require('express');
var router = express.Router();
var http = require('http');
//var fetch = require('node-fetch');
//fetch.Promise = require('bluebird')
/* GET home page. */
router.get('/', function (req, res, next) {
    // var options = {
    //     method: "get",
    //     host : 'http://s1.service.zhigaokao.cn',
    //     port : '',
    //     path : '/schedule/getScheduleInfo.do',
    //     headers: {
    //         'Content-Type':'application/x-www-form-urlencoded'
    //     }
    // };
    // var req = http.request(options, function(){
    // });
    // req.write(data);
    // req.end();
    //console.info(fetch.default);
    //fetch("mock/index.json").then(function (res) {
    //    console.log('res',res);
    //    if (res.ok) {
    //        res.json().then(function (data) {
    //            console.log(data);
    //        });
    //    } else {
    //        console.log("Looks like the response wasn't perfect, got status", res.status);
    //    }
    //}, function (e) {
    //    console.log("Fetch failed!", e);
    //});





    res.render('index', {
        "css": 'index.css',
        "bizData": [
            {
                "month": "5",
                "schedules": [
                    {
                        "id": 9,
                        "month": "5",
                        "title": "招生咨询会、北京上海填报高考志愿",
                        "years": "2016"
                    }
                ],
                "years": "2016"
            },
            {
                "month": "6",
                "schedules": [
                    {
                        "id": 10,
                        "month": "6",
                        "title": "高考、高考查分、各地填报志愿",
                        "years": "2016"
                    }
                ],
                "years": "2016"
            },
            {
                "month": "7",
                "schedules": [
                    {
                        "id": 11,
                        "month": "7",
                        "title": "各地高招录取启动、高职志愿填报",
                        "years": "2016"
                    }
                ],
                "years": "2016"
            }
        ],
        "rows": [
            {
                "hotDate": "2016-05-25",
                "id": 48,
                "image": "http://gk360b.ks3-cn-center-1.ksyun.com/20160530160218.HYU9k4hgSa.jpg",
                "subContent": "日前，从承德市教育局获悉，承德市2016年普通高校招生考试工作正有序进行，报名人数达22340人，较去年减少212 人，高考作弊今年首次入刑。\n\n承德市把维护高考公平公正作为最重要的一项任务来抓，采取",
                "title": "河北2016年高考承德市22340人报名参加"
            },
            {
                "hotDate": "2016-05-20",
                "id": 47,
                "image": "http://gk360b.ks3-cn-center-1.ksyun.com/20160530155933.hpyaKgl0DF.jpg",
                "subContent": "针对高三家长关于河北省高考录取率的担忧，记者从河北省教育厅官网获悉，5月19日上午，河北省教育厅厅长刘教民就2016年普通高校招生向社会承诺：今年招生能够做到“四个不低于”，即：普通高校本专科招生计划",
                "title": "河北省教育厅厅长刘教民就高校招生向社会承诺"
            },
            {
                "hotDate": "2016-05-09",
                "id": 38,
                "image": "http://gk360b.ks3-cn-center-1.ksyun.com/20160510121240.YdbQ83riA7.jpg",
                "subContent": "2016年高考临近，考生和家长进入紧张迎考阶段，考生大脑超负荷运转，最需要补充哪些营养呢？石家庄市疾控中心学校卫生所专家提醒，考生应注意饮食营养搭配，保证大脑血糖供应，蛋白质摄入量要充足，考前乱服所谓",
                "title": "河北省高考生要注意血糖供应 乱服保健补品无益"
            },
            {
                "hotDate": "2016-05-03",
                "id": 39,
                "image": "http://gk360b.ks3-cn-center-1.ksyun.com/20160510120912.Jqi8J29Rh1.jpg",
                "subContent": "河北省出台《关于普遍建立学校法律顾问制度的意见》，计划到今年年底，全省各级各类学校普遍建立法律顾问制度，每所学校均聘请有从业资格的律师为依法治教出谋划策、提供服务，并协助学校开展法治培训和法律宣传教育",
                "title": "河北：各级各类学校将普遍建立法律顾问制度"
            }
        ]
    });
});


module.exports = router;
