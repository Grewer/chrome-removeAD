function getEle(id) {
    return document.getElementById(id)
}

window.onload = function () {
    console.log(chrome.tabs)

    let submit = getEle('submit'), addQuery = getEle('addQuery'),
        jumpOptions = getEle('jumpOption'), rmFrame = getEle('rmFrame')

    submit.addEventListener('click', function () {
        submit.disabled = true

        let value = addQuery.value;

        if (!value) {
            alert('规则为空')
            submit.disabled = false
            return;
        }

        send(value)

        function send(query) {
            submit.disabled = false
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    method: 'deleteElement',
                    message: query
                }, function (response) {

                });
            });
        }
    })

    jumpOptions.addEventListener('click', function () {
        chrome.tabs.create({url: 'chrome://extensions/?options=' + chrome.runtime.id});
    })

    rmFrame.addEventListener('change', function (ev) {
        const checked = ev.target.checked
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                method: 'rmFrame',
                message: checked
            }, function (response) {
                chrome.tabs.reload()
            });
        });
    })

    console.log(chrome.tabs.reload)

    chrome.storage.sync.get({black: {}, isRmFrame: true}, function (items) {
        rmFrame.checked = items.isRmFrame
    })
}
