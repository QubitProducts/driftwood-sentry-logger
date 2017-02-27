# driftwood-sentry-logger

A driftwood logger that reports logs to [sentry.io](sentry.io).


## Installation

### Logger

Augment your root drifwood logger with the sentry logger, giving it a DSN and some options:

```js
const createLogger = require('driftwood')
const createSentryLogger = require('driftwood-sentry-logger')

// Create the sentry logger as an additional logger to pass to driftwood
const additionalLoggers = [createSentryLogger({
  dsn: 'https://4092230b68absereg23tggdgd:b2430c23331a4452ac0dsgsdg323@sentry.io/12356'
})]

// Create driftwood, passing in the additional loggers
module.exports = createLogger('my-app', additionalLoggers)
```


## API

### `createSentryLogger({options})`

Creates the logger. `options` should can contain the following keys:

- `dsn` _(required)_: a valid sentry DSN
- `level: warn`: which log level and above should be reported to sentry
- `patchGlobal: false`: whether the sentry client should patch globals
- `levelMap: {}`: a mapping of driftwood log levels to sentry log levels
- `tags: {}`: additional tags to pass with each log message
- `extra: {}`: any data to pass to sentry's `extra` field
