'use strict';

const Rx = require('rxjs');
const PassThrough = require('stream').PassThrough;
const Callermodule = require('callermodule');
const Individual = require('individual');

class LogObservable extends Rx.Observable {
    constructor(stream) {
        super((observer) => {
            const onReadable = () => {
                let chunk;

                while ((chunk = this._stream.read()) !== null) {
                    observer.next(chunk);
                }
            };

            const onEnd = () => {
                observer.complete();
            };

            const onError = (error) => {
                observer.error(error);
            };

            this._stream.on('readable', onReadable);
            this._stream.on('error', onError);
            this._stream.on('end', onEnd);

            return () => {
                this._stream.removeListener('readable', onReadable);
                this._stream.removeListener('end', onEnd);
                this._stream.removeListener('error', onError);
            };
        });

        this._stream = stream;
    }

    createLogger(name = '') {
        const source = Callermodule().name;
        const stream = this._stream;

        return {
            log(...args /* ...tags, data */) {
                const timestamp = Date.now();
                const tags = args.length > 1 ? args.slice(0, args.length - 1) : [];
                const data = args[args.length - 1];

                stream.write({ source, name, timestamp, tags, data });
            }
        };
    }
}

module.exports = Individual('__rxlogstream', new LogObservable(new PassThrough({ objectMode: true })));
