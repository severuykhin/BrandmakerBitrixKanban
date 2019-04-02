const message = {
    action: 'showPageAction'
};

chrome.runtime.sendMessage(message);

const Kanban = (function () {

    const DOM_map = {
        columns: null,
        cards: null
    };

    const setDomMap = function () {
        DOM_map.columns = document.querySelectorAll('.main-kanban-column');
    }

    const initModule = function () {
        setDomMap();

        console.log(this);
    }

    return {
        initModule: initModule
    };
})();

setTimeout(function () {
    Kanban.initModule();
}, 5000);