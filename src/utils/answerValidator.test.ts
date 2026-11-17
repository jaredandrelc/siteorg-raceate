import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SUCCESS_MESSAGE,
  TARGET_EVENT_TITLE,
  validateEventTitle,
} from './answerValidator';

test('exact match returns success with requested congratulations message', () => {
  const res = validateEventTitle('Mission: Impossible - Race Against the Entity');
  assert.equal(res.isSuccess, true);
  assert.equal(res.summary, SUCCESS_MESSAGE);
  assert.equal(res.hints.length, 0);
});

test('empty or whitespace-only input fails with empty hint', () => {
  const emptyRes = validateEventTitle('');
  assert.equal(emptyRes.isSuccess, false);
  assert.ok(emptyRes.hints.some((h) => h.category === 'empty'));

  const spaceOnlyRes = validateEventTitle('   ');
  assert.equal(spaceOnlyRes.isSuccess, false);
  assert.ok(spaceOnlyRes.hints.some((h) => h.category === 'empty'));
});

test('wrong capitalization drops capitalization hint without leaking exact answer', () => {
  const allLower = validateEventTitle(TARGET_EVENT_TITLE.toLowerCase());
  assert.equal(allLower.isSuccess, false);
  assert.ok(allLower.hints.some((h) => h.category === 'capitalization'));
  assert.equal(allLower.hints[0].message.includes('the Entity'), false);

  const wrongThe = validateEventTitle(
    'Mission: Impossible - Race Against The Entity'
  );
  assert.equal(wrongThe.isSuccess, false);
  assert.ok(wrongThe.hints.some((h) => h.category === 'capitalization'));
});

test('leading, trailing, double, or missing spaces drop spacing hint', () => {
  const trailing = validateEventTitle(`${TARGET_EVENT_TITLE} `);
  assert.equal(trailing.isSuccess, false);
  assert.ok(trailing.hints.some((h) => h.category === 'spacing'));

  const doubleSpace = validateEventTitle(
    'Mission: Impossible -  Race Against the Entity'
  );
  assert.equal(doubleSpace.isSuccess, false);
  assert.ok(doubleSpace.hints.some((h) => h.category === 'spacing'));

  const missingSpaceAroundDash = validateEventTitle(
    'Mission: Impossible-Race Against the Entity'
  );
  assert.equal(missingSpaceAroundDash.isSuccess, false);
  assert.ok(missingSpaceAroundDash.hints.some((h) => h.category === 'spacing'));

  const missingSpaceAfterColon = validateEventTitle(
    'Mission:Impossible - Race Against the Entity'
  );
  assert.equal(missingSpaceAfterColon.isSuccess, false);
  assert.ok(missingSpaceAfterColon.hints.some((h) => h.category === 'spacing'));
});

test('missing or wrong symbols drop symbols hint', () => {
  const missingBoth = validateEventTitle(
    'Mission Impossible Race Against the Entity'
  );
  assert.equal(missingBoth.isSuccess, false);
  assert.ok(missingBoth.hints.some((h) => h.category === 'symbols'));

  const missingColon = validateEventTitle(
    'Mission Impossible - Race Against the Entity'
  );
  assert.equal(missingColon.isSuccess, false);
  assert.ok(missingColon.hints.some((h) => h.category === 'symbols'));

  const enDash = validateEventTitle(
    'Mission: Impossible – Race Against the Entity'
  );
  assert.equal(enDash.isSuccess, false);
  assert.ok(enDash.hints.some((h) => h.category === 'symbols'));
});

test('multiple simultaneous mistakes return multiple relevant hints', () => {
  const multi = validateEventTitle('mission impossible race against the entity');
  assert.equal(multi.isSuccess, false);
  const categories = multi.hints.map((h) => h.category);
  assert.ok(categories.includes('capitalization'));
  assert.ok(categories.includes('symbols'));
});

test('partial title triggers incomplete hint and near-typo triggers spelling hint', () => {
  const partial = validateEventTitle('Mission: Impossible');
  assert.equal(partial.isSuccess, false);
  assert.ok(partial.hints.some((h) => h.category === 'incomplete'));

  const typo = validateEventTitle(
    'Misssion: Impossible - Race Against the Entty'
  );
  assert.equal(typo.isSuccess, false);
  assert.ok(typo.hints.some((h) => h.category === 'spelling'));
});
