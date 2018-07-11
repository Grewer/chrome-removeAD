// polyfill start
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
// polyfill end

var rules = null
chrome.storage.sync.get({black: ''}, function (items) {
  rules = items.black
  localStorage.chromeRMADBlack = JSON.stringify(rules)
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.method === 'rmImage') {
    // 遍历 图片 链接 将路径屏蔽
    var images = getDocumentImage(), l = images.length
    while (l--) {
      if (images[l].src === message.message) {
        return traceTop(images[l])
      }
    }
    alert('规则添加失败,请手动添加')// iframe 中的图片暂时无法获取
  }
});

function traceTop(image) {
  if (!image) return;
  var feature = trace(image, 0)
  rmElementByFeature(feature)
  store(feature)
}

// 存储
function store(feature) {
  var host = location.origin

  // 存储结构: black:{host:[{feature},{feature}]}

  chrome.storage.sync.get({black: {}}, function (items) {
    var result = items.black[host]

    if (!result) {
      items.black[host] = []
    }

    items.black[host].push(feature)

    chrome.storage.sync.set(items, function () {
      alert('添加规则成功')
    });
  }); // 保存规则


}

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

function getDocumentImage() {
  if (document.images) {
    getDocumentImage = function () {
      return document.images
    }
    return document.images
  } else {
    getDocumentImage = function () {
      return document.getElementsByTagName('img')
    }
    return document.getElementsByTagName('img')
  }
}


function deleteElement() {
  var storage = JSON.parse(localStorage.chromeRMADBlack)
  var myRuleResults = (storage && storage[location.origin]) || rules && rules[location.origin]

  if (myRuleResults) {
    var l = myRuleResults.length;
    while (l--) {
      rmElementByFeature(myRuleResults[l])
    }
  }
}

function rmElementByFeature(feature) {
  if (feature.class) {
    var objs = document.getElementsByClassName(feature.class)
    var l = objs.length
    while (l--) {
      var o = objs[l]
      o && o.remove()
    }
  } else {
    var obj = document.getElementById(feature.id)
    obj && obj.remove()
  }
}

var async = null

document.onreadystatechange = function () {
  if (document.readyState === 'interactive') {
    var iframe = document.getElementsByTagName('iframe'), fl = iframe.length;
    while (fl--) {
      iframe[fl].remove()
    }


    // 百度的去除广告 start
    if (location.origin === 'https://www.baidu.com') {
      document.addEventListener("DOMNodeInserted", function (ev) {
        var path = ev.target
        if (/result c-container/.test(path.className)) {
          if (/广告/.test(path.innerText)) {
            path.remove()
          }
        }

        if (async !== null) {
          clearTimeout(async)
        }
        async = setTimeout(function () {
          var bdad = document.querySelectorAll('div[style="display:block !important;visibility:visible !important"]')
          var bdl = bdad.length;
          while (bdl--) {
            var o = bdad[bdl]
            o && o.remove()
          }
          async = null
        }, 100)

      }, false);

    }// 百度去除广告 end

    deleteElement()
  }
  if (document.readyState === 'complete') {
    deleteElement()
  }
}

