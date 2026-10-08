import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSamplesByGenre, filterSamplesBySearch } from './sampleFilters.ts';

const samples = [
  { id: 0, title: 'Heavy Break', genre: 'Rock', seller: 'GROCKSELLER' },
  { id: 1, title: 'Blue Notes', genre: 'jazz', seller: 'GJAZZSELLER' },
  { id: 2, title: 'Deep Rock', genre: 'ROCK', seller: 'GOTHER' },
];

test('concrete genre matches only the case-insensitive genre', () => {
  assert.deepEqual(filterSamplesByGenre(samples, 'rock').map(s => s.id), [0, 2]);
  assert.deepEqual(filterSamplesByGenre(samples, 'hip-hop'), []);
});
test('all and empty routes preserve every sample', () => {
  assert.deepEqual(filterSamplesByGenre(samples, 'ALL'), samples);
  assert.deepEqual(filterSamplesByGenre(samples, undefined), samples);
});
test('search matches title or seller, case-insensitively', () => {
  assert.deepEqual(filterSamplesBySearch(samples, 'blue').map(s => s.id), [1]);
  assert.deepEqual(filterSamplesBySearch(samples, 'grockseller').map(s => s.id), [0]);
});
test('search no-match creates the expected empty result', () => {
  assert.deepEqual(filterSamplesBySearch(samples, '  MISSING  '), []);
  assert.deepEqual(filterSamplesBySearch(samples, '   '), samples);
});
