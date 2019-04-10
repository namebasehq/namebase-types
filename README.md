Namebase Types
==

This package lets you do things like this:

```js
const { or, obj, str, int, exceptions } = require('namebase-types');
const checker = or(
  obj({ a: str(), b: int() }),
  obj({ a: str(), b: int(), c: int(), d: int() }),
)

// throws exceptions.InvalidType({ key: "a" })
checker({ a: false, b: 10, c: 33 d: 100 })

// throws exceptions.MissingKey({ key: "b" })
checker({ a: "foo" })

// throws exceptions.ExtraKey({ key: "d" })
checker({ a: "foo", b: 10, d: 100 })

// throws exceptions.UnrecognizedKey({ key: "e" })
checker({ a: "foo", b: 10, e: "oops" })
```

Check the tests for more details.

## License

MIT License: https://igliu.mit-license.org
