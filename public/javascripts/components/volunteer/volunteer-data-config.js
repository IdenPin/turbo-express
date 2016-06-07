/*
 * pdeng
 * 28个省份智能填报模块数据配置 [智能填报公共基础数据配置文件]
 * 智能填报三批本科填报暂时不展示
 * 参数说明:
 *      schoolN(院校数)
 *      professN(专业数)
 *      professSwap(专业调配)
 *      threshold(阀值-院校优先-院校优先)1:文 2:理
 *      schoolArr(院校个数)
 *      cate(文理)
 *      resultUrl(重定向跳转模板url)
 *      constantWord(abcd志愿字典常量)
 *      subProfessData[subData_1,2,4,3](第一批次,二批,三批,高职)
 *      "batch": ["1-1","1-2", "2", "3"]  说明:该院校有3个志愿,分别是第一志愿A,第一志愿B,第二志愿,第三志愿
 *      "constantWord":截取所用'第(ABCDE)志愿'
 * 域名前缀字典:
 *      zj浙江sn陕西 fj福建 gd广东 hb湖北 hn湖南 gx广西 ha河南 sd山东 he河北 sc四川
 *      sh上海 cq重庆 jx江西 yn云南 bj北京 tj天津 hi海南 ah安徽 js江苏 jl吉林 ln辽宁
 *      gs甘肃 sx山西 gz贵州 nx宁夏 xj新疆 hl黑龙
 * */
