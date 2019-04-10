class InvalidType extends Error {
  constructor(key = null) {
    if (key) {
      super(`The type of key ${key} is invalid.`);
    } else {
      super(`This value has an invalid type.`);
    }
    this.name = 'InvalidType';
    this.key = key;
  }
}

class NotInEnum extends Error {
  constructor(values, key = null) {
    const message = `is not in enum(${values.join(',')})`;
    if (key) {
      super(`Key ${key} ${message}.`);
    } else {
      super(`Value ${message}.`);
    }
    this.name = 'NotInEnum';
    this.values = values;
    this.key = key;
  }
}

class MissingKey extends Error {
  constructor(key = null) {
    super(`Key ${key} is missing.`);
    this.name = 'MissingKey';
    this.key = key;
  }
}

class ExtraKey extends Error {
  constructor(key = null) {
    super(`Key ${key} was present but should not have been included.`);
    this.name = 'ExtraKey';
    this.key = key;
  }
}

module.exports = { InvalidType, NotInEnum, MissingKey, ExtraKey };
