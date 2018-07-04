console.log('run')


chrome.contextMenus.create({
  "title": "选中文字",
  "contexts": ["selection"],
  "onclick": function (e) {
    alert('您点击了右键菜单！');
    console.log('click', e)
  }
});