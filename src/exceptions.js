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

class NotInEnum extends InvalidType {
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

module.exports = { InvalidType, NotInEnum };
