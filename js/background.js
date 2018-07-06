

function select(e) {
  // 页面地址: e.pageUrl
  // 图片地址: e.srcUrl
  // 是否为图片 e.mediaType === "image"

  // 将其存储为本地数据 // 当前页通过消息触发dom操作

  // 加载时搜索图片 当路径相同时,查看当前dom 的id 加入黑名单,若无class,id,则向其父元素搜索 ,直到父元素为3层以上或为body元素时停止
  // 将其加入黑名单

  if(e.mediaType !== "image") return alert('只能添加图片');

  var r = confirm("确认将此链接加入黑名单")
  if (r) {
    // 向 content-script.js 发送消息
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        method: 'rmImage',
        message: e.srcUrl
      }, function (response) {});
    });

  }

}

// chrome.contextMenus.create({
//   "title": "选中文字",
//   "contexts": ["selection"],
//   "onclick": select
// });

chrome.contextMenus.create({"title": "去除该广告", "contexts": ["link"], "onclick": select});