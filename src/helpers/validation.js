export function isRequired(field) {
  if (field?.$dirty && !field?.required) {
    return 'This field is required.'
  }
  return '';
}

export function isString(field) {
  const regex = /\d/;
  if (field?.$dirty && regex.test(field.$model)) {
    return 'This field must be string.';
  }
  return '';
}

export function isEmail(field) {
  if (field?.$dirty && !field?.email) {
    return 'This field must be email.'
  }
  return '';
}

export function isMaxLength(field, max) {
  if (field?.$dirty && !field?.maxLength) {
    return `This field must be max ${max} symbols.`
  }
  return '';
}

export function isMinLength(field, min) {
  if (field?.$dirty && !field?.minLength) {
    return `This field must be min ${min} symbols.`
  }
  return '';
}

export function isNumber(field) {
  if (field?.$dirty && !field?.numeric) {
    return `This field must be numbers`
  }
  return '';
}
