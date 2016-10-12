'use strict';

const Rx = require('rxjs');
const Callermodule = require('callermodule');
const Individual = require('individual');

const logStream = Individual('__rxlogstream', new Rx.Subject());

const createLogger = function (name = '') {
    const source = Callermodule().name;

    return {
        log(...args /* ...tags, data */) {
            const timestamp = Date.now();
            const tags = args.length > 1 ? args.slice(0, args.length - 1) : [];
            const data = args[args.length - 1];;

            logStream.next({ source, name, timestamp, tags, data });
        },

        observe() {
            return logStream.share().filter((x) => x.name === name && x.source === source);
        }
    };
};

const observe = function () {
    return logStream.share();
};

module.exports = { createLogger, observe };
