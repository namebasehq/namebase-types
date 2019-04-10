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
      assert(INTEGER(-10) === -10);
    });

    it('should pass zero', () => {
      assert(INTEGER(0) === 0);
    });

    it('should pass positive integers', () => {
      assert(INTEGER(101012013) === 101012013);
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
      assert(STRING('hello') === 'hello');
    });

    it('should pass the empty string', () => {
      assert(STRING('') === '');
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
      assert(BOOLEAN(true) === true);
    });

    it('should pass false', () => {
      assert(BOOLEAN(false) === false);
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
      const parse = ENUM(10, 20, 30);
      assert(parse(30) === 30);
    });

    it('should pass a string for a string enum', () => {
      const parse = ENUM('hello', 'goodbye', 'dice');
      assert(parse('goodbye') === 'goodbye');
    });

    it('should pass a boolean in a mixed enum', () => {
      const parse = ENUM('string cheese', false);
      assert(parse(false) === false);
    });

    it('should pass null when the enum allows it', () => {
      const parse = ENUM('string cheese', false, null);
      assert(parse(null) === null);
    });

    it('should fail when the value is missing with the right error', () => {
      try {
        const parse = ENUM('string cheese', false, 501);
        parse('what');
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
      const parse = OBJECT({
        a: STRING,
        b: INTEGER,
        c: BOOLEAN,
        d: ENUM(100, 200, 300),
      });
      const parsedX = parse({ a: 'hello', b: 10, c: true, d: 200 });
      assert(Object.keys(parsedX).length === 4);
      assert(parsedX.a === 'hello');
      assert(parsedX.b === 10);
      assert(parsedX.c === true);
      assert(parsedX.d === 200);
    });

    it('should pass a deeply nested template', () => {
      const parse = OBJECT({
        a: INTEGER,
        b: OBJECT({
          c: INTEGER,
          d: OBJECT({
            e: INTEGER,
          }),
        }),
      });
      const parsedX = parse({
        a: 10,
        b: {
          c: 11,
          d: {
            e: 12,
          },
        },
      });
      assert(Object.keys(parsedX).length === 2);
      assert(parsedX.a === 10);
      assert(Object.keys(parsedX.b).length === 2);
      assert(parsedX.b.c === 11);
      assert(Object.keys(parsedX.b.d).length === 1);
      assert(parsedX.b.d.e === 12);
    });

    it('should fail a simple template with the right keys but wrong types', () => {
      const parse = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          parse({ a: 'hello', b: 'goodbye' });
        },
        'InvalidType',
        'b'
      );
    });

    it('should fail a simple template with a missing key', () => {
      const parse = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          parse({ a: 'hello' });
        },
        'MissingKey',
        'b'
      );
    });

    it('should fail a simple template with an extra key', () => {
      const parse = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          parse({ a: 'hello', b: 10, c: true });
        },
        'ExtraKey',
        'c'
      );
    });

    it('should report missing keys before extra keys', () => {
      const parse = OBJECT({
        a: STRING,
        b: INTEGER,
      });
      expectException(
        () => {
          parse({ a: 'hello', c: true });
        },
        'MissingKey',
        'b'
      );
    });

    it('should check nested objects for object-ness', () => {
      const parse = OBJECT({
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
          parse({
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
      const parse = OBJECT({
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
          parse({
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
      assert(OR(STRING, INTEGER)(100) === 100);
      assert(OR(STRING, BOOLEAN)(false) === false);
      assert(OR(ENUM(100, 200, 300), STRING)(200) === 200);
      assert(OR(ENUM(100, 200, 300), STRING)('') === '');
    });

    it('should pass object ORs', () => {
      const parse = OR(OBJECT({ a: STRING }), OBJECT({ b: INTEGER }));

      const parsedX = parse({ a: 'hey' });
      assert(Object.keys(parsedX).length === 1);
      assert(parsedX.a === 'hey');

      const parsedY = parse({ b: 20 });
      assert(Object.keys(parsedY).length === 1);
      assert(parsedY.b === 20);
    });

    it('should fail primitive ORs', () => {
      expectException(() => OR(STRING, INTEGER)(true), 'InvalidType');
    });

    it('should fail and report missing keys before extra keys', () => {
      const parse = OR(
        OBJECT({ a: STRING, b: STRING, d: STRING }),
        OBJECT({ a: STRING, c: STRING })
      );
      const value = { a: 'hello', b: 'goodbye' };
      expectException(() => parse(value), 'MissingKey', 'd');
    });

    it('should fail and report invalid types before extra keys', () => {
      const parse = OR(
        OBJECT({ a: STRING, b: STRING }),
        OBJECT({ a: STRING, b: STRING, c: STRING })
      );
      const value = { a: 'hello', b: 100, d: 'goodbye' };
      expectException(() => parse(value), 'InvalidType', 'b');
    });
  });
});
