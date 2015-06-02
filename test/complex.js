'use strict'
var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var parse = require('../')

vows.describe('Music parser').addBatch({
  'mix durations and parenthesis': function () {
    var s = parse('(c d) (e f g a) | c/4 c#/8 d/8 (e f g)')
    assert.deepEqual(_.pluck(s, 'duration'), [])
  }
}).export(module)
