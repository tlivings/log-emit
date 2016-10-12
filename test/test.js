'use strict';

const Test = require('tape');
const Logging = require('../lib');
const Util = require('util');

Test('logger', (t) => {

    t.test('subscribe and log', (t) => {
        t.plan(5);

        const logger = Logging.createLogger('test-subscribe');

        const subscription = logger.observe().subscribe(
            ({ source, name, timestamp, tags, data }) => {
                t.equal(source, 'log-emit', 'source is correct.');
                t.equal(name, 'test-subscribe', 'name is correct.');
                t.ok(Util.isNumber(timestamp), 'timestamp is a number.');
                t.ok(Util.isArray(tags), 'tags is an array.');
                t.equal(data, 'hello world', 'data is correct.');
            }
        );

        logger.log('hello world');

        subscription.unsubscribe();
    });

    t.test('random perf', (t) => {
        const logger = Logging.createLogger('test-performance');

        const subscription = Logging.observe().subscribe(
            ({ data }) => {
                if (data === 10000) {
                    console.timeEnd('log');
                    t.end();
                }
            }
        );

        console.time('log');
        for (let i = 0; i <= 10000; ++i) {
            logger.log('test', i);
        }
        subscription.unsubscribe();
    });

});
