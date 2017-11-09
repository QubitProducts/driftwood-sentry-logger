var raven = require('raven')
var LEVELS = require('driftwood').LEVELS

module.exports = function createSentryLogger (options) {
  var defaults = {
    dsn: '',
    patchGlobal: false,
    level: 'warn',
    levelMap: {
      trace: 'debug',
      debug: 'debug',
      info: 'info',
      warn: 'warning',
      error: 'error'
    },
    tags: {},
    extra: {}
  }

  if (!options.raven && !options.dsn) {
    throw new Error('`dsn` or `raven` options required')
  }

  options = Object.assign(defaults, options)

  var sentry = options.raven || new raven.Client(options.dsn, options)

  if (options.patchGlobal) {
    sentry.patchGlobal()
  }

  sentry.on('error', function (error) {
    var message = 'Cannot talk to sentry.'
    if (error && error.reason) {
      message += ' Reason: ' + error.reason
    }
    console.log(message)
  })

  sentryLogger.sentry = sentry
  return sentryLogger

  function sentryLogger (name, level, now, components) {
    if (LEVELS.INDEX[level] < LEVELS.INDEX[options.level]) {
      return
    }

    const extra = {
      level: options.levelMap[level],
      extra: components.metadata
    }

    const msg = '[' + name + ']: ' + components.message

    try {
      if (components.error || level === 'error') {
        sentry.captureException(components.error || msg, extra)
      } else {
        sentry.captureMessage(msg, extra)
      }
    } catch (e) {
      console.error(e)
    }
  }
}
