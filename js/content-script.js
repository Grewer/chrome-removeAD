function removeElementMethod(Node) {
    Node.parentNode.removeChild(Node);
}

var rules = null


function updateStorage() {
    chrome.storage.sync.get({black: ''}, function (items) {
        rules = items.black
        localStorage.chromeRMADBlack = JSON.stringify(rules)
    });
}

updateStorage()

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method === 'rmImage') {
        // 遍历 图片 链接 将路径屏蔽
        console.log(message.message)
        var imgQuery = 'img[src="' + message.message + '"]'
        console.log(imgQuery)
        const haveImages = document.querySelector(imgQuery)
        console.log(haveImages)
        if (!haveImages) {
            var iFrames = querySelect('iframe')
            console.log(iFrames)
            var iFramesSize = iFrames.length
            while (iFramesSize--) {
                var iFrameName = iFrames[iFramesSize].name
                var iFameHave = window.frames[iFrameName].document.querySelector(imgQuery)
                if (iFameHave) {
                    var path = trace(iFrames[iFramesSize], 0, ' iframe')
                    store(path, function () {
                        removeElementMethod(document.querySelector(path))
                    })
                    return true;
                }
            }

        } else {
            var path = trace(haveImages, 0, "")
            store(path, function () {
                removeElementMethod(document.querySelector(path))
            })
            return true;
        }

        alert('规则添加失败,请手动添加')// iframe 中的图片暂时无法获取
    }
    if (message.method === 'deleteElement') {
        savePopupMsg(message.message)
    }

});

function getParent(obj) {
    if (obj.parentElement) {
        return obj.parentElement
    } else {
        return obj.parentNode
    }
}


function trace(obj, count, query) {
    //  选择器中有/的为不正确
    console.log(query)
    if (count > 2 || query.length > 20) return query;
    if (obj.className) {
        if (~obj.id.indexOf('/')) {
            return trace(getParent(obj), count++, query)
        }
        // 规则过多
        return trace(getParent(obj), count++, " ." + obj.className + query)
    } else if (obj.id) {
        if (~obj.id.indexOf('/')) {
            return trace(getParent(obj), 0, query)
        }
        return "#" + obj.id + query;
    } else {
        return trace(getParent(obj), count++, query)
    }
}

function store(feature, cb) {
    var host = location.origin
    console.log(feature)
    // 存储结构: black:{host:[{feature},{feature}]}

    chrome.storage.sync.get({black: {}}, function (items) {
        var result = items.black[host]

        if (!result) {
            items.black[host] = []
        }

        items.black[host].push(feature)

        chrome.storage.sync.set(items, function () {
            alert('添加规则成功')
            cb && cb()
        });
    }); // 保存规则
}

function savePopupMsg(msg) {
    var host = location.origin
    console.log('添加 rule 后', msg)
    chrome.storage.sync.get({black: {}}, function (items) {
        var result = items.black[host]

        if (!result) {
            items.black[host] = []
        }

        var blacks = items.black[host]
        var index = blacks.indexOf(msg)
        if (~index) {
            alert('添加规则重复')
            return false;
        }
        blacks.push(msg)
        chrome.storage.sync.set(items, function () {
            alert('添加规则成功')
            rmElementByQuery(msg)
        });
    });
}


function deleteElement() {
    var storage = JSON.parse(localStorage.chromeRMADBlack)
    var myRuleResults = (storage && storage[location.origin]) || rules && rules[location.origin]
    myRuleResults && myRuleResults.forEach(function (v) {
        rmElementByQuery(v)
    })
}

function querySelect(query) {
    try {
        return document.querySelectorAll(query)
    } catch (e) {
        return []
    }
}

function rmElementByQuery(query) {
    var elements = querySelect(query)
    console.log(elements)
    elements.forEach(function (v) {
        removeElementMethod(v)
    })
}

var async = null;

document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
        // 百度的去除广告 start
        if (location.origin === 'https://www.baidu.com') {
            document.addEventListener("DOMNodeInserted", function (ev) {
                var path = ev.target
                if (/result c-container/.test(path.className)) {
                    if (/广告/.test(path.innerText)) {
                        removeElementMethod(path)
                    }
                }

                if (async !== null) {
                    clearTimeout(async)
                }
                async = setTimeout(function () {
                    var bdad = document.querySelectorAll('div[style="display:block !important;visibility:visible !important"]')
                    bdad.forEach(function (value) {
                        removeElementMethod(value)
                    })
                    async = null
                }, 100)
            }, false);

        } else {
            document.addEventListener("DOMNodeInserted", function (ev) {
                if (async !== null) {
                    clearTimeout(async)
                }
                async = setTimeout(function () {
                    deleteElement()
                    async = null
                }, 100)

            }, false);
        }

        deleteElement()
    }
}

