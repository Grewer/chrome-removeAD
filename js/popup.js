function getEle(id) {
  return document.getElementById(id)
}

window.onload = function () {
  var submit = getEle('submit'), addId = getEle('addId'), addClass = getEle('addClass')

  submit.addEventListener('click', function () {
    submit.disabled = true
    var host = location.origin,
      addIdVal = addId.value.replace(/\s+/g, ""),
      addClassVal = addClass.value.replace(/\s+/g, "")
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


      if (addIdVal && check('id', addIdVal)) {
        addStorage({id: addIdVal})
      } else if (addClassVal && check('calss', addClassVal)) {
        addStorage({class: addClassVal})
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
          chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
              method: 'deleteElement',
              message: obj
            }, function (response) {});
          });
        });
      }
    }); // 保存规则
  })

}