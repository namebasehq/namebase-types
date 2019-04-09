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

module.exports = { InvalidType };
