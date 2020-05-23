const exceptions = require('./exceptions');

function INTEGER(x) {
  if (typeof x !== 'number') {
    throw new exceptions.InvalidType(this.key);
  } else if (x !== Math.floor(x)) {
    throw new exceptions.InvalidType(this.key);
  } else {
    return x;
  }
}

function INTEGER_STRING(x) {
  if (typeof x !== 'string') {
    throw new exceptions.InvalidType(this.key);
  } else if (isNaN(x)) {
    throw new exceptions.InvalidType(this.key);
  } else if (parseInt(x) !== parseFloat(x)) {
    throw new exceptions.InvalidType(this.key);
  } else {
    return parseInt(x);
  }
}

function NUMERIC(x) {
  if (typeof x !== 'number') {
    throw new exceptions.InvalidType(this.key);
  } else {
    return x;
  }
}

function STRING(x) {
  if (typeof x !== 'string') {
    throw new exceptions.InvalidType(this.key);
  } else {
    return x;
  }
}

function BOOLEAN(x) {
  if (typeof x !== 'boolean') {
    throw new exceptions.InvalidType(this.key);
  } else {
    return x;
  }
}

function BOOLEAN_STRING(x) {
  if (x === 'true') {
    return true;
  } else if (x === 'false') {
    return false;
  } else {
    throw new exceptions.InvalidType(this.key);
  }
}

function ENUM(...values) {
  return function (x) {
    for (let i = 0; i < values.length; i++) {
      if (x === values[i]) return x;
    }
    throw new exceptions.NotInEnum(values, this.key);
  };
}

function OBJECT(template, throwOnExtraKeys = true) {
  return function (x) {
    // make sure x is even an object
    if (!x || x.constructor !== Object) {
      throw new exceptions.InvalidType(this.key);
    }

    // check for the missing/invalid keys
    const errors = [];
    const parsedX = {};
    Object.keys(template).forEach((key) => {
      try {
        if (x.hasOwnProperty(key)) {
          parsedX[key] = template[key].call({ key }, x[key]);
        } else if (template[key].OPTIONAL === true) {
          // do nothing, this key is optional!
        } else {
          throw new exceptions.MissingKey(key);
        }
      } catch (e) {
        errors.push(e);
      }
    });

    if (throwOnExtraKeys) {
      // check for extra keys
      const keysInTemplate = new Set(Object.keys(template));
      const extraKeys = Object.keys(x).filter((key) => {
        return !keysInTemplate.has(key);
      });
      if (extraKeys.length > 0) {
        errors.push(new exceptions.ExtraKey(extraKeys[0])); // the first extra
      }
    }

    if (errors.length === 0) {
      return parsedX;
    } else {
      throw errors[0]; // throw the first error
    }
  };
}

function INEXACT_OBJECT(template) {
  const throwOnExtraKeys = false;
  return OBJECT(template, throwOnExtraKeys);
}

function OR(...options) {
  return function (x) {
    const errors = [];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      try {
        return option.call({ key: this.key }, x);
      } catch (e) {
        errors.push(e);
      }
    }

    if (errors.length > 0) {
      // everything errored, find the highest priority error to report
      errors.sort((a, b) => {
        return (a.priority || 0) - (b.priority || 0);
      });
      throw errors[0];
    } else {
      // there were no options passed in
      throw new exceptions.InvalidType(this.key);
    }
  };
}

function OPTIONAL(f) {
  const g = function (...args) {
    return f.apply(this, args);
  };
  g.OPTIONAL = true;
  return g;
}

function ARRAY(f) {
  return function (x) {
    // to start, ensure that x is an array
    if (typeof x !== 'object' || x === null || x.constructor !== Array) {
      throw new exceptions.InvalidType(this.key);
    }

    const values = [];
    for (let i = 0; i < x.length; i++) {
      try {
        const value = f.call({ key: this.key }, x[i]);
        values.push(value);
      } catch (e) {
        throw new exceptions.InvalidArrayElement(i, e.message, this.key);
      }
    }

    return values;
  };
}

const compose = (f, g) => (...args) => f(g(...args));

function TYPED_DEFAULT(TYPE, defaultValue) {
  return compose(TYPE, x => {
    if (x === null || x === undefined) {
      return defaultValue;
    }

    return x;
  });
}

module.exports = {
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
  TYPED_DEFAULT,
  exceptions,
};
