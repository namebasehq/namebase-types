const assert = require('assert');
const { describe, it } = require('cafezinho');
const { integer, string, bool } = require('../src/index');

function expectException(exceptionName, f) {
  try {
    f();
    assert(false);
  } catch (e) {
    if (e.name !== exceptionName) throw e;
  }
}

describe('namebase-types', () => {
  describe('integer()', () => {
    it('should pass negative integers', () => {
      assert(integer()(-10));
    });

    it('should pass zero', () => {
      assert(integer()(0));
    });

    it('should pass positive integers', () => {
      assert(integer()(101012013));
    });

    it('should fail floats', () => {
      expectException('InvalidType', () => integer()(-1013.31));
    });

    it('should fail strings', () => {
      expectException('InvalidType', () => integer()('hello'));
    });

    it('should fail booleans', () => {
      expectException('InvalidType', () => integer()(true));
    });

    it('should fail undefined', () => {
      expectException('InvalidType', () => integer()(undefined));
    });

    it('should fail null', () => {
      expectException('InvalidType', () => integer()(null));
    });
  });

  describe('string()', () => {
    it('should pass nonempty strings', () => {
      assert(string()('hello'));
    });

    it('should pass the empty string', () => {
      assert(string()(''));
    });

    it('should fail integers', () => {
      expectException('InvalidType', () => string()(10));
    });

    it('should fail booleans', () => {
      expectException('InvalidType', () => string()(false));
    });

    it('should fail undefined', () => {
      expectException('InvalidType', () => string()(undefined));
    });

    it('should fail null', () => {
      expectException('InvalidType', () => string()(null));
    });
  });

  describe('bool()', () => {
    it('should pass true', () => {
      assert(bool()(true));
    });

    it('should pass false', () => {
      assert(bool()(false));
    });

    it('should fail positive integers', () => {
      expectException('InvalidType', () => bool()(10));
    });

    it('should fail zero', () => {
      expectException('InvalidType', () => bool()(0));
    });

    it('should fail strings', () => {
      expectException('InvalidType', () => bool()('hello'));
    });

    it('should fail empty strings', () => {
      expectException('InvalidType', () => bool()(''));
    });

    it('should fail undefined', () => {
      expectException('InvalidType', () => bool()(undefined));
    });

    it('should fail null', () => {
      expectException('InvalidType', () => bool()(null));
    });
  });
});
