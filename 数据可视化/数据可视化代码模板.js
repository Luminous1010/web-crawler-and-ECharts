var element = document.querySelector('#main')
var myChart = echarts.init(element)

const log = console.log.bind(console)

const ajax = (method, path, data, callback) => {
    let r = new XMLHttpRequest()
    r.open(method, path, true)
    r.onreadystatechange = () => {
        if (r.readyState === 4) {
            // log('r', r)
            callback(r.response)
        }
    }
    r.send(data)
}

const weatherData = (data) => {
    let location = data.HeWeather6[0].basic.location
    let daily_forecast = data.HeWeather6[0].daily_forecast
    let date = []
    let tmp_max = []
    let tmp_min = []
    let pop = []

    for (let i of daily_forecast) {
        // log('i', i)
        date.push(i.date)
        tmp_max.push(i.tmp_max)
        tmp_min.push(i.tmp_min)
        pop.push(i.pop)
    }

    let option = {
        title : {
            text: '厦门地区蒸发量和降水量',
            subtext: ''
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data:['蒸发量','降水量', '最高气温']
        },
        toolbox: {
            show : true,
            feature : {
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        xAxis : [
            {
                type : 'category',
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '水量',
                min: 0,
                max: 250,
                interval: 50,
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            {
                type: 'value',
                name: '温度',
                min: 0,
                max: 25,
                interval: 5,
                axisLabel: {
                    formatter: '{value} °C'
                }
            }
        ],
        series : [
            {
                name:'蒸发量',
                type:'bar',
                data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'最高气温',
                type:'line',
                yAxisIndex: 1,
                data:[11, 11, 15, 13, 12, 13, 10],
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'降水量',
                type:'bar',
                data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                markPoint : {
                    data : [
                        {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                        {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }
            }
        ]
    }
    myChart.setOption(option)
}

const fetchWeather = (callback) => {
    let method = 'GET'
    let path = 'https://free-api.heweather.com/s6/weather/forecast?location=xiamen&key=2650938c473542198f4efbccafa45526'
    let data = ''
    ajax(method, path, data, callback)
}

// 使用刚指定的配置项和数据显示图表
// myChart.setOption(option)
const weatherPic = () => {
    // 异步数据处理方式
    fetchWeather((data) => {
        let b = JSON.parse(data)
        weatherData(b)
        // 在这里获取 weather 数据
        // 并且处理成 option 需要的格式
    })
}

const __main = () => {
    weatherPic()
}


__main()
