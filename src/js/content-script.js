function getParent(obj) {
    return obj.parentElement || obj.parentNode
}


function removeElementMethod(Node) {
    try {
        getParent(Node).removeChild(Node);
    } catch (e) {
    }
}

let rules = null

let isRmFrame = true

function updateStorage() {
    chrome.storage.sync.get({black: {}, isRmFrame: true}, function (items) {
        rules = items.black
        isRmFrame = items.isRmFrame
    });
}

updateStorage()

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.method === 'rmImage') {
        // 遍历 图片 链接 将路径屏蔽
        console.log(message.message)
        let imgQuery = 'img[src="' + message.message + '"]'
        console.log(imgQuery)
        const haveImages = document.querySelector(imgQuery)
        console.log('是否在 document 中', haveImages)
        if (!haveImages) {
            let iFrames = querySelect('iframe')
            console.log(iFrames)
            let iFramesSize = iFrames.length
            try {
                while (iFramesSize--) {
                    let iFrameName = iFrames[iFramesSize].name
                    console.log("iFrameName", iFrameName)
                    let _iframe = iFrameName ? window.frames[iFrameName] : window.frames[iFramesSize]
                    if (_iframe.document.querySelector(imgQuery)) {
                        let path = trace(iFrames[iFramesSize], 0, ' iframe')
                        saveMsg(path)
                        return true;
                    }
                }
            } catch (e) {
                console.error('iframe阻拦', e)
                alert('iframe 被阻拦,请手动添加规则');
                return;
            }
        } else {
            let path = trace(haveImages, 0, "")
            saveMsg(path)
            return true;
        }

        alert('规则添加失败,请手动添加')// iframe 中的图片暂时无法获取
    }
    if (message.method === 'deleteElement') {
        saveMsg(message.message)
        return;
    }
    if (message.method === 'rmFrame') {
        saveRMFrame(message.message, sendResponse)
    }
});

function saveRMFrame(checked, sendResponse) {
    chrome.storage.sync.get({black: {}, isRmFrame: true}, function (items) {
        items.isRmFrame = checked
        chrome.storage.sync.set(items, function () {
            if (checked) {
                RMFrame()
            }
            sendResponse && sendResponse()
        });
    });
}


function trace(obj, count, query) {
    //  选择器中有/的为不正确
    console.log(query)
    if (count > 2 || query.length > 20) return query;
    switch (true) {
        case !!obj.className:
            if (~obj.id.indexOf('/')) {
                return trace(getParent(obj), count++, query)
            }
            // 规则过多
            return trace(getParent(obj), count++, " ." + obj.className + query)
        case !!obj.id:
            if (~obj.id.indexOf('/')) {
                return trace(getParent(obj), 0, query)
            }
            return "#" + obj.id + query;
        default:
            return trace(getParent(obj), count++, query)
    }
}


function saveMsg(msg) {
    let host = location.origin
    console.log('添加 rule 后', msg)
    chrome.storage.sync.get({black: {}, isRmFrame: true}, function (items) {
        let result = items.black[host]

        if (!result) {
            items.black[host] = []
        }

        let blacks = items.black[host]
        let index = blacks.indexOf(msg)
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
    let myRuleResults = rules && rules[location.origin]
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
    let elements = querySelect(query)
    elements.forEach(function (v) {
        removeElementMethod(v)
    })
}

function RMFrame() {
    let elements = querySelect('iframe')
    elements.forEach(function (v) {
        const parent = getParent(v)
        const brother = parent.children
        if (brother && brother.length === 1) {
            removeElementMethod(v)
        } else {
            if (parent.nodeName === "BODY" || parent.nodeName === "HTML") {
                removeElementMethod(v)
            } else {
                let i = source.length
                while (i--) {
                    const ele = source[i]
                    if (!ele) {
                        continue
                    }
                    removeElementMethod(ele)
                }
            }
        }
    })
}


let async = null;

document.onreadystatechange = function () {
    // 文档已被解析，"正在加载"状态结束，但是诸如图像，样式表和框架之类的子资源仍在加载。
    if (document.readyState === 'interactive') {
        // 百度的去除广告 start
        if (location.origin === 'https://www.baidu.com') {
            document.addEventListener("DOMNodeInserted", function (ev) {
                let path = ev.target
                if (/result c-container/.test(path.className)) {
                    if (/广告/.test(path.innerText)) {
                        removeElementMethod(path)
                    }
                }

                if (async !== null) {
                    clearTimeout(async)
                }
                async = setTimeout(function () {
                    let bdad = document.querySelectorAll('div[style="display:block !important;visibility:visible !important"]')
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
                    if (isRmFrame) {
                        RMFrame()
                    }
                    async = null
                }, 100)

            }, false);
        }

        deleteElement()


        if (location.origin === "https://blog.csdn.net") {
            document.querySelector('a.btn-readmore')?.click()
        }
    }
}

