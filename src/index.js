const exceptions = require('./exceptions');

function INTEGER(x) {
  if (typeof x !== 'number') {
    throw new exceptions.InvalidType(this.key);
  } else if (x !== Math.floor(x)) {
    throw new exceptions.InvalidType(this.key);
  } else {
    return true;
  }
}

function STRING(x) {
  if (typeof x !== 'string') {
    throw new exceptions.InvalidType(this.key);
  } else {
    return true;
  }
}

function BOOLEAN(x) {
  if (typeof x !== 'boolean') {
    throw new exceptions.InvalidType(this.key);
  } else {
    return true;
  }
}

function ENUM(...values) {
  return function(x) {
    for (let i = 0; i < values.length; i++) {
      if (x === values[i]) return true;
    }
    throw new exceptions.NotInEnum(values, this.key);
  };
}

function OBJECT(template) {
  return function(x) {
    // make sure x is even an object
    if (!x || x.constructor !== Object) {
      throw new exceptions.InvalidType(this.key);
    }

    const errors = [];

    // check for the missing/invalid keys
    Object.keys(template).forEach(key => {
      try {
        if (x.hasOwnProperty(key)) {
          template[key].call({ key }, x[key]);
        } else {
          throw new exceptions.MissingKey(key);
        }
      } catch (e) {
        errors.push(e);
      }
    });

    // check for extra keys
    const keysInTemplate = new Set(Object.keys(template));
    const extraKeys = Object.keys(x).filter(key => {
      return !keysInTemplate.has(key);
    });
    if (extraKeys.length > 0) {
      errors.push(new exceptions.ExtraKey(extraKeys[0])); // the first extra
    }

    if (errors.length === 0) {
      return true;
    } else {
      throw errors[0]; // throw the first error
    }
  };
}

module.exports = { INTEGER, STRING, BOOLEAN, ENUM, OBJECT, exceptions };
