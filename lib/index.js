'use strict';

const Individual = require("individual")
const Callermodule = require('callermodule');
const { EventEmitter } = require('events');

const event = Individual("__LOG_EMITTER", {
    emitter: new EventEmitter(),
    name: 'log$'
});

const createLogger = function (name = '') {
    const source = Callermodule().name;

    return {
        log(...args /* ...tags, data */) {
            const timestamp = Date.now();
            const tags = args.length > 1 ? args.slice(0, args.length - 1) : [];
            const data = args[args.length - 1];

            setImmediate(() => event.emitter.emit(event.name, { source, name, timestamp, tags, data }));
        }
    };
};

const subscribe = function (listener) {
    event.emitter.on(event.name, listener);

    return listener;
};

const unsubscribe = function (listener) {
    setImmediate(() => event.emitter.removeListener(event.name, listener));
};

const unsubscribeAll = function () {
    event.emitter.removeAllListeners(event.name);
}

module.exports = { createLogger, subscribe, unsubscribe, unsubscribeAll };
