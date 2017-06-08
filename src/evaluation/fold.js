import { isArray } from '../functionalHelpers';
import { when } from '../combinators';
import { not } from '../decorators';

function fold(source, fn, initial = 0) {
    return when(not(isArray), Array.from, source).reduce(fn, initial);
}

export { fold };