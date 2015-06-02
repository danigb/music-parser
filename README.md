# music-parser

[![Code Climate](https://codeclimate.com/github/danigb/music-parser/badges/gpa.svg)](https://codeclimate.com/github/danigb/music-parser)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Music notation parser. It takes an string and returns an array of objects with the form `{ value: '', position: 0, duration: 0}`. You can parse durations or measures or a combination of both:

```js
var parse = require('music-parser');
parse('c/4 d/4 e/8 f/8 f#/8 g/8');
parse('c/4+4 f/4 g/4 | c/4+4+4+4')
parse('Cm | Dm7b5 G7 | Am');
parse('(c d) (e f g a) | c/4 c#/8 d/8 (e f g)');
```

It is agnostic about the value of the object. It only take cares about the duration, either by explicit duration (using `/`) or by dividing the measure length between the number of events.

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

You can specify durations:

```js
var melody = parse('a2/4 b2/4 c#3/8 d3/8');
// [{ value: 'a2',  position: 0,      duration: 0.25 },
//  { value: 'b2',  position: 0.25,   duration: 0.25 },
//  { value: 'c#3', position: 0.5,    duration: 0.125 },
//  { value: 'd3',  position: 0.625,  duration: 0.125 }]
```

The duration can be expressed with numbers and dots (`"4."`, `"2.."`), with
letters and dots (`"q."`, `"w.."`) or names (`"quarter"`). See [note-duration](http://github.com/danigb/note-duration)

If the duration is not specified, and there's no measure separator, the default duration is 4. But if there are any measure separators, the duration is calculated by dividing the measure length by the number of items. You can use parenthesis to group items and write complex rhythmic structures:

```js
parse('a b c d |'); // duration: 0.25, 0.25, 0.25, 0.25
parse('a (b c)'); // durations: 0.5, 0.25, 0.25
parse('a b (c d e)'); // durations: q, q, qt, qt, qt
parse('(a _ _ b) (c d)') // durations: 0.375, 0.125, 0.25, 0.25
```

The `_` symbol extends the duration of the previous item:

```js
parser'Cm | _ ');
// [{ value: 'Cm', position: 0, duration: 2 }]
parse('c d _ e | f _ _ g');
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

It uses [note-duration](http://github.com/danigb/note-duration) to parse durations.

## License

MIT License
