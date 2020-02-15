function getEle(id) {
    return document.getElementById(id)
}

window.onload = function () {
    let submit = getEle('submit'), addQuery = getEle('addQuery')

    submit.addEventListener('click', function () {
        submit.disabled = true

        let value = addQuery.value;

        if (!value) {
            alert('规则为空')
            submit.disabled = false
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

}
