const exceptions = require('./exceptions');

function integer() {
  return x => {
    if (typeof x !== 'number') {
      throw new exceptions.InvalidType();
    } else if (x !== Math.floor(x)) {
      throw new exceptions.InvalidType();
    } else {
      return true;
    }
  };
}

function string() {
  return x => {
    if (typeof x !== 'string') {
      throw new exceptions.InvalidType();
    } else {
      return true;
    }
  };
}

function bool() {
  return x => {
    if (typeof x !== 'boolean') {
      throw new exceptions.InvalidType();
    } else {
      return true;
    }
  };
}

module.exports = { integer, string, bool, exceptions };
