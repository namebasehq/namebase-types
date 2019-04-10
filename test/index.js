const assert = require('assert');
const { describe, it } = require('cafezinho');
const { INTEGER, STRING, BOOLEAN, ENUM, OBJECT, OR } = require('../src/index');

function expectException(f, exceptionName, key = null) {
  try {
    f();
    assert(false);
  } catch (e) {
    if (e.name !== exceptionName) throw e;
    if (e.key !== key) throw e;
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
      expectException(() => INTEGER(-1013.31), 'InvalidType');
    });

    it('should fail strings', () => {
      expectException(() => INTEGER('hello'), 'InvalidType');
    });

    it('should fail booleans', () => {
      expectException(() => INTEGER(true), 'InvalidType');
    });

    it('should fail undefined', () => {
      expectException(() => INTEGER(undefined), 'InvalidType');
    });

    it('should fail null', () => {
      expectException(() => INTEGER(null), 'InvalidType');
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
      expectException(() => STRING(10), 'InvalidType');
    });

    it('should fail booleans', () => {
      expectException(() => STRING(false), 'InvalidType');
    });

    it('should fail undefined', () => {
      expectException(() => STRING(undefined), 'InvalidType');
    });

    it('should fail null', () => {
      expectException(() => STRING(null), 'InvalidType');
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
      expectException(() => BOOLEAN(10), 'InvalidType');
    });

    it('should fail zero', () => {
      expectException(() => BOOLEAN(0), 'InvalidType');
    });

    it('should fail strings', () => {
      expectException(() => BOOLEAN('hello'), 'InvalidType');
    });

    it('should fail empty strings', () => {
      expectException(() => BOOLEAN(''), 'InvalidType');
    });

    it('should fail undefined', () => {
      expectException(() => BOOLEAN(undefined), 'InvalidType');
    });

    it('should fail null', () => {
      expectException(() => BOOLEAN(null), 'InvalidType');
    });
  });

  describe('.ENUM(...values)', () => {
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

  describe('.OBJECT(template)', () => {
    it('should pass a simple template with mixed types', () => {
      const check = OBJECT({
        a: STRING,
        b: INTEGER,
        c: BOOLEAN,
        d: ENUM(100, 200, 300),
      });
      assert(check({ a: 'hello', b: 10, c: true, d: 200 }));
    });

    it('should pass a deeply nested template', () => {
      const check = OBJECT({
        a: INTEGER,
        b: OBJECT({
          c: INTEGER,
          d: OBJECT({
            e: INTEGER,
          }),
        }),
      });
      assert(
        check({
          a: 10,
          b: {
            c: 11,
            d: {
              e: 12,
            },
          },
        })
      );
    });

    it('should fail a simple template with the right keys but wrong types', () => {
      const check = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          check({ a: 'hello', b: 'goodbye' });
        },
        'InvalidType',
        'b'
      );
    });

    it('should fail a simple template with a missing key', () => {
      const check = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          check({ a: 'hello' });
        },
        'MissingKey',
        'b'
      );
    });

    it('should fail a simple template with an extra key', () => {
      const check = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          check({ a: 'hello', b: 10, c: true });
        },
        'ExtraKey',
        'c'
      );
    });

    it('should report missing keys before extra keys', () => {
      const check = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          check({ a: 'hello', c: true });
        },
        'MissingKey',
        'b'
      );
    });

    it('should check nested objects for object-ness', () => {
      const check = OBJECT({
        a: INTEGER,
        b: OBJECT({
          c: INTEGER,
          d: OBJECT({
            e: INTEGER,
          }),
        }),
      });
      expectException(
        () => {
          check({
            a: 10,
            b: {
              c: 11,
              d: false,
            },
          });
        },
        'InvalidType',
        'd'
      );
    });

    it('should fail nested missing keys', () => {
      const check = OBJECT({
        a: INTEGER,
        b: OBJECT({
          c: INTEGER,
          d: OBJECT({
            e: INTEGER,
          }),
        }),
      });
      expectException(
        () => {
          check({
            a: 10,
            b: {
              c: 11,
              d: {},
            },
          });
        },
        'MissingKey',
        'e'
      );
    });
  });

  describe('.OR(...options)', () => {
    it('should pass primitive ORs', () => {
      assert(OR(STRING, INTEGER)(100));
      assert(OR(STRING, BOOLEAN)(false));
      assert(OR(ENUM(100, 200, 300), STRING)(200));
      assert(OR(ENUM(100, 200, 300), STRING)(''));
    });

    it('should pass object ORs', () => {
      const check = OR(OBJECT({ a: STRING }), OBJECT({ b: INTEGER }));
      assert(check({ a: 'hey' }));
      assert(check({ b: 20 }));
    });

    it('should fail primitive ORs', () => {
      expectException(() => OR(STRING, INTEGER)(true), 'InvalidType');
    });

    it('should fail and report missing keys before extra keys', () => {
      const check = OR(
        OBJECT({ a: STRING, b: STRING, d: STRING }),
        OBJECT({ a: STRING, c: STRING })
      );
      const value = { a: 'hello', b: 'goodbye' };
      expectException(() => check(value), 'MissingKey', 'd');
    });

    it('should fail and report invalid types before extra keys', () => {
      const check = OR(
        OBJECT({ a: STRING, b: STRING }),
        OBJECT({ a: STRING, b: STRING, c: STRING })
      );
      const value = { a: 'hello', b: 100, d: 'goodbye' };
      expectException(() => check(value), 'InvalidType', 'b');
    });
  });
});
