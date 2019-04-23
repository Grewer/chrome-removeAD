// // polyfill start
// (function (arr) {
//     arr.forEach(function (item) {
//         if (item.hasOwnProperty('remove')) {
//             return;
//         }
//         Object.defineProperty(item, 'remove', {
//             configurable: true,
//             enumerable: true,
//             writable: true,
//             value: function remove() {
//                 this.parentNode.removeChild(this);
//             }
//         });
//     });
// })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
// // polyfill end

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
        var images = getDocumentImage(document), l = images.length
        // while (l--) {
        //     if (images[l].src === message.message) {
        //         return traceTop(images[l])
        //     }
        // }
        // 后续优化~~

        alert('规则添加失败,请手动添加')// iframe 中的图片暂时无法获取
    }
    if (message.method === 'deleteElement') {
        savePopupMsg(message.message)
    }

});

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

// function traceTop(image) {
//     if (!image) return;
//     var feature = trace(image, 0)
//     rmElementByFeature(feature)
//     store(feature)
// }

// 存储
// function store(feature, cb) {
//     var host = location.origin
//
//     // 存储结构: black:{host:[{feature},{feature}]}
//
//     chrome.storage.sync.get({black: {}}, function (items) {
//         var result = items.black[host]
//
//         if (!result) {
//             items.black[host] = []
//         }
//
//         items.black[host].push(feature)
//
//         chrome.storage.sync.set(items, function () {
//             alert('添加规则成功')
//             cb && cb()
//         });
//     }); // 保存规则
//
//
// }

function getParent(obj) {
    if (obj.parentElement) {
        return obj.parentElement
    } else {
        return obj.parentNode
    }
}


function trace(obj, count) {
    if (count > 3) return false;
    if (obj.className) {
        return {class: obj.className}
    } else if (obj.id) {
        return {id: obj.id}
    } else {
        return trace(getParent(obj), count++)
    }
}

function getDocumentImage(document) {
    if (document.images) {
        getDocumentImage = function (document) {
            return document.images
        }
        return document.images
    } else {
        getDocumentImage = function (document) {
            return document.getElementsByTagName('img')
        }
        return document.getElementsByTagName('img')
    }
}


function deleteElement() {
    var storage = JSON.parse(localStorage.chromeRMADBlack)
    var myRuleResults = (storage && storage[location.origin]) || rules && rules[location.origin]

    myRuleResults.forEach(function (v) {
        rmElementByQuery(v)
    })
}

function querySelect(query) {
    return document.querySelectorAll(query)
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

