chrome.action.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({
        url: `https://github.com/veringsek/google-navigation`
    });
});