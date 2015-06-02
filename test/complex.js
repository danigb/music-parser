'use strict'
var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var parse = require('../')

vows.describe('Music parser').addBatch({
  'round positions': function () {
    // var s = parse('(c d) (e f g a) | c/4 c#/8 d/8 (e f g)')
    // assert.deepEqual(_.pluck(s, 'duration'), [])
    var s = parse('a+/2+4 bb+/4 a+/4 bb+/8t a+/8t bb+/8t a+/4 a+/8 bb+/8 g+/8')
    assert.deepEqual(_.pluck(s, 'position'), [0,
      0.75,
      1,
      1.25,
      1.3333333333333333,
      1.4166666666666665,
      1.5,
      1.75,
      1.875,
      2])
  },
}).export(module)
