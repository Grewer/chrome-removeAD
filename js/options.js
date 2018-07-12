
function cE(type) {
  return document.createElement(type)
}

function cT(text) {
  return document.createTextNode(text)
}

function createRule(arr) {
  var l = arr.length, rule = cE('ul'), r, i
  rule.className = 'rules'
  while (l--) {
    r = cE('li')
    r.appendChild(cT(JSON.stringify(arr[l]).slice(1, -1)))
    i = cE('i')
    i.appendChild(cT('X'))
    r.appendChild(i)
    rule.appendChild(r)
  }
  return rule
}


var cdf = document.createDocumentFragment();
var content = document.getElementsByClassName('content')[0]
chrome.storage.sync.get({black: {}}, function (items) {
  var black = items.black, arr = Object.keys(items.black || {}), l = arr.length

  while (l--) {
    var key = arr[l]
    var rules = cE('li'), domain = cE('span'), label = cE('label'), text = ''
    label.appendChild(cT('域名:'))
    domain.appendChild(label)
    domain.appendChild(cT(key))
    rules.appendChild(domain)


    rules.appendChild(createRule(black[key]))

    cdf.appendChild(rules)
  }

  content.appendChild(cdf)
});

content.addEventListener('click', function (ev) {
  var target = ev.target
  if (target.innerText === 'X') {
    console.log('todo')
  }
})