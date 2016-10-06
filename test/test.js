'use strict';

const Test = require('tape');
const Logging = require('../lib');
const Util = require('util');

Test('logger', (t) => {

    t.test('subscribe and log', (t) => {
        t.plan(5);

        const logger = Logging.createLogger('test-subscribe');

        const subscription = Logging.subscribe(
            ({ source, name, timestamp, tags, data }) => {
                t.equal(source, 'log-emit', 'source is correct.');
                t.equal(name, 'test-subscribe', 'name is correct.');
                t.ok(Util.isNumber(timestamp), 'timestamp is a number.');
                t.ok(Util.isArray(tags), 'tags is an array.');
                t.equal(data, 'hello world', 'data is correct.');
            }
        );

        t.once('end', () => subscription.unsubscribe());

        logger.log('hello world');
    });

    t.test('random perf', (t) => {
        const logger = Logging.createLogger('test-performance');

        const subscription = Logging.map(({data}) => data).subscribe(
            (count) => {
                if (count === 10000) {
                    console.timeEnd('log');
                    t.end();
                }
            }
        );

        t.once('end', () => subscription.unsubscribe());

        console.time('log');
        for (let i = 0; i <= 10000; ++i) {
            logger.log('test', i);
        }
    });

});
