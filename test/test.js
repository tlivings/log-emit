'use strict';

const Test = require('tape');
const Logging = require('../lib');
const Util = require('util');

Test('logger', (t) => {

    t.test('create', (t) => {
        t.plan(2);

        const logger = Logging.createLogger('test');

        t.ok(Util.isObject(logger), 'returned object.');
        t.ok(Util.isFunction(logger.log), 'has log function.');
    });

    t.test('subscribe and unsubscribe', (t) => {
        t.plan(6);

        let logged = 0;

        const logger = Logging.createLogger('test-subscribe');

        const listener = ({ source, name, timestamp, tags, data }) => {
            t.equal(source, 'log-emit', 'source is correct.');
            t.equal(name, 'test-subscribe', 'name is correct.');
            t.ok(Util.isNumber(timestamp), 'timestamp is a number.');
            t.ok(Util.isArray(tags), 'tags is an array.');
            t.equal(data, 'hello world', 'data is correct.');
        };

        Logging.subscribe(listener);

        logger.log('hello world');

        Logging.unsubscribe(listener);

        logger.log('hello world');

        t.equal(logged, 0, 'did not log again.');
    });

    t.test('unsubscribeAll', (t) => {
        t.plan(1);

        let logged = 0;

        const logger = Logging.createLogger('test-unsubscribeAll');

        Logging.subscribe(({ source, name, timestamp, tags, data }) => {
            ++logged;
        });

        Logging.unsubscribeAll();

        logger.log('hello world');

        t.equal(logged, 0, 'did not log.');
    });

});
