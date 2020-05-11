const assert = require('assert');
const { describe, it } = require('cafezinho');
const {
  ARRAY,
  BOOLEAN,
  BOOLEAN_STRING,
  ENUM,
  INEXACT_OBJECT,
  INTEGER,
  INTEGER_STRING,
  NUMERIC,
  OBJECT,
  OPTIONAL,
  OR,
  STRING,
} = require('../src/index');

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

  describe('.INTEGER_STRING', () => {
    it('should pass negative integer strings', () => {
      assert(INTEGER_STRING('-10') === -10);
    });

    it('should pass zero strings', () => {
      assert(INTEGER_STRING('0') === 0);
    });

    it('should pass positive integer strings', () => {
      assert(INTEGER_STRING('101012013') === 101012013);
    });

    it('should fail actual integers', () => {
      expectException(() => INTEGER_STRING(1000), 'InvalidType');
    });

    it('should fail float strings', () => {
      expectException(() => INTEGER_STRING('-1013.31'), 'InvalidType');
    });

    it('should fail strings', () => {
      expectException(() => INTEGER_STRING('hello'), 'InvalidType');
    });

    it('should fail booleans', () => {
      expectException(() => INTEGER_STRING(true), 'InvalidType');
    });

    it('should fail string booleans', () => {
      expectException(() => INTEGER_STRING('true'), 'InvalidType');
    });

    it('should fail undefined', () => {
      expectException(() => INTEGER_STRING(undefined), 'InvalidType');
    });

    it('should fail null', () => {
      expectException(() => INTEGER_STRING(null), 'InvalidType');
    });
  });

  describe('.NUMERIC', () => {
    it('should pass negative integers', () => {
      assert(NUMERIC(-10) === -10);
    });

    it('should pass zero', () => {
      assert(NUMERIC(0) === 0);
    });

    it('should pass positive integers', () => {
      assert(NUMERIC(101012013) === 101012013);
    });

    it('should pass floats', () => {
      assert(NUMERIC(10.123) === 10.123);
    });

    it('should pass negative floats', () => {
      assert(NUMERIC(-10.123) === -10.123);
    });

    it('should fail strings', () => {
      expectException(() => NUMERIC('hello'), 'InvalidType');
    });

    it('should fail booleans', () => {
      expectException(() => NUMERIC(true), 'InvalidType');
    });

    it('should fail undefined', () => {
      expectException(() => NUMERIC(undefined), 'InvalidType');
    });

    it('should fail null', () => {
      expectException(() => NUMERIC(null), 'InvalidType');
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

  describe('.BOOLEAN_STRING', () => {
    it('should pass true strings', () => {
      assert(BOOLEAN_STRING('true') === true);
    });

    it('should pass false strings', () => {
      assert(BOOLEAN_STRING('false') === false);
    });

    it('should fail integers', () => {
      expectException(() => BOOLEAN_STRING(1000), 'InvalidType');
    });

    it('should fail actual booleans', () => {
      expectException(() => BOOLEAN_STRING(false), 'InvalidType');
    });

    it('should fail strings', () => {
      expectException(() => BOOLEAN_STRING('hello'), 'InvalidType');
    });

    it('should fail undefined', () => {
      expectException(() => BOOLEAN_STRING(undefined), 'InvalidType');
    });

    it('should fail null', () => {
      expectException(() => BOOLEAN_STRING(null), 'InvalidType');
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

  // Tests specific to OBJECT
  describe('.OBJECT(template)', () => {
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
  });

  // Tests shared with OBJECT and INEXACT_OBJECT
  describe('.OBJECT(template) and .INEXACT_OBJECT(template)', () => {
    [OBJECT, INEXACT_OBJECT].forEach((PRIMITIVE) => {
      it(`${PRIMITIVE.name}: should pass a simple, exact template with mixed types`, () => {
        const parse = PRIMITIVE({
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

      it(`${PRIMITIVE.name}: should pass a simple, exact template with optional keys`, () => {
        const parse = PRIMITIVE({
          a: STRING,
          b: OPTIONAL(INTEGER),
        });
        const parsedX = parse({ a: 'hello', b: 10 });
        const parsedY = parse({ a: 'hello' });
        assert(Object.keys(parsedX).length === 2);
        assert(parsedX.a === 'hello');
        assert(parsedX.b === 10);
        assert(Object.keys(parsedY).length === 1);
        assert(parsedX.a === 'hello');
      });

      it(`${PRIMITIVE.name}: should pass a deeply nested, exact template`, () => {
        const parse = PRIMITIVE({
          a: INTEGER,
          b: PRIMITIVE({
            c: INTEGER,
            d: PRIMITIVE({
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

      it(`${PRIMITIVE.name}: should fail a simple, exact template with the right keys but wrong types`, () => {
        const parse = PRIMITIVE({
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

      it(`${PRIMITIVE.name}: should fail a simple, exact template with a missing key`, () => {
        const parse = PRIMITIVE({
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

      it(`${PRIMITIVE.name}: should report missing keys before extra keys`, () => {
        const parse = PRIMITIVE({
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

      it(`${PRIMITIVE.name}: should check nested objects for object-ness`, () => {
        const parse = PRIMITIVE({
          a: INTEGER,
          b: PRIMITIVE({
            c: INTEGER,
            d: PRIMITIVE({
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

      it(`${PRIMITIVE.name}: should fail nested missing keys`, () => {
        const parse = PRIMITIVE({
          a: INTEGER,
          b: PRIMITIVE({
            c: INTEGER,
            d: PRIMITIVE({
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
  });

  // Tests specific to INEXACT_OBJECT
  describe('.INEXACT_OBJECT(template)', () => {
    it('should pass a simple, inexact template with mixed types', () => {
      const parse = INEXACT_OBJECT({
        a: STRING,
        b: INTEGER,
        c: BOOLEAN,
        d: ENUM(100, 200, 300),
      });
      const parsedX = parse({ a: 'hello', b: 10, c: true, d: 200, e: 'extra' });
      assert(Object.keys(parsedX).length === 4);
      assert(parsedX.a === 'hello');
      assert(parsedX.b === 10);
      assert(parsedX.c === true);
      assert(parsedX.d === 200);
    });

    it('should pass a simple, inexact template with optional keys', () => {
      const parse = INEXACT_OBJECT({
        a: STRING,
        b: OPTIONAL(INTEGER),
      });
      const parsedX = parse({ a: 'hello', b: 10, c: 'extra' });
      const parsedY = parse({ a: 'hello', c: 'extra' });
      assert(Object.keys(parsedX).length === 2);
      assert(parsedX.a === 'hello');
      assert(parsedX.b === 10);
      assert(Object.keys(parsedY).length === 1);
      assert(parsedX.a === 'hello');
    });

    it('should fail a simple, inexact template with wrong optional type', () => {
      const parse = INEXACT_OBJECT({
        a: STRING,
        b: OPTIONAL(INTEGER),
      });
      expectException(
        () => {
          parse({ a: 'hello', b: 'there', c: 'extra' });
        },
        'InvalidType',
        'b'
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

  describe('.ARRAY(type)', () => {
    it('should pass empty arrays', () => {
      const result = ARRAY(STRING)([]);
      assert(typeof result === 'object');
      assert(result.constructor === Array);
      assert(result.length === 0);
    });

    it('should pass simple arrays', () => {
      const result = ARRAY(STRING)(['one', 'two', 'three']);
      assert(typeof result === 'object');
      assert(result.constructor === Array);
      assert(result.length === 3);
      assert(result[0] === 'one');
      assert(result[1] === 'two');
      assert(result[2] === 'three');
    });

    it('should pass complex arrays of objects', () => {
      const type = OBJECT({ a: STRING, b: INTEGER });
      const value = [
        { a: 'one', b: 1 },
        { a: 'two', b: 2 },
      ];
      const result = ARRAY(type)(value);
      assert(typeof result === 'object');
      assert(result.constructor === Array);
      assert(result.length === 2);
      assert(typeof result[0] === 'object');
      assert(typeof result[1] === 'object');
      assert(result[0].a === value[0].a);
      assert(result[0].b === value[0].b);
      assert(result[1].a === value[1].a);
      assert(result[1].b === value[1].b);
    });

    it('should pass correctly nested arrays', () => {
      const type = ARRAY(STRING);
      const value = [['one one', 'one two'], []];
      const result = ARRAY(type)(value);

      assert(typeof result === 'object');
      assert(result.constructor === Array);
      assert(result.length === 2);

      assert(typeof result[0] === 'object');
      assert(result[0].constructor === Array);
      assert(result[0].length === 2);
      assert(result[0][0] === 'one one');
      assert(result[0][1] === 'one two');

      assert(typeof result[1] === 'object');
      assert(result[1].constructor === Array);
      assert(result[1].length === 0);
    });

    it('should fail on arrays of mixed types', () => {
      expectException(() => ARRAY(STRING)(['one', 2]), 'InvalidArrayElement');
    });

    it('should fail improperly nested arrays', () => {
      const type = ARRAY(STRING);
      const value = [['one one'], [2]];
      expectException(() => ARRAY(type)(value), 'InvalidArrayElement');
    });

    it('should fail strings', () => {
      expectException(() => ARRAY(STRING)('hello'), 'InvalidType');
    });

    it('should fail undefined', () => {
      expectException(() => ARRAY(STRING)(undefined), 'InvalidType');
    });

    it('should fail null', () => {
      expectException(() => ARRAY(STRING)(null), 'InvalidType');
    });
  });
});
