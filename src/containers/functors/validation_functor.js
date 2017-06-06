function Validation(val) {
    return Object.create(validation_functor, {
        _value: {
            value: val
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

var validation_functor = {

};

export { Validation, validation_functor };