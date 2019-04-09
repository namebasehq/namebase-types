const exceptions = require('./exceptions');

function INTEGER(x) {
  if (typeof x !== 'number') {
    throw new exceptions.InvalidType();
  } else if (x !== Math.floor(x)) {
    throw new exceptions.InvalidType();
  } else {
    return true;
  }
}

function STRING(x) {
  if (typeof x !== 'string') {
    throw new exceptions.InvalidType();
  } else {
    return true;
  }
}

function BOOLEAN(x) {
  if (typeof x !== 'boolean') {
    throw new exceptions.InvalidType();
  } else {
    return true;
  }
}

function ENUM(...values) {
  return x => {
    for (let i = 0; i < values.length; i++) {
      if (x === values[i]) return true;
    }
    throw new exceptions.NotInEnum(values);
  };
}

module.exports = { INTEGER, STRING, BOOLEAN, ENUM, exceptions };
