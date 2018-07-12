function getEle(id) {
  return document.getElementById(id)
}

window.onload = function () {
  var submit = getEle('submit'), addId = getEle('addId'), addClass = getEle('addClass')

  submit.addEventListener('click', function () {
    submit.disabled = true

    var addIdVal = addId.value.replace(/\s+/g, ""),
      addClassVal = addClass.value.replace(/\s+/g, "")


    if (addIdVal) {
      send({id: addIdVal})
    } else if (addClassVal) {
      send({class: addClassVal})
    } else {
      alert('规则为空')
      submit.disabled = false
    }


    function send(obj) {
      submit.disabled = false
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          method: 'deleteElement',
          message: obj
        }, function (response) {
          if (response === false) {
            alert('添加规则失败(或为重复)')
          }

        });
      });
    }


  })

}