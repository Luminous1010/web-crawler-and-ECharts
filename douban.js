// 系统标准库
const fs = require('fs')

// 第三方库
const request = require('syncrequest')
const cheerio = require('cheerio')

// 自定义模块
const log = console.log.bind(console)


// ES6 定义一个类
class Movie {
    constructor() {
        // 分别是电影名/评分/引言/排名/封面图片链接
        this.name = ''
        this.score = 0
        this.quote = ''
        this.ranking = 0
        this.coverUrl = ''
        this.otherNames = ''
    }
}

const movieFromDiv = (div) => {
    // 这里的 e 函数相当于 div.querySelector
    let e = cheerio.load(div)

    // 创建一个电影类的实例并且获取数据
    let movie = new Movie()
    // element.text() 相当于 element.textContent
    movie.name = e('.title').text()
    movie.score = Number(e('.rating_num').text())
    movie.quote = e('.inq').text()

    let pic = e('.pic')
    // pic.querySelector('em')
    movie.ranking = Number(pic.find('em').text())
    // element.attr('src') 相当于 element.src
    movie.coverUrl = pic.find('img').attr('src')
    let otherNames = e('.other').text()
    movie.otherNames = otherNames.slice(3).split('/').join('|')
    let comments = e('.star').children('span').last()
    // log(comments.text().split('人')[0])
    movie.comments = Number(comments.text().split('人')[0])

    return movie
}

const ensurePath = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

const cachedUrl = (url) => {
    let cachePath = 'cached_html'
    // 确定缓存的文件名
    let cacheFile = cachePath + '/' + url.split('?')[1] + '.html'
    // 检查缓存文件是否存在
    // 如果存在就读取缓存文件
    // 如果不存在就下载并且写入缓存文件

    // 写一个辅助函数, 避免手动创建文件夹
    ensurePath(cachePath)
    let exists = fs.existsSync(cacheFile)
    if (exists) {
        let data = fs.readFileSync(cacheFile)
        return data
    } else {
        // 去下载
        // 用 GET 方法获取 url 链接的内容
        // 相当于你在浏览器地址栏输入 url 按回车后得到的 HTML 内容
        let r = request.get.sync(url)
        let body = r.body
        // 写入缓存
        fs.writeFileSync(cacheFile, body)
        return body
    }
}

const moviesFromUrl = (url) => {
    // let body = r.body
    // 调用 cachedUrl 来获取 HTML 数据
    let body = cachedUrl(url)
    // cheerio.load 用来把 HTML 文本(字符串)解析为一个可以操作的 DOM(树)
    // 这里的 e 函数相当于 body.querySelector
    let e = cheerio.load(body)

    // 一共有 25 个 .item
    // 不管获取多少个元素, 都可以使用 e 函数
    let movieDivs = e('.item')
    // 循环处理 25 个 .item
    let movies = []
    for (let i = 0; i < movieDivs.length; i++) {
        let div = movieDivs[i]
        // 扔给 movieFromDiv 函数来获取到一个 movie 对象
        let m = movieFromDiv(div)
        movies.push(m)
    }
    return movies
}

const saveMovie = (movies) => {
    // JSON.stringify 第 2 3 个参数配合起来是为了让生成的 json
    // 数据带有缩进的格式，第三个参数表示缩进的空格数
    /* 原理:
    https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
    */
    let s = JSON.stringify(movies, null, 2)
    // 把 json 格式字符串写入到 文件 中
    let path = 'douban.txt'
    fs.writeFileSync(path, s)
}

const downloadCovers = (movies) => {
    let path = 'covers'
    ensurePath(path)
    log('begin loop')
    for (let m of movies) {
        let url = m.coverUrl
        // 通过 url 下载图片
        let file = path + '/' + m.name.split('/')[0] + '.jpg'
        log('file', file)
        let result = request.sync(url, {
            pipe: file,
        })
    }
}

const __main = () => {
    // 主函数
    let movies = []
    for (let i = 0; i < 10; i++) {
        let start = i * 25
        let url = `https://movie.douban.com/top250?start=${start}`
        let moviesInPage = moviesFromUrl(url)
        // concat 拼接数组
        movies = movies.concat(moviesInPage)
    }
    log('movies length', movies.length)
    saveMovie(movies)
    downloadCovers(movies)
    log('抓取成功, 数据已经写入到 douban.txt 中')
}

__main()