var targetResultUrl = ["/predict-result-tpl0.html", "/predict-result-tpl1.html", "/predict-result-tpl2.html", "/predict-result-tpl3.html", "/predict-result-tpl4.html"],
    targetSelectSchoolUrl = ['/predict-selSchool-tpl0.html', '/predict-selSchool-tpl1.html', '/predict-selSchool-tpl2.html', '/predict-selSchool-tpl3.html', '/predict-selSchool-tpl4.html'],
    util = require('commonjs'),
    volunteerSchoolProfessConf = {
        constantWord: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "gx": {
            "name": '广西',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[0],
            "threshold": {
                gx_1: [100, 8000],
                gx_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                //subData_4: {
                //    "schoolN": 6,
                //    "professN": 6,
                //    "tipIcon": '冲稳保保垫垫'
                //},
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
            "batch": ["1", "2", '3'] //批次配置
            //数据没提供广西的三批
            //数据没提供广西的三批
            //数据没提供广西的三批
            //数据没提供广西的三批
        },
        "he": {
            "name": '河北',
            "schoolN": 5,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "batchNameTag": ['', '一批', '二批', '高职高专'],
            "threshold": {
                he_1: [50, 2200],
                he_2: [40, 6100]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 10,
                    "professN": 6,
                    "tipIcon": '冲冲冲保保保稳稳垫垫'
                },
                subData_3: {
                    "schoolN": 10,
                    "professN": 6,
                    "tipIcon": '冲冲冲保保保稳稳垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
            "batch": ["1", "2", "3"] //批次配置
        },
        "ha": { //特殊
            "name": '河南',
            "schoolN": 6,
            "professN": 5,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                ha_1: [30, 2000],
                ha_2: [80, 10000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 5,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 5,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_4: {
                    "schoolN": 6,
                    "professN": 5,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 5,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"] //批次配置
        },
        "hn": {
            "name": '湖南',
            "schoolN": 5,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                hn_1: [70, 2300],
                hn_2: [150, 8100]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_4: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_3: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "3"] //批次配置
        },
        "hb": {
            "name": '湖北',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                hb_1: [100, 2200],
                hb_2: [150, 9650]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_4: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"] //批次配置

        },
        "sd": {
            "name": '山东',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 6,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                sd_1: [100, 8000],
                sd_2: [200, 9150]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
            "batch": ["1", "2", "3"] //批次配置
        },
        "sn": {
            "name": '陕西',
            "schoolN": 4,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                sn_1: [80, 2000],
                sn_2: [110, 5500]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保',
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保',
                },
                subData_4: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保',
                },
                subData_3: {
                    "schoolN": 8,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"] //批次配置
        },
        "gz": {
            "name": '贵州',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                gz_1: [100, 8000],
                gz_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
            "batch": ["1", "2", "3"] //批次配置
        },
        "js": {
            "name": '江苏',
            "schoolN": 5,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                js_1: [100, 8000],
                js_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_4: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_3: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"] //批次配置
        },
        "fj": {
            "name": '福建',
            "schoolN": 6,
            "professN": 6,

            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                fj_1: [100, 8000],
                fj_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 10,
                    "professN": 6,
                    "tipIcon": '冲冲冲保保保稳稳垫垫'
                },
                subData_3: {
                    "schoolN": 40,
                    "professN": 1,
                    "tipIcon": '冲冲冲冲冲冲冲冲冲冲冲冲冲保保保保保保保保保保保保保保稳稳稳稳稳稳稳稳稳垫垫垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
            "batch": ["1", "2", "3"] //批次配置
        },
        "gd": {
            "name": '广东',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "targetUrlCode": ["3", "1", "3", "3"],
            "resultUrl": targetResultUrl[3],
            "batch": ["1", "2", "3-1", "3-2"],
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专A', '高职高专B'],
            "threshold": {
                gd_1: [90, 5150],
                gd_2: [300, 14100]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 11,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫冲稳保垫'
                },
                subData_2: {
                    "schoolN": 11,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫冲稳保垫'
                },
                subData_3: {
                    "schoolN": 3,
                    "professN": 6,
                    "tipIcon": '冲保垫'
                }
            }
        },
        "jx": {
            "name": '江西',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                jx_1: [50, 2300],
                jx_2: [150, 5000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 5,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 5,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_4: {
                    "schoolN": 5,
                    "professN": 5,
                    "tipIcon": '保冲稳保垫'
                },
                subData_3: {
                    "schoolN": 5,
                    "professN": 5,
                    "tipIcon": '保冲稳保垫'
                }
                //    高职:第一志愿1,6|第二志愿5,6
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "sc": {
            "name": '四川',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                sc_1: [100, 2900],
                sc_2: [90, 8700]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    _1: {
                        "schoolN": 6,
                        "professN": 6
                    },
                    _2: {
                        "schoolN": 6,
                        "professN": 6
                    },
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专A', '高职高专B'],
            "batch": ["1", "2", "3-1", "3-2"]
        },
        "cq": {
            "name": '重庆',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                cq_1: [60, 2200],
                cq_2: [120, 8300]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batch": ["1", "2", "3"],
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
        },
        "ah": {
            "name": '安徽',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                ah_1: [100, 8000],
                ah_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'

                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'

                },
                subData_4: {
                    "schoolN": 4,
                    "professN": 4,
                    "tipIcon": '冲稳保垫'

                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 4,
                    "tipIcon": '冲稳保保垫垫'

                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "yn": {
            "name": '云南',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                yn_1: [50, 1250],
                yn_2: [90, 5100]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_4: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_3: {
                    "schoolN": 7,
                    "professN": 6,
                    "tipIcon": '冲稳稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "gs": {
            "name": '甘肃',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                gs_1: [100, 8000],
                gs_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_4: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "xj": {
            "name": '新疆',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                xj_1: [100, 8000],
                xj_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 9,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫垫'
                },
                subData_2: {
                    "schoolN": 9,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫垫'
                },
                subData_4: {
                    "schoolN": 9,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫垫'
                },
                subData_3: {
                    "schoolN": 9,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "nx": {
            "name": '宁夏',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                nx_1: [100, 8000],
                nx_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 4,
                    "professN": 6,
                    "tipIcon": '冲稳保垫'
                },
                subData_2: {
                    "schoolN": 4,
                    "professN": 6,
                    "tipIcon": '冲稳保垫'
                },
                subData_4: {
                    "schoolN": 4,
                    "professN": 6,
                    "tipIcon": '冲稳保垫'
                },
                subData_3: {
                    "schoolN": 4,
                    "professN": 6,
                    "tipIcon": '冲稳保垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "bj": {
            "name": '北京',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                bj_1: [100, 8000],
                bj_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_4: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 20,
                    "professN": 6,
                    "tipIcon": '冲冲冲冲冲冲保保保保保保稳稳稳稳垫垫垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "hi": {
            "name": '海南',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                hi_1: [100, 8000],
                hi_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_4: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫垫'
                }
            },
            "batch": ["1", "2", "4", "3"],
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专']
        },
        "sx": {
            "name": '山西',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                sx_1: [100, 8000],
                sx_2: [100, 8000]
            },
            //"subProfessData": {
            //    subData_1: {
            //        _1: {
            //            "schoolN": 5,
            //            "professN": 6
            //        },
            //        _2: {
            //            "schoolN": 5,
            //            "professN": 6
            //        },
            //        _3: {
            //            "schoolN": 5,
            //            "professN": 6
            //        },
            //        "tipIcon": '冲稳保保垫'
            //    },
            //    subData_2: {
            //        _1: {
            //            "schoolN": 8,
            //            "professN": 6
            //        },
            //        _2: {
            //            "schoolN": 5,
            //            "professN": 6
            //        },
            //        _3: {
            //            "schoolN": 5,
            //            "professN": 6
            //        },
            //        "tipIcon": '冲冲稳稳保保垫垫'
            //    },
            //    subData_3: {
            //        "schoolN": 9,
            //        "professN": 6,
            //        "tipIcon": '冲冲稳稳保保垫垫垫'
            //    }
            //},
            //"batchNameTag": ['', '一本批次A', '一本批次B', '一本批次C', '二本批次A', '二本批次B', '二本批次C', '高职高专'],
            //"batch": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3"]
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 8,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 9,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
            "batch": ["1", "2", "3"]
        },
        "jl": {
            "name": '吉林',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                jl_1: [100, 8000],
                jl_2: [100, 8000]
            },
            //"subProfessData": {
            //    subData_1: {
            //        _1: {
            //            "schoolN": 5,
            //            "professN": 6,
            //            "tipIcon": '冲稳保保垫'
            //        },
            //        _2: {
            //            "schoolN": 1,
            //            "professN": 6,
            //            "tipIcon": '保'
            //        },
            //        "tipIcon": '冲稳保保垫'
            //    },
            //    subData_2: {
            //        _1: {
            //            "schoolN": 1,
            //            "professN": 6,
            //            "tipIcon": '冲'
            //        },
            //        _2: {
            //            "schoolN": 8,
            //            "professN": 6,
            //            "tipIcon": '冲冲稳稳保保垫垫'
            //        },
            //        "tipIcon": '冲冲稳稳保保垫垫'
            //    },
            //    subData_4: {
            //        "schoolN": 8,
            //        "professN": 6,
            //        "tipIcon": '保冲冲稳稳保保垫'
            //    },
            //    subData_3: {
            //        "schoolN": 7,
            //        "professN": 6,
            //        "tipIcon": '保冲稳稳保保垫'
            //    }
            //},
            //"batchNameTag": ['', '一本批次A', '一本批次B', '二本批次A', '二本批次B', '三本批次', '高职高专'],
            //"batch": ["1-1", "1-2", "2-1", "2-2", "4", "3"]
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 9,
                    "professN": 6,
                    "tipIcon": '保冲冲稳稳保保垫垫'
                },
                subData_4: {
                    "schoolN": 8,
                    "professN": 6,
                    "tipIcon": '保冲冲稳稳保保垫'
                },
                subData_3: {
                    "schoolN": 7,
                    "professN": 6,
                    "tipIcon": '保冲稳稳保保垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次A', '二本批次B', '三本批次', '高职高专'],
            "batch": ["1", "2-1", "2-2", "4", "3"]
        },
        "hl": {
            "name": '黑龙江',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                hl_1: [100, 8000],
                hl_2: [100, 8000]
            },
            //"subProfessData": {
            //    subData_1: {
            //        _1: {
            //            "schoolN": 5,
            //            "professN": 12,
            //        },
            //        _2: {
            //            "schoolN": 1,
            //            "professN": 12
            //        },
            //        "tipIcon": '冲稳保保垫'
            //    },
            //    subData_2: {
            //        _1: {
            //            "schoolN": 5,
            //            "professN": 12,
            //        },
            //        _2: {
            //            "schoolN": 1,
            //            "professN": 12
            //        },
            //        "tipIcon": '冲稳保保垫'
            //    },
            //    subData_4: {
            //        _1: {
            //            "schoolN": 5,
            //            "professN": 12,
            //        },
            //        _2: {
            //            "schoolN": 1,
            //            "professN": 12,
            //            "tipIcon": '冲稳保保垫'
            //        },
            //        "tipIcon": '冲稳保保垫'
            //    },
            //    subData_3: {
            //        _1: {
            //            "schoolN": 5,
            //            "professN": 12,
            //        },
            //        _2: {
            //            "schoolN": 1,
            //            "professN": 12
            //        },
            //        "tipIcon": '冲稳保保垫'
            //    }
            //},
            //"batchNameTag": ['', '一本批次A', '一本批次B', '二本批次A', '二本批次B', '三本批次A', '三本批次B', '高职高专A', '高职高专B'],
            //"batch": ["1-1", "1-2", "2-1", "2-2", "4-1", "4-2", "3-1", "3-2"]
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 12,

                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 5,
                    "professN": 12,
                    "tipIcon": '冲稳保保垫'
                },
                subData_4: {
                    "schoolN": 5,
                    "professN": 12,
                    "tipIcon": '冲稳保保垫'
                },
                subData_3: {
                    "schoolN": 5,
                    "professN": 12,
                    "tipIcon": '冲稳保保垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "tj": {
            "name": '天津',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                tj_1: [100, 8000],
                tj_2: [100, 8000]
            },
            //"subProfessData": {
            //    subData_1: {
            //        _1: {
            //            "schoolN": 9,
            //            "professN": 6,
            //        },
            //        _2: {
            //            "schoolN": 9,
            //            "professN": 6
            //        },
            //        "tipIcon": '冲稳保保垫垫冲保垫'
            //    },
            //    subData_2: {
            //        _1: {
            //            "schoolN": 9,
            //            "professN": 6,
            //        },
            //        _2: {
            //            "schoolN": 9,
            //            "professN": 6
            //        },
            //        "tipIcon": '冲稳保保垫垫冲保垫'
            //    },
            //    subData_4: {
            //        _1: {
            //            "schoolN": 9,
            //            "professN": 6,
            //        },
            //        _2: {
            //            "schoolN": 9,
            //            "professN": 6
            //        },
            //        _3: {
            //            "schoolN": 9,
            //            "professN": 6
            //        },
            //        "tipIcon": '冲稳保保垫垫冲保垫'
            //    },
            //    subData_3: {
            //        _1: {
            //            "schoolN": 9,
            //            "professN": 6,
            //        },
            //        _2: {
            //            "schoolN": 9,
            //            "professN": 6
            //        },
            //        "tipIcon": '冲稳保保垫垫冲保垫'
            //    }
            //},
            "subProfessData": {
                subData_1: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳稳保保垫'
                },
                subData_2: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳稳保保垫'
                },
                subData_4: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳稳保保垫'
                },
                subData_3: {
                    "schoolN": 6,
                    "professN": 6,
                    "tipIcon": '冲稳稳保保垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '三本批次', '高职高专'],
            "batch": ["1", "2", "4", "3"]
        },
        "ln": {
            "name": '辽宁',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                ln_1: [100, 8000],
                ln_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 7,
                    "professN": 6,
                    "tipIcon": '冲稳稳保保垫垫'
                },
                subData_2: {
                    "schoolN": 7,
                    "professN": 6,
                    "tipIcon": '冲稳稳保保垫垫'
                },
                subData_3: {
                    "schoolN": 9,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫垫'
                }
            },
            "batchNameTag": ['', '一本批次', '二本批次', '高职高专'],
            "batch": ["1", "2", "3"]
        },
        "zj": {
            "name": '浙江',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 0,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                zj_1: [110, 900],
                zj_2: [90, 6300]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_2: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                },
                subData_3: {
                    "schoolN": 5,
                    "professN": 6,
                    "tipIcon": '冲稳保保垫'
                }
            },
            "batchViews": [
                {
                    "batch": "1",
                    "conform": true,
                    "first": false,
                    "liLine": "605",
                    "liPlus": 6,
                    "line": false,
                    "recommend": true,
                    "wenLine": "626",
                    "wenPlus": 6
                },
                {
                    "batch": "2",
                    "conform": true,
                    "first": false,
                    "liLine": "428",
                    "liPlus": 6,
                    "line": false,
                    "recommend": false,
                    "wenLine": "472",
                    "wenPlus": 6
                },
                {
                    "batch": "3",
                    "conform": true,
                    "first": false,
                    "liLine": "221",
                    "liPlus": 6,
                    "line": false,
                    "recommend": false,
                    "wenLine": "207",
                    "wenPlus": 6
                },
            ],
            "batch": ["1", "2", "3"]
        },
        "sh": { //线差|走读
            "name": '上海',
            "schoolN": 6,
            "professN": 6,
            "professSwap": 1,
            "resultUrl": targetResultUrl[1],
            "threshold": {
                sh_1: [100, 8000],
                sh_2: [100, 8000]
            },
            "subProfessData": {
                subData_1: {
                    "schoolN": 10,
                    "professN": 6,
                    "tipIcon": '冲冲冲保保保稳稳垫垫'
                },
                subData_3: {
                    "schoolN": 8,
                    "professN": 6,
                    "tipIcon": '冲冲稳稳保保垫垫'
                }
            },
            "batchViews": [
                {
                    "batch": "1",
                    "conform": true,
                    "first": false,
                    "liLine": "348",
                    "liPlus": 6,
                    "line": false,
                    "recommend": true,
                    "wenLine": "372",
                    "wenPlus": 6
                },
                {
                    "batch": "3",
                    "conform": true,
                    "first": false,
                    "liLine": "194",
                    "liPlus": 6,
                    "line": false,
                    "recommend": false,
                    "wenLine": "144",
                    "wenPlus": 6
                }
            ],
            "batch": ["1", "3"]
        }
    }
    ;
