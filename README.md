# music-parser

[![Code Climate](https://codeclimate.com/github/danigb/music-parser/badges/gpa.svg)](https://codeclimate.com/github/danigb/music-parser)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Parse musical measures with javascript. It takes strings in the form of `'A B | C D'` where `|` means measure separator, and the rest are events. It outputs an array of objects with `value`, `position` and `duration` values. This library is agnostic to the type of events, only cares about position and duration.

This is used by [ScoreJS](http://github.com/danigb/scorejs) to parse music.

## Installation

Install the npm module: `npm install --save music-parser`, and require the library:

```js
var parse = require('music-parser');
```

### Usage

You can parse a string separated by `|`...

```js
parse('Cm | D0 G7 | Cm');
// [{ value: 'Cm', position: 0,   duration: 1 },
//  { value: 'D0', position: 1,   duration: 0.5  },
//  { value: 'G7', position: 1.5, duration: 0.5  },
//  { value: 'Cm', position: 2,   duration: 1  }]
```
... or you can pass an array of measures:

```js
parse(['Cm', 'D7b5 G7', 'Cm'])
```

In the string version, the `|` is required. If not present it returns null. If you want to parse only one measure, add a `|` at the end:

```js
parse('a b'); // null
parse('a b |'); // one measure
```

The duration of each measure is divided by the number of items inside. You can use parenthesis to change the number of items. Almost all rhythmic structure
can be written:

```js
parse('a b c d |'); // duration: 0.25, 0.25, 0.25, 0.25
parse('a (b c)'); // durations: 0.5, 0.25, 0.25
parse('a b (c d e)'); // durations: q, q, qt, qt, qt
parse('(a / / b) (c d)') // durations: 0.375, 0.125, 0.25, 0.25
```

The `/` symbol extends the duration of the previous item:

```js
parse('Cm | / ');
// [{ value: 'Cm', position: 0, duration: 2 }]
parse('c d / e | f / / g');
// [{ value: 'c', position: 0,    duration: 0.25 }]
// [{ value: 'd', position: 0.25, duration: 0.50 }]
// [{ value: 'e', position: 0.75, duration: 0.25 }]
// [{ value: 'f', position: 1,    duration: 0.75 }]
// [{ value: 'g', position: 1.75, duration: 0.25 }]
```

You can specify other time signatures (it's 4/4 by default):

```js
parse('Cm | D0 G7 | Cm', '6/8');
parse('C | D / G | C', '3/4');
```

## Dependencies

It uses [time-meter](http://github.com/danigb/time-meter) to time signature operations.

## License

MIT License
