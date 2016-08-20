
### Example using RxJs to filter and format

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
    }
);

logger.log('debug', 'hello world');
logger.log('this will be ignored');

subscription.unsubscribe();
```