/*
 注意:type选填参数
 不填默走智能填报业务逻辑,填了默认走查看报告逻辑
 */
function volunteerSchoolProfessFun(type) {
    var wordLen = '',
        professN = '',
        province = '',
        cate = '',
        batch = '';
    if (type) {
        batch = type.batch;
        cate = type.majorType;
        province = type.provinceCode;
    } else {
        province = util.cookie.getCookieValue('userKey');
        cate = util.cookie.getCookieValue('volunteerCate');
        batch = util.cookie.getCookieValue('volunteerBatch');
    }
    var subProfessData = volunteerSchoolProfessConf[province].subProfessData;
    var bth = batch.split('-');
    switch (bth[0]) {
        //===========================old code========================================
        //case "1":
        //    wordLen = subProfessData.subData_1.schoolN;
        //    professN = subProfessData.subData_1.professN;
        //    break;
        //case "2":
        //    wordLen = subProfessData.subData_2.schoolN;
        //    professN = subProfessData.subData_2.professN;
        //    break;
        //case "4":
        //    wordLen = subProfessData.subData_4.schoolN;
        //    professN = subProfessData.subData_4.professN;
        //    break;
        //case "3":
        //    wordLen = subProfessData.subData_3.schoolN;
        //    professN = subProfessData.subData_3.professN;
        //    break;
        //1:一批次,2:二批次,3:高职高专,4:三批次
        //===================================================================
        //山西batch": ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3"]

        case "1":
            //if (province == 'sx') {
            //    //山西一批
            //    //["1-1", "1-2", "1-3", "2-1", "2-2", "2-3", "3"]
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_1._1.schoolN;
            //            professN = subProfessData.subData_1._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_1._2.schoolN;
            //            professN = subProfessData.subData_1._2.professN;
            //            break;
            //        case 3:
            //            wordLen = subProfessData.subData_1._3.schoolN;
            //            professN = subProfessData.subData_1._3.professN;
            //            break;
            //    }
            //} else
            //if (province == 'jl') {
            //    //吉林一批
            //    //["1-1", "1-2", "2-1", "2-2", "4", "3"]
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_1._1.schoolN;
            //            professN = subProfessData.subData_1._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_1._2.schoolN;
            //            professN = subProfessData.subData_1._2.professN;
            //            break;
            //    }
            //}
            //else if (province == 'hl') {
            //    //黑龙江一批
            //    //"batch": ["1-1", "1-2", "2-1", "2-2", "4-1", "4-2", "3-1", "3-2"]
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_1._1.schoolN;
            //            professN = subProfessData.subData_1._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_1._2.schoolN;
            //            professN = subProfessData.subData_1._2.professN;
            //            break;
            //    }
            //}
            //else {
            wordLen = subProfessData.subData_1.schoolN;
            professN = subProfessData.subData_1.professN;
            //}
            break;
        case "2":
            //if (province == 'sx') {
            //    //山西二批
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_2._1.schoolN;
            //            professN = subProfessData.subData_2._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_2._2.schoolN;
            //            professN = subProfessData.subData_2._2.professN;
            //            break;
            //        case 3:
            //            wordLen = subProfessData.subData_2._3.schoolN;
            //            professN = subProfessData.subData_2._3.professN;
            //            break;
            //    }
            //} else
            //if (province == 'jl') {
            //    //吉林二批
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_2._1.schoolN;
            //            professN = subProfessData.subData_2._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_2._2.schoolN;
            //            professN = subProfessData.subData_2._2.professN;
            //            break
            //    }
            //}
            //else if (province == 'hl') {
            //    //黑龙江二批
            //    //"batch": ["1-1", "1-2", "2-1", "2-2", "4-1", "4-2", "3-1", "3-2"]
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_2._1.schoolN;
            //            professN = subProfessData.subData_2._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_2._2.schoolN;
            //            professN = subProfessData.subData_2._2.professN;
            //            break;
            //    }
            //}
            //else {
            wordLen = subProfessData.subData_2.schoolN;
            professN = subProfessData.subData_2.professN;
            //}
            break;
        case "4":
            //===========三批本科暂时不显示=============
            //if (province == 'hl') {
            //    //黑龙江三批
            //    //"batch": ["1-1", "1-2", "2-1", "2-2", "4-1", "4-2", "3-1", "3-2"]
            //    switch (parseInt[bth[1]]) {
            //        case 1:
            //            wordLen = subProfessData.subData_4._1.schoolN;
            //            professN = subProfessData.subData_4._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_4._2.schoolN;
            //            professN = subProfessData.subData_4._2.professN;
            //            break;
            //    }
            //} else {
            //if (province == 'jl') {
            //吉林三批
            //switch (parseInt[bth[1]]) {
            //    case 1:
            //        wordLen = subProfessData.subData_4._1.schoolN;
            //        professN = subProfessData.subData_4._1.professN;
            //        break;
            //    case 2:
            //        wordLen = subProfessData.subData_4._2.schoolN;
            //        professN = subProfessData.subData_4._2.professN;
            //        break;
            //}
            //} else {
            wordLen = subProfessData.subData_4.schoolN;
            professN = subProfessData.subData_4.professN;
            //}
            break;
        case "3":
            //if (province == 'hl') {
            //    //黑龙江高职高专
            //    //"batch": ["1-1", "1-2", "2-1", "2-2", "4-1", "4-2", "3-1", "3-2"]
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_3._1.schoolN;
            //            professN = subProfessData.subData_3._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_3._2.schoolN;
            //            professN = subProfessData.subData_3._2.professN;
            //            break;
            //    }
            //}
            //else
            //if (province == 'jl') {
            //    //吉林高职高专
            //    console.info(typeof bth[1]);
            //    console.info(bth[1]);
            //    switch (parseInt(bth[1])) {
            //        case 1:
            //            wordLen = subProfessData.subData_3._1.schoolN;
            //            professN = subProfessData.subData_3._1.professN;
            //            break;
            //        case 2:
            //            wordLen = subProfessData.subData_3._2.schoolN;
            //            professN = subProfessData.subData_3._2.professN;
            //            break;
            //    }
            //} else
            if (province == 'sc') {
                //四川高职高专
                //"batch": ["1-1", "1-2", "2-1", "2-2", "4-1", "4-2", "3-1", "3-2"]
                switch (parseInt(bth[1])) {
                    case 1:
                        wordLen = subProfessData.subData_3._1.schoolN;
                        professN = subProfessData.subData_3._1.professN;
                        break;
                    case 2:
                        wordLen = subProfessData.subData_3._2.schoolN;
                        professN = subProfessData.subData_3._2.professN;
                        break;
                }
            } else {
                wordLen = subProfessData.subData_3.schoolN;
                professN = subProfessData.subData_3.professN;
            }
            break;
    }

    /*
     * 同一省份,不同批次跳转不通的结果报告页面
     * 例:广东一批,二批AB结果走3号模板
     *    三批AB结果页面走1号模板
     * */

    switch (province) {
        //case 'ha':
        //    if (batch == '3' || batch == '4') {
        //        volunteerSchoolProfessConf[province].resultUrl = targetResultUrl[4];
        //    }
        //    break;
        case 'fj':
            if (batch == '3') {
                volunteerSchoolProfessConf[province].resultUrl = targetResultUrl[2];
            }
            break;
        case 'gd':
            if (batch == '3-1' || batch == '3-2') {
                volunteerSchoolProfessConf[province].resultUrl = targetResultUrl[3];
            }
            break;
        case 'jx':
            if (batch == '3-1' || batch == '3-2') {
                volunteerSchoolProfessConf[province].resultUrl = targetResultUrl[3];
            }
            break;
        case 'jl':
            if (batch != '1') {
                //volunteerSchoolProfessConf[province].resultUrl = targetResultUrl[4];
                volunteerSchoolProfessConf[province].resultUrl = targetResultUrl[4];
            }
            break;
    }
    var wordConstant = (volunteerSchoolProfessConf.constantWord).substring(0, wordLen),
        schoolArr = wordConstant.split(''),
        resultUrl = volunteerSchoolProfessConf[province].resultUrl,
        thresholdArr = volunteerSchoolProfessConf[province].threshold[province + "_" + cate];
    return {
        schoolNumber: wordLen,
        schoolArr: schoolArr,
        professN: professN,
        resultUrl: resultUrl,
        thresholdArr: [thresholdArr[0], thresholdArr[1]]
    };
}


/*
 *
 *
 *
 * */
module.exports = {
    volunteerSchoolProfessFun: volunteerSchoolProfessFun,
    config: volunteerSchoolProfessConf
};
