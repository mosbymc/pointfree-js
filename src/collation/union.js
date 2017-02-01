import { defaultEqualityComparer, memoizer2, emptyObj } from '../helpers';

/*
function union(previousFunc, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var havePreviouslyViewed = memoizer2(comparer),
        atEndOfList = false,
        atEndOfCollection = false;

    function unionFunc(item) {
        return havePreviouslyViewed(item);
    }

    return Object.defineProperty(
        //TODO: I don't know how realistic it would be to implement an ES6 generator for the .next function properties,
        //TODO: but it would allow me to throw the whole function into a while-loop with a .next() as the predicate.
        //TODO: The problem is that it takes so darn much to transpile/polyfill ES6 generators for a pre-ES6 environment
        //TODO: that it probably isn't realistic to use them. However, I may be able to simulate a generator with closures
        //TODO: that would allow a similar while-loop execution.
        unionFunc,
        'next', {
            writable: false,
            configurable: false,
            value: function _next() {
                var next,
                    res;
                while (!atEndOfList && undefined === res) {
                    next = previousFunc.next();
                    if (emptyObj.isPrototypeOf(next)) {
                        atEndOfList = true;
                        break;
                    }

                    res = unionFunc(next);
                    if (!res) return res;
                }

                while (!atEndOfCollection && undefined === res) {
                    next = collection.shift();
                    if (!collection.length) atEndOfCollection = true;
                    res = unionFunc(next);
                    if (!res) return res;
                }
                return Object.create(emptyObj);
            }
        }
    )
}
*/

