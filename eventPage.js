let tabsQueryParams = {
    active: true,
    currentWindow: true
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showPageAction') {
        chrome.tabs.query(tabsQueryParams, (tabs) => {
            chrome.pageAction.show(tabs[0].id)
        });
    }
});

