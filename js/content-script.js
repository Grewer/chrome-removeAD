console.log(document); // it run
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
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.method === 'rmImage') {
    console.log(message.message);
    // 遍历 图片 链接 将路径屏蔽
    var images = getDocumentImage(), l = images.length
    console.log(location.href)
    console.log(l, images)
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
  console.log(feature)
  rmElementByFeature(feature)
  store(feature)
}

// 存储
function store(feature) {
  var host = location.origin

  // 存储结构: black:{host:[{feature},{feature}]}

  chrome.storage.sync.get({black: {}}, function (items) {
    var result = items.black[host]
    console.log(result)
    if (result) {
      result.push(feature)
    } else {
      items.black[host] = [feature]
    }
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

  var iframe = document.getElementsByTagName('iframe'),fl = iframe.length;
  while (fl--) {
    iframe[fl].remove()
  }

  var result = rules[location.origin]

  console.log(result)
  if (result) {
    var l = result.length;
    while (l--) {
      rmElementByFeature(result[l])
    }
  }
}

function rmElementByFeature(feature) {
  if (feature.id) {
    var obj = document.getElementById(feature.id)
    obj && obj.remove()
  } else {
    var objs = document.getElementsByClassName(feature.class)
    var l = objs.length
    while (l--) {
      objs[l].remove()
    }
  }
}


document.onreadystatechange = function () {
  console.log('dom load')
  if (document.readyState === 'interactive') {
    deleteElement()
  }
}

