function cE(type) {
  return document.createElement(type)
}

function cT(text) {
  return document.createTextNode(text)
}

function createRule(arr, domain) {
  var l = arr.length, rule = cE('ul'), r, i
  rule.className = 'rules'
  rule.dataset.domain = domain
  while (l--) {
    r = cE('li')
    r.appendChild(cT(JSON.stringify(arr[l]).slice(1, -1)))
    i = cE('i')
    i.appendChild(cT('X'))
    r.appendChild(i)
    r.dataset.k = JSON.stringify(arr[l])
    rule.appendChild(r)
  }
  return rule
}


var cdf = document.createDocumentFragment();
var content = document.getElementsByClassName('content')[0]
var mainRules = null
chrome.storage.sync.get({black: {}}, function (items) {
  var black = items.black, arr = Object.keys(items.black || {}), l = arr.length

  if (l === 0) {
    cdf.appendChild(cT('暂无'))
  }

  while (l--) {
    var key = arr[l]
    var rules = cE('li'), domain = cE('span'), label = cE('label'), text = ''
    label.appendChild(cT('域名:'))
    domain.appendChild(label)
    domain.appendChild(cT(key))
    rules.appendChild(domain)


    rules.appendChild(createRule(black[key], key))

    cdf.appendChild(rules)
  }

  content.appendChild(cdf)
  mainRules = items
});

var iSClick = false
content.addEventListener('click', function (ev) {
  var target = ev.target
  if (target.innerText === 'X') {
    if (iSClick) return;
    iSClick = true
    var showMsgEle = document.getElementsByClassName('showMsg')[0]
    showMsgEle.innerHTML = '正在删除中...'
    var ruleEle = target.parentNode, domainEle = ruleEle.parentNode, domain = domainEle.dataset.domain,
      rule = ruleEle.dataset.k;
    rule = JSON.parse(rule)
    var key = rule.id ? 'id' : 'class', value = rule[key]

    var arr = mainRules.black[domain], l = arr.length

    while (l--) {
      if (arr[l][key] === value) {
        mainRules.black[domain].splice(l, 1)
        ruleEle.remove()
        if (mainRules.black[domain].length === 0) {
          delete mainRules.black[domain]
          domainEle.parentNode.remove()
        }
        break;
      }
    }

    chrome.storage.sync.set(mainRules, function () {
      iSClick = false
      showMsgEle.innerHTML = '删除成功!!'
    });

  }
})