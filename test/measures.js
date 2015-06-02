'use strict'
var vows = require('vows')
var assert = require('assert')
var _ = require('lodash')

var parse = require('../')

vows.describe('Parse measures').addBatch({
  'parse measure': function () {
    var s = parse('a b |')
    assert.equal(s.length, 2)
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b'])
    assert.deepEqual(_.pluck(s, 'duration'), [0.5, 0.5])
    assert.deepEqual(_.pluck(s, 'position'), [0, 0.5])
  },
  'extend time': function () {
    var s = parse('A | _')
    assert.equal(s.length, 1)
    assert.deepEqual(s[0], { value: 'A', position: 0, duration: 2 })
  },
  'change key by string': function () {
    var s = parse('a |', '3/4')
    assert.deepEqual(s[0], { value: 'a', position: 0, duration: 0.75 })
    s = parse('b |', '6/8')
    assert.deepEqual(s[0], { value: 'b', position: 0, duration: 0.75 })
  },
  'parse 4/4 measures': function () {
    var s = parse('a | b ')
    assert.equal(s.length, 2)
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b'])
    assert.deepEqual(_.pluck(s, 'position'), [0, 1])
    assert.deepEqual(_.pluck(s, 'duration'), [1, 1])
    s = parse('a | b b')
    assert.equal(s.length, 3)
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b', 'b'])
    assert.deepEqual(_.pluck(s, 'position'), [0, 1, 1.5])
    assert.deepEqual(_.pluck(s, 'duration'), [1, 0.5, 0.5])
    s = parse('a | b b b b')
    assert.equal(s.length, 5)
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b', 'b', 'b', 'b'])
    assert.deepEqual(_.pluck(s, 'position'), [ 0, 1, 1.25, 1.5, 1.75])
    assert.deepEqual(_.pluck(s, 'duration'), [1, 0.25, 0.25, 0.25, 0.25])
  },
  'parse 3/4 measures': function () {
    var s = parse('a b c |', '3/4')
    assert.equal(s.length, 3)
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b', 'c'])
    assert.deepEqual(_.pluck(s, 'position'), [ 0, 0.25, 0.5 ])
    assert.deepEqual(_.pluck(s, 'duration'), [0.25, 0.25, 0.25])
    s = parse('a b |', '3/4')
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b'])
    assert.deepEqual(_.pluck(s, 'position'), [ 0, 0.375 ])
    assert.deepEqual(_.pluck(s, 'duration'), [0.375, 0.375])
  },
  'parse 6/8 measures': function () {
    var s = parse('| a b', '6/8')
    assert.equal(s.length, 2)
    assert.deepEqual(_.pluck(s, 'value'), ['a', 'b'])
    assert.deepEqual(_.pluck(s, 'position'), [ 0, 0.375 ])
    assert.deepEqual(_.pluck(s, 'duration'), [0.375, 0.375])
  }
}).export(module)
