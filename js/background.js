console.log('run')


function select(e) {
  // alert('您点击了右键菜单！');
  console.log('click', e)
  // todo confirm 是否加入黑名单
  // 页面地址: e.pageUrl
  // 图片地址: e.srcUrl
  // 是否为图片 e.mediaType === "image"

  // 将其存储为本地数据 // 当前页无法触发dom操作 待解决

  // 加载时搜索图片 当路径相同时,查看当前dom 的id 加入黑名单,若无class,id,则向其父元素搜索 ,直到父元素为3层以上或为body元素时停止
  // 将其加入黑名单
}

// chrome.contextMenus.create({
//   "title": "选中文字",
//   "contexts": ["selection"],
//   "onclick": select
// });

chrome.contextMenus.create({"title": "链接地址", "contexts": ["link"], "onclick": select});