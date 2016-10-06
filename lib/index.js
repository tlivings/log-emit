'use strict';

const Rx = require('rxjs');
const Callermodule = require('callermodule');
const Individual = require('individual');
const Util = require('util');
const Joi = require('joi');

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

    next(x) {
        Joi.validate(x, LogSubject._schema, (error, value) => {
            if (error) {
                value = { source: 'joi', name: '', timestamp: Date.now(), tags: ['error'], data: error };
            }
            super.next(value);
        });
    }
}

LogSubject._schema = Joi.object().keys({
    source: Joi.string(),
    name: Joi.string(),
    timestamp: Joi.number(),
    tags: Joi.array(),
    data: Joi.any()
});

module.exports = Individual('__rxlogstream', new LogSubject());
