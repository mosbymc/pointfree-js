import { validation_functor } from '../functors/validation_functor';

function Validation(val) {
    return Object.create(validation_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

var validation_monad = Object.create(validation_functor, {

});

export { Validation, validation_monad };