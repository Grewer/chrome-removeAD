function getEle(id) {
  return document.getElementById(id)
}

window.onload = function () {
  var submit = getEle('submit'), addId = getEle('addId'), addClass = getEle('addClass')

  submit.addEventListener('click', function () {
    submit.disabled = true
    var host = location.origin
    chrome.storage.sync.get({black: {}}, function (items) {
      var result = items.black[host]

      if (!result) {
        items.black[host] = []
      }

      function check(key, value) {
        var arr = items.black[host], l = arr.length;
        if (l > 0) {
          while (l--) {
            if (arr[l][key] === value) {
              return false
            }
          }
        }
        return true
      }


      if (addId.value && check('id', addId.value)) {
        addStorage({id: addId.value})
      } else if (addClass.value && check('calss', addClass.value)) {
        addStorage({class: addClass.value})
      } else {
        alert('规则为空或已存在')
        submit.disabled = false
      }

      function addStorage(obj) {
        items.black[host].push(obj)
        console.log(items)
        chrome.storage.sync.set(items, function () {
          alert('添加规则成功')
          submit.disabled = false
        });
      }
    }); // 保存规则
  })

}