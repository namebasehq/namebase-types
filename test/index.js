const assert = require('assert');
const { describe, it } = require('cafezinho');
const { INTEGER, STRING, BOOLEAN, ENUM } = require('../src/index');

function expectException(exceptionName, f) {
  try {
    f();
    assert(false);
  } catch (e) {
    if (e.name !== exceptionName) throw e;
  }
}

describe('namebase-types', () => {
  describe('.INTEGER', () => {
    it('should pass negative integers', () => {
      assert(INTEGER(-10));
    });

    it('should pass zero', () => {
      assert(INTEGER(0));
    });

    it('should pass positive integers', () => {
      assert(INTEGER(101012013));
    });

    it('should fail floats', () => {
      expectException('InvalidType', () => INTEGER(-1013.31));
    });

    it('should fail strings', () => {
      expectException('InvalidType', () => INTEGER('hello'));
    });

    it('should fail booleans', () => {
      expectException('InvalidType', () => INTEGER(true));
    });

    it('should fail undefined', () => {
      expectException('InvalidType', () => INTEGER(undefined));
    });

    it('should fail null', () => {
      expectException('InvalidType', () => INTEGER(null));
    });
  });

  describe('.STRING', () => {
    it('should pass nonempty strings', () => {
      assert(STRING('hello'));
    });

    it('should pass the empty string', () => {
      assert(STRING(''));
    });

    it('should fail integers', () => {
      expectException('InvalidType', () => STRING(10));
    });

    it('should fail booleans', () => {
      expectException('InvalidType', () => STRING(false));
    });

    it('should fail undefined', () => {
      expectException('InvalidType', () => STRING(undefined));
    });

    it('should fail null', () => {
      expectException('InvalidType', () => STRING(null));
    });
  });

  describe('.BOOLEAN', () => {
    it('should pass true', () => {
      assert(BOOLEAN(true));
    });

    it('should pass false', () => {
      assert(BOOLEAN(false));
    });

    it('should fail positive integers', () => {
      expectException('InvalidType', () => BOOLEAN(10));
    });

    it('should fail zero', () => {
      expectException('InvalidType', () => BOOLEAN(0));
    });

    it('should fail strings', () => {
      expectException('InvalidType', () => BOOLEAN('hello'));
    });

    it('should fail empty strings', () => {
      expectException('InvalidType', () => BOOLEAN(''));
    });

    it('should fail undefined', () => {
      expectException('InvalidType', () => BOOLEAN(undefined));
    });

    it('should fail null', () => {
      expectException('InvalidType', () => BOOLEAN(null));
    });
  });

  describe('.ENUM(values)', () => {
    it('should pass an integer for an int enum', () => {
      const check = ENUM(10, 20, 30);
      assert(check(30));
    });

    it('should pass a string for a string enum', () => {
      const check = ENUM('hello', 'goodbye', 'dice');
      assert(check('goodbye'));
    });

    it('should pass a boolean in a mixed enum', () => {
      const check = ENUM('string cheese', false);
      assert(check(false));
    });

    it('should pass null when the enum allows it', () => {
      const check = ENUM('string cheese', false, null);
      assert(check(null));
    });

    it('should fail when the value is missing with the right error', () => {
      try {
        const check = ENUM('string cheese', false, 501);
        check('what');
        assert(false);
      } catch (e) {
        if (e.name !== 'NotInEnum') throw e;
        if (e.values.length !== 3) throw e;
        if (e.values[0] !== 'string cheese') throw e;
        if (e.values[1] !== false) throw e;
        if (e.values[2] !== 501) throw e;
      }
    });
  });
});
