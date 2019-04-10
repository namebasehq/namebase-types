Namebase Types
==

This package lets you do things like this:

```js
const {
  OR,
  OBJECT,
  STRING,
  INTEGER,
  BOOLEAN,
  ENUM,
  exceptions,
} = require('namebase-types');

const parser = OR(
  OBJECT({
    a: STRING,
    b: INTEGER,
  }),
  OBJECT({
    a: STRING,
    b: INTEGER,
    c: BOOLEAN,
    d: ENUM(10, 20),
  }),
)

// returns { a: "foo", b: 4 }
parser({ a: "foo", b: 4 })

// returns { a: "foo", b: 4, c: true, d: 20 }
parser({ a: "foo", b: 4, c: true, d: 20 })

// throws exceptions.InvalidType({ key: "a" })
parser({ a: false, b: 4, c: true, d: 20 })

// throws exceptions.MissingKey({ key: "b" })
parser({ a: "foo", c: true, d: 10 })

// throws exceptions.MissingKey({ key: "c" })
parser({ a: "foo", b: 4, d: 10 })

// throws exceptions.ExtraKey({ key: "e" })
parser({ a: "foo", b: 4, c: true, d: 10, e: "bar" })
```

Check the tests for more details. Note: instead of passing in the built-in primitives (STRING, INTEGER, BOOLEAN, ENUM, OBJECT), you can pass in any parsing function that returns its parsed input on success (and throws otherwise).

## License

MIT License: https://igliu.mit-license.org
