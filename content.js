const message = {
    action: 'showPageAction'
};

chrome.runtime.sendMessage(message);

const Kanban = (function() {

    const DOM_map = {
        columns: null
    };

    const setDomMap = function(columns) {

        DOM_map.columns = [];

        Array.prototype.slice.apply(columns, null).forEach(element => {

            let cards = element.querySelectorAll('.tasks-kanban-item'),
                title = element.querySelector('.main-kanban-column-total-item');

            let column_map = {
                elem: element,
                cards: cards,
                title: title,
                time: null
            };

            DOM_map.columns.push(column_map);
        });

    }

    const initModule = function() {
        update();

        setInterval(function() {
            update();
        }, 10000);
    }

    /**
     * Преобразует время в удобный формат
     * @param {string} config  - Часы и минуты
     */
    const convertTime = function(config) {

        if (config.minutes <= 0 && config.hours <= 0) return '00:00';

        let extraHours, actualMinutes, hString, mString,
            minutes = config.minutes,
            hours = config.hours;

        if (minutes >= 60) {
            extraHours = Math.floor(minutes / 60);
            hours += extraHours;
            actualMinutes = minutes - (extraHours * 60);
        } else {
            actualMinutes = minutes;
        }

        hString = hours < 10 ? `0${hours}` : `${hours}`;
        mString = actualMinutes < 10 ? `0${actualMinutes}` : `${actualMinutes}`;

        return `${hString}:${mString}`;
    }

    const countColumnTime = function(columnCards) {

        let allottedHours = 0,
            allottedMinutes = 0,
            spentHours = 0,
            spentMinutes = 0;

        Array.prototype.slice.apply(columnCards, null).forEach((card) => {
            let cardAllottedTimeText = card.querySelector('.tasks-kanban-item-timelogs').textContent,
                cardTimeValues = cardAllottedTimeText.split('/'),
                spentTime = 0,
                allottedTime = 0;

            if (cardTimeValues.length <= 1) {
                spentTime = cardTimeValues[0].split(':');
            } else {
                spentTime = cardTimeValues[0].split(':');
                allottedTime = cardTimeValues[1].split(':');
            }

            spentHours += parseInt(spentTime[0], 10);
            spentMinutes += parseInt(spentTime[1], 10);

            if (allottedTime) {
                allottedHours += parseInt(allottedTime[0], 10);
                allottedMinutes += parseInt(allottedTime[1], 10);
            }

        });

        return {
            spentTime: convertTime({ hours: spentHours, minutes: spentMinutes }),
            allottedTime: convertTime({ hours: allottedHours, minutes: allottedMinutes })
        };
    }

    const updateColumnsTime = function() {
        DOM_map.columns.forEach((column) => {
            if (column.cards.length <= 0) return false;
            column.time = countColumnTime(column.cards);

            let text = `${column.title.textContent.split(' - ')[0]} - ${column.time.spentTime}/${column.time.allottedTime}`;
            column.title.textContent = text;
        });
    }

    const update = function() {
        let columns = document.querySelectorAll('.main-kanban-column');

        if (columns.length <= 0) return false;
        setDomMap(columns);
        updateColumnsTime();
    }

    return {
        initModule: initModule
    };
})();

setTimeout(function() {
    Kanban.initModule();
}, 3000);