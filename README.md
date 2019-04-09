Namebase Types
==

This package lets you do things like this:

```js
const { or, obj, str, int, exceptions } = require('namebase-types');
const checker = or(
  obj({ a: str(), b: int() }),
  obj({ a: str(), b: int(), c: int(), d: int() }),
)

// throws exceptions.ExtraKey({ key: "c" })
checker({ a: "foo", b: 10, c: 33 })

// throws exceptions.ExtraKey({ key: "d" })
checker({ a: "foo", b: 10, d: 100 })

// throws exceptions.UnrecognizedKey({ key: "e" })
checker({ a: "foo", b: 10, e: "oops" })

// throws exceptions.InvalidType({ key: "a" })
checker({ a: false, b: 10, c: 33 d: 100 })
```

Check the tests for more details.

## License

MIT License: https://igliu.mit-license.org
