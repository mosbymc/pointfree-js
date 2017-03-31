import { when, not, isArray } from '../functionalHelpers';

function fold(source, fn, initial = 0) {
    return when(not(isArray), Array.from, source).reduce(fn, initial);
}

export { fold };