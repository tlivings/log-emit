# log-emit

Global logging utility taking advantage of the process event emitter.

This utility is somewhat of a proof of concept of a global simple logging utility, the intent of
which is to be able to log and centrally capture such log events that they may then be filtered,
forwarded, or otherwise processed without relying on appropriate configuration throughout the code
base.

### API

Factory

- `createLogger(/* optional */ name)` - create a new logger with an optional name.
- `subscribe(listener)` - subscribe a listener to all log events; returns the listener.
- `unsubscribe(listener)` - unsubscribe a listener from all log events.
- `unsubscribeAll` - unsubscribe all listeners from all log events.

Logger

- `log(/* optional */ tags, data)` - emits a log event with two event parameters:
    - `meta` - containing `{ source, name, timestamp, tags }`.
    - `data` - any data passed to `log`.

Meta data in the event is as follows:

- `source` - the module name this logger is being called from.
- `name` - optional name of the logger passed to `createLogger`.
- `timestamp` - timestamp of this event.
- `tags` - optionally passed to the `log` function.

### Usage

```javascript
const Logging = require('log-emit');

const logger = Logging.createLogger(/* optional name */);

logger.log('debug', 'hello world.');
```

### Higher level example using RxJs to filter and format

```javascript
const logger = Logging.createLogger('test');

//Create a Rx observable publisher around the emitter.
const publisher = Rx.Observable.create((observer) => {
    const listener = Logging.subscribe(({ source, name, timestamp, tags }, data) => {
        observer.next({ source, name, timestamp, tags, data });
    });

    return function () {
        Logging.unsubscribe(listener);
    };
});

//Create a filtered and formatted event stream
const filterAndFormat = publisher.filter(
    ({ name, tags }) => {
        return name === 'test' && !!~tags.indexOf('debug'); //filter on name, module, tags, etc.
    }
).map(
    ({ source, name, timestamp, data }) => {
        return `${new Date(timestamp).toISOString()} ${source}.${name}: ${JSON.stringify(data)}`;
    }
);

const subscription = filterAndFormat.subscribe(
    (message) => {
        //Only name 'test' and tags with 'debug' will land here
        console.log(message);
    }
);

logger.log('debug', 'hello world');
logger.log('this will be ignored');

subscription.unsubscribe();
```
