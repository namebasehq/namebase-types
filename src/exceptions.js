class InvalidType extends Error {
  constructor(key = null) {
    if (key) {
      super(`The type of key ${key} is invalid.`);
    } else {
      super(`This value has an invalid type.`);
    }

    this.name = 'InvalidType';
    this.priority = 2;
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
    this.priority = 3;
    this.values = values;
    this.key = key;
  }
}

class MissingKey extends Error {
  constructor(key = null) {
    super(`Key ${key} is missing.`);

    this.name = 'MissingKey';
    this.priority = 4;
    this.key = key;
  }
}

class ExtraKey extends Error {
  constructor(key = null) {
    super(`Key ${key} was present but should not have been included.`);

    this.name = 'ExtraKey';
    this.priority = 1;
    this.key = key;
  }
}

class InvalidArrayElement extends Error {
  constructor(index, nestedError, key = null) {
    if (key) {
      super(`Invalid type at ${key}[${index}]: ${nestedError}`);
    } else {
      super(`Invalid type at index ${index}: ${nestedError}`);
    }

    this.name = 'InvalidArrayElement';
    this.priority = 5;
    this.key = key;
  }
}

module.exports = {
  ExtraKey,
  InvalidArrayElement,
  InvalidType,
  MissingKey,
  NotInEnum,
};
