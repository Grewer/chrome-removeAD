console.log(document) // it run
chrome.storage.sync.get({black: ''}, function(items) {
  console.log(items)
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.method === 'rmImage') {
    console.log(message.message);
    // 遍历 图片 链接 将路径屏蔽
  }
});