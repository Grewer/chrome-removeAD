function cE(e){return document.createElement(e)}function cT(e){return document.createTextNode(e)}function createRule(e,n){let t,l,c=e.length,a=cE("ul");for(a.className="rules",a.dataset.domain=n;c--;)(t=cE("li")).appendChild(cT(JSON.stringify(e[c]).slice(1,-1))),(l=cE("i")).appendChild(cT("X")),t.appendChild(l),t.dataset.k=JSON.stringify(e[c]),a.appendChild(t);return a}let cdf=document.createDocumentFragment(),content=document.getElementsByClassName("content")[0],mainRules=null;chrome.storage.sync.get({black:{}},function(e){let n=e.black,t=Object.keys(e.black||{}),l=t.length;for(0===l&&cdf.appendChild(cT("暂无"));l--;){let e=t[l],c=cE("li"),a=cE("span"),i=cE("label");i.appendChild(cT("域名:")),a.appendChild(i),a.appendChild(cT(e)),c.appendChild(a),c.appendChild(createRule(n[e],e)),cdf.appendChild(c)}content.appendChild(cdf),mainRules=e});let iSClick=!1;content.addEventListener("click",function(e){let n=e.target;if("X"===n.innerText){if(iSClick)return;iSClick=!0;let e=document.getElementsByClassName("showMsg")[0];e.innerHTML="正在删除中...";let t=n.parentNode,l=t.parentNode,c=l.dataset.domain,a=JSON.parse(t.dataset.k),i=a.id?"id":"class",d=a[i],s=mainRules.black[c],r=s.length;for(;r--;)if(s[r][i]===d){mainRules.black[c].splice(r,1),t.remove(),0===mainRules.black[c].length&&(delete mainRules.black[c],l.parentElement.remove());break}chrome.storage.sync.set(mainRules,function(){iSClick=!1,e.innerHTML="删除成功!!",setTimeout(function(){e.innerHTML=""},1e3)})}});