//TODO: Here's what I'm thinking now.
//TODO: 1) I am going to stick with using ES2015 generators for queryable object evaluation. Even though that means transpiling them and including
//TODO:    the 'regeneratorRuntime' if someone wants to use this library in a pre-ES2015 environment, it allows for a much cleaner and clearer
//TODO:    code path/syntax, a much simpler logic for iterating each item through each pipeline function, and ostensible allows for easier extensions
//TODO:    to be written for the queryable logic by consumers of the library.
//TODO:
//TODO: 2) Given #1, at some point I may try to make a more pre-ES2015-compliant version of this library that doesn't need to rely on the 'regeneratorRuntime'
//TODO:    to properly function in a pre-ES2015 environment.
//TODO:
//TODO: 3) Using generators, it seems like all I need to do is define each queryable function (similar to what I have in the js-data-manager library),
//TODO:    and the generator/iterator for each function. The initial/base queryable object's iterator would always be the same: a for-of loop that yields
//TODO:    each item in the source collection. Every time a queryable method is chained off a queryable object, it will return a new queryable object
//TODO:    whose source is not the base collection, but rather the previous queryable object itself.
//TODO:
//TODO:    Each 'method' that can be called on the queryable object and which results in deferred execution, should have its own iterator defined,
//TODO:    so that, in effect, each 'method' knows how to iterate and evaluate itself. When creating the new queryable object to return from a 'method'
//TODO:    call, that 'method' should return its iterator to be set as the new queryable object's iterator; thus, every time a deferred execution 'method'
//TODO:    is chained off a queryable, it results in a new queryable object that has a different iterator than the one that proceeded it and is unique
//TODO:    to the 'method' that was called.
//TODO:
//TODO:    Since a queryable object will always have a [Symbol.iterator] property, they can be iterated in a for-of loop. And since the queryable's
//TODO:    iterator is a generator, they can gather as few or as many of the items from the 'source' as needed before 'evaluating themselves'. The one
//TODO:    potential problem I see is that, once a queryable pipeline has been built up by chaining 'methods', the evaluation of the final queryable
//TODO:    will cause all prior queryables to also be evaluated. To an extent this isn't an issue, since, even if it didn't cause the evaluation of the
//TODO:    previous queryable objects themselves, but instead it just sorta reduced each queryable's function over the source collection, the evaluation
//TODO:    would have to occur anyway... in other words, it wouldn't be performing any additional work by evaluating prior queryables. However, there are
//TODO:    a few things I need to be careful of and watch out for:
//TODO:         - If the evaluation of a queryable causes all prior queryable's to also be evaluated, then it would make sense to 'save' the evaluation
//TODO:           of each queryable along the pipeline. If I evaluate a prior queryable during the evaluation of the 'final' queryable, but fail to 'save'
//TODO:           that evaluation in the prior queryable object, then, if that prior queryable is ever iterated again, I'll have to perform the work all
//TODO:           over again. So, I probably need to pass some context into each of the queryable's function iterators so they can 'save' the evaluated
//TODO:           data in that queryable object should it be iterated again at some future point (this assumes a non-streaming context). This would also
//TODO:           mean that I'd need to check to see if the current queryable has been evaluated within the iterator before performing the evaluation.
//TODO:
//TODO:         - Again, if the evaluation of a queryable causes all prior queryable's in the pipeline to also be evaluated, how do I handle a split
//TODO:           queryable pipeline? Example:
//TODO:                 var a = new[] {1, 2, 3, 4, 5};
//TODO:                 var b = a.Select(it => it * 2);
//TODO:                 var c = b.Where(it => it % 2 == 0);
//TODO:                 var d = c.Join(new [] {2, 4, 6, 8, 10},
//TODO:                             it => it,
//TODO:                             item  => item
//TODO:                             (it, item) => it * item);
//TODO:                 var e = c.Join(new[] {1, 2, 3, 4, 5},
//TODO:                             it => it,
//TODO:                             item => item
//TODO:                             (it, item) => it * item);
//TODO:
//TODO:           Here, if the 'd' queryable is evaluated, then the 'c' and 'b' queryables will also be evaluated. So, if the 'e' queryable is later
//TODO:           evaluated, it needs to be able to grab the pre-evaluated data from 'b' and 'c' rather than re-evaluating them again. Given my proposed
//TODO:           method of dealing with prior queryable evaluation above, the 'e' queryable object would probably benefit from that 'saved' evaluation
//TODO:           state as well. But this is something to be aware of as I don't want to re-perform work that has already been done.
//TODO:
//TODO:         - While there won't be any concept of 'tasks' in this library any time soon (or possible never), introducing tasks adds a whole new
//TODO:           dimension to queryable evaluation and the saving of that evaluation. Besides which, even if I don't use web workers or some other
//TODO:           JavaScript threading technology, if I am using generators in this library, it is only fair to assume that consumers of this library
//TODO:           are also using generators. While generators do not provide true synchronous execution, they can mimic it at the program level. This
//TODO:           means, again, using the example code above, that both 'd' and 'e' could be evaluated at the 'same' time. Because a queryable object's
//TODO:           iterator is a generator, both 'd' and 'e' would have their own 'instance' of the 'b' and 'c' iterators; so there should be no issue
//TODO:           with race conditions per se. But, if each iterator is checking its queryable's state to see if it has already been evaluated before
//TODO:           performing the evaluation, this could lead to some interesting effects. It could also happen that the 'c' and 'd' queryable objects
//TODO:           are being evaluated at the 'same' time. Which I think would be even more likely to cause issue since 'c' is 100% within the 'd'
//TODO:           queryable's pipeline.
//TODO:
//TODO:         - In the interest of allow for easy extensibility, I should probably wrap each deferred execution 'method's' returned iterator
//TODO:           in a generator function before setting it as the new queryable object's iterator. The wrapper would be where it would check the queryable
//TODO:           object's state to see if it has already been evaluated before actually performing the evaluation. This would allow users of the library
//TODO:           to focus more on the evaluation logic of their function via the iterator without having to worry about checking if the queryable has
//TODO:           already been evaluated, while at the same time, providing a clean and consistent 'interface' for a queryable's [Symbol.iterator] property.
//TODO:           In addition, the iterator wrapper could always set the queryable's evaluated state after the function iterator has completed execution as
//TODO:           well. This way, not only does a function's iterator not need to check if the queryable object it is iterating has already been evaluated,
//TODO:           but it also won't need to bother setting that state once it completes the evaluation as it will be performed in the iterator wrapper. Now,
//TODO:           each function's iterator is free to concern itself solely with its own evaluation and doesn't need to bother with the checking or setting
//TODO:           of a queryable's evaluated state, nor what to do when the queryable it is evaluating has already been evaluated.
//TODO:
//TODO:         - Finally, as mentioned above, 'saving' the evaluated data of a queryable object kinda assumes a non-streaming version/usage of this library.
//TODO:           While I don't want to extend my focus on more than is necessary to implement the core functionality, I think this library would be
//TODO:           significantly more useful if it could handle both finite and potentially infinite (i.e. streaming) sets. The problem is that the concept
//TODO:           of a 'pre-evaluated' queryable is ridiculous in a streaming context. Obviously, I could take the hacky way out and just create two
//TODO:           separate queryable object types; one for finite sets, and one for potentially infinite sets. But, not only is that hacky, ugly, and just
//TODO:           plain lazy, but I also feel it reduces the usability practicality of this library if a user must learn not one, but two APIs for the
//TODO:           two queryable objects, and when to use each one. In general, it is sacrificing consumer convenience for developer convenience, and I
//TODO:           just won't stand for it!
//TODO:
//TODO: 4) Every queryable collation 'method' should be capable of taking any enumerable object as an argument for the 'collection' parameter, including
//TODO:    another queryable object. Utilizing generators and for-of loops should make this very possible. Only objects that have an iterator, built-in or
//TODO:    otherwise, should be accepted. An object without an iterator, although enumerable, should not be accepted as a valid parameter. In light of this,
//TODO:    I should probably change the 'collection' parameter in all collation 'methods' to 'enumerable' or something similar.


function union(source, collection, comparer) {
    comparer = comparer || defaultEqualityComparer;
    var havePreviouslyViewed = memoizer2(comparer);

    function unionFunc(item) {
        return havePreviouslyViewed(item);
    }

    return function *unionIterator() {
        var res;
        for (let item of source) {
            res = unionFunc(item);
            if (!res) yield item;
        }

        for (let item of collection) {
            res = unionFunc(item);
            if (!res) yield item;
        }
    };
}

export { union };