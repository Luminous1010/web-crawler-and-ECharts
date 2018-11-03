import urllib.request


def log(*args, **kwargs):
    print(*args, **kwargs)


def ensure(a, b, message):
    if a != b:
        log('{}, ({}) 不等于 ({})'.format(message, a, b))
    else:
        log('测试成功')


def find2(s1, s2):
    index = -1
    l1 = len(s1)
    l2 = len(s2)

    n = s2

    for i in range(l1 - l2 + 1):
        m = s1[i:(i + l2)]

        if n == m:
            index = i
            break

    return index


def find_between(s, left, right):
    length = len(left)
    cont = ''

    index1 = find2(s, left)
    index2 = find2(s[index1:], right)
    if index1 == -1 or index2 == -1:
        cont = '不存在'
    else:
        cont = s[index1 + length:index1 + index2]

    return cont


def openurl(url):
    # 这里把 url 写死为豆瓣 top250 页面
    url = 'https://movie.douban.com/top250'
    # 下载页面, 得到的是一个 bytes 类型的变量 s
    s = urllib.request.urlopen(url).read()
    # 用 utf-8 编码把 s 转为字符串并返回
    content = s.decode('utf-8')
    return content


def ratings():
    url = 1
    content_w = openurl(url)
    # log(content_w)
    left = 'property="v:average">'
    right = '</span>'
    result = []
    i = 0
    length = len(left)

    while i < 25:
        result.append(find_between(content_w, left, right))
        # log(find_between(content_w, left, right))
        # log(result)
        new_left = (find2(content_w, left) + length)
        content_w = content_w[new_left:]
        # log(content_w)
        i += 1

    return result


def __main():
    log('result', ratings())


__main()
