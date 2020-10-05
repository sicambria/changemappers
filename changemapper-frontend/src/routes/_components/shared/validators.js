function requiredValidator () {
    return function required (value) {
      return (value !== undefined && value !== null && value !== '') || 'This field is required'
    }
  }

  function minLengthValidator (limit) {
    return function minLength (value) {
      return (value.length > limit) || 'This field length should be greater than '+ limit;
    }
  }

  function maxLengthValidator (limit) {
    return function minLength (value) {
      return (value.length < limit) || 'This field length should be less than '+ limit;
    }
  }

  export {
    requiredValidator,
    minLengthValidator,
    maxLengthValidator
  }