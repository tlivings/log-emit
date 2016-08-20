'use strict';

const Callermodule = require('callermodule');

const EVENT = 'log$';

const createLogger = function (name = '') {
    const source = Callermodule().name;

    return {
        log(...args /* ...tags, data */) {
            const timestamp = Date.now();
            const tags = args.slice(0, args.length - 1);
            const data = args[args.length - 1];

            process.emit(EVENT, { source, name, timestamp, tags }, data);
        }
    };
};

const subscribe = function (listener) {
    process.on(EVENT, listener);

    return listener;
};

const unsubscribe = function (listener) {
    process.removeListener(EVENT, listener);
};

const unsubscribeAll = function () {
    process.removeAllListeners(EVENT);
}

module.exports = { createLogger, subscribe, unsubscribe, unsubscribeAll };
