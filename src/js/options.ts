function cE(type: string) {
  return document.createElement(type)
}

function cT(text: string) {
  return document.createTextNode(text)
}

function createRule(arr: string[], domain: string) {
  let l = arr.length, rule = cE('ul'), r, i
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


let cdf = document.createDocumentFragment()
let content = document.getElementsByClassName('content')[0]
let mainRules: any = null
chrome.storage.sync.get({ black: {} }, function (items) {
  let black = items.black, arr = Object.keys(items.black || {}), l = arr.length

  if (l === 0) {
    cdf.appendChild(cT('暂无'))
  }

  while (l--) {
    let key = arr[l]
    let rules = cE('li'), domain = cE('span'), label = cE('label'), text = ''
    label.appendChild(cT('域名:'))
    domain.appendChild(label)
    domain.appendChild(cT(key))
    rules.appendChild(domain)


    rules.appendChild(createRule(black[key], key))

    cdf.appendChild(rules)
  }

  content.appendChild(cdf)
  mainRules = items
})

let iSClick = false
content.addEventListener('click', function (ev) {
  let target = <HTMLElement>ev.target
  if (target.innerText === 'X') {
    if (iSClick) return
    iSClick = true
    let showMsgEle = document.getElementsByClassName('showMsg')[0]
    showMsgEle.innerHTML = '正在删除中...'
    // @ts-ignore
    let ruleEle = <HTMLElement>target.parentNode, domainEle = <HTMLElement>ruleEle.parentNode,
      domain = domainEle.dataset.domain
    // @ts-ignore


    let rule = JSON.parse(ruleEle.dataset.k)
    let key = rule.id ? 'id' : 'class', value = rule[key]

    let arr = mainRules.black[domain], l = arr.length

    while (l--) {
      if (arr[l][key] === value) {
        mainRules.black[domain].splice(l, 1)
        ruleEle.remove()
        if (mainRules.black[domain].length === 0) {
          delete mainRules.black[domain]
          domainEle.parentElement.remove()
        }
        break
      }
    }

    chrome.storage.sync.set(mainRules, function () {
      iSClick = false
      showMsgEle.innerHTML = '删除成功!!'
      setTimeout(function () {
        showMsgEle.innerHTML = ''
      }, 1000)
    })

  }
})
