'use strict';

const Rx = require('rxjs');
const Callermodule = require('callermodule');
const Individual = require('individual');

class LogSubject extends Rx.Subject {
    createLogger(name = '') {
        const source = Callermodule().name;

        return {
            log: (...args /* ...tags, data */) => {
                const timestamp = Date.now();
                const tags = args.length > 1 ? args.slice(0, args.length - 1) : [];
                const data = args[args.length - 1];;

                this._next({ source, name, timestamp, tags, data });
            }
        };
    }

    _next(x) {
        super.next(x);
    }

    next() {
        //no op
    }

    error() {
        //no op
    }

    complete() {
        //no op
    }
}

module.exports = Individual('__rxlogstream', new LogSubject());
