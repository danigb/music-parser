'use strict'

var TimeMeter = require('time-meter')
var noteDuration = require('note-duration')

/*
 * parseMeasures
 *
 * @params {String} measures - the string measures to be parsed
 * @params {String} time - the time signature (4/4 by default)
 * @returns {Array} - an array of obects with value and expectedDur
 */
module.exports = function (measures, time, options) {
  if (Array.isArray(measures)) {
    return measures
  } else if (typeof measures !== 'string') {
    throw Error('String or Array expected in melody-parser')
  }

  if (typeof time !== 'string') {
    options = time
    time = null
  }

  var opts = {}
  options = options || {}
  opts.durationParser = options.durationParser || parseDuration
  opts.forceDurations = options.forceDurations || /[|()]/.test(measures)
  opts.extendSymbol = options.extendSymbol || '_'

  time = time || '4/4'
  var meter = TimeMeter(time)
  return parseMeasures(meter, measures, opts)
}

function parseMeasures (meter, measures, options) {
  var events = []
  var position = 0
  var expectedDur = options.forceDurations ? meter.measure : -1

  splitMeasures(measures).forEach(function (measure) {
    var list = parenthesize(tokenize(measure), [])
    position = parseList(events, list, position, expectedDur, options)
  })
  return events
}

function parseList (events, list, position, total, options) {
  var expectedDur = total / list.length
  list.forEach(function (item) {
    if (Array.isArray(item)) {
      position = parseList(events, item, position, expectedDur, options)
    } else {
      position = parseItem(events, item, position, expectedDur, options)
    }
  })
  return position
}

function parseItem (events, item, position, expectedDur, options) {
  var parsed = options.durationParser(item, expectedDur)
  var event = parsed ?
    { value: parsed[0], position: position, duration: parsed[1]} :
    { value: item, position: position, duration: expectedDur}

  var rounded = Math.floor(event.position * 10 + 0.001)
  if (Math.floor(event.position * 10) !== rounded) {
    event.position = rounded / 10
  }

  if (event.value === options.extendSymbol) {
    var last = events[events.length - 1]
    last.duration += event.duration
  } else {
    events.push(event)
  }
  return event.position + event.duration
}

function parseDuration (item, expectedDur) {
  var split = item.split('/')
  var dur = calcDuration(split[1])
  if (dur) return [split[0], dur]
  else if (expectedDur > 0) return [item, expectedDur]
  else return [item, 0.25]
}

function calcDuration (string) {
  if (!string) return null
  var duration = string.split('+').map(function (durString) {
    return noteDuration(durString)
  }).reduce(function (a, b) {
    return a + b
  }, 0)
  return (duration === +duration) ? duration : null
}

function splitMeasures (repr) {
  return repr
    .replace(/\s+\||\|\s+/, '|') // spaces between |
    .replace(/^\||\|\s*$/g, '') // first and last |
    .split('|')
}

/*
 * The following code is copied from https://github.com/maryrosecook/littlelisp
 * See: http://maryrosecook.com/blog/post/little-lisp-interpreter
 * Thanks Mary Rose Cook!
 */
var parenthesize = function (input, list) {
  var token = input.shift()
  if (token === undefined) {
    return list
  } else if (token === '(') {
    list.push(parenthesize(input, []))
    return parenthesize(input, list)
  } else if (token === ')') {
    return list
  } else {
    return parenthesize(input, list.concat(token))
  }
}

var tokenize = function (input) {
  return input
    .replace(/[\(]/g, ' ( ')
    .replace(/[\)]/g, ' ) ')
    .replace(/\,/g, ' ')
    .trim().split(/\s+/)
}
