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

const checker = OR(
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

// returns true
checker({ a: "foo", b: 4 })
checker({ a: "foo", b: 4, c: true, d: 20 })

// throws exceptions.InvalidType({ key: "a" })
checker({ a: false, b: 4, c: true, d: 20 })

// throws exceptions.MissingKey({ key: "b" })
checker({ a: "foo", c: true, d: 10 })

// throws exceptions.MissingKey({ key: "c" })
checker({ a: "foo", b: 4, d: 10 })

// throws exceptions.ExtraKey({ key: "e" })
checker({ a: "foo", b: 4, c: true, d: 10, e: "bar" })
```

Check the tests for more details.

## License

MIT License: https://igliu.mit-license.org
