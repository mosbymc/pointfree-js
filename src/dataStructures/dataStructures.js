import { Constant, constant } from './constant';
import { Either, Left, Right, right, left } from './either';
import { Future, future } from './future';
import { Identity, identity } from './identity';
import { Io, io } from './io';
import { List, list_core } from './list';
import { Maybe, Just, Nothing, just, nothing } from './maybe';
import { Validation, validation } from './validation';
import { applyTransforms, applyFantasyLandSynonyms, applyAliases, setIteratorAndLift } from './data_structure_util';

/**
 * @namespace dataStructures
 */

/*
    - Semigroup:
        > a.concat(b).concat(c) is equivalent to a.concat(b.concat(c)) (associativity)

    - Monoid:
        > A value that implements the Monoid specification must also implement the Semigroup specification.
        > m.concat(M.empty()) is equivalent to m (right identity)
        > M.empty().concat(m) is equivalent to m (left identity)

    - Functor:
        > u.map(a => a) is equivalent to u (identity)
        > u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)

    - Apply:
        > A value that implements the Apply specification must also implement the Functor specification.
        > v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)

    - Applicative:
        > A value that implements the Applicative specification must also implement the Apply specification.
        > v.ap(A.of(x => x)) is equivalent to v (identity)
        > A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
        > A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)

    - Foldable:
        > u.reduce is equivalent to u.reduce((acc, x) => acc.concat([x]), []).reduce

    - Traversable:
        > A value that implements the Traversable specification must also implement the Functor and Foldable specifications.
        > t(u.traverse(F, x => x)) is equivalent to u.traverse(G, t) for any t such that t(a).map(f) is equivalent to t(a.map(f)) (naturality)
        > u.traverse(F, F.of) is equivalent to F.of(u) for any Applicative F (identity)
        > u.traverse(Compose, x => new Compose(x)) === new Compose(u.traverse(F, x => x).map(x => x.traverse(G, x => x)))
                for Compose defined below and any Applicatives F and G (composition)

    - Chain:
        > A value that implements the Chain specification must also implement the Apply specification.
        > m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)

    - ChainRec:
        > A value that implements the ChainRec specification must also implement the Chain specification.
        > M.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), i) is equivalent to (function step(v) { return p(v) ? d(v) : n(v).chain(step); }(i)) (equivalence)
        > Stack usage of M.chainRec(f, i) must be at most a constant multiple of the stack usage of f itself.

    - Monad:
        > A value that implements the Monad specification must also implement the Applicative and Chain specifications.
        > M.of(a).chain(f) is equivalent to f(a) (left identity)
        > m.chain(M.of) is equivalent to m (right identity)

    - Extend:
        > A value that implements the Extend specification must also implement the Functor specification.
        > w.extend(g).extend(f) is equivalent to w.extend(_w => f(_w.extend(g)))

    - Comonad:
        > A value that implements the Comonad specification must also implement the Extend specification.
        > w.extend(_w => _w.extract()) is equivalent to w (left identity)
        > w.extend(f).extract() is equivalent to f(w) (right identity)

    - Bifunctor:
        > A value that implements the Bifunctor specification must also implement the Functor specification.
        > p.bimap(a => a, b => b) is equivalent to p (identity)
        > p.bimap(a => f(g(a)), b => h(i(b)) is equivalent to p.bimap(g, i).bimap(f, h) (composition)

    - Profunctor:
        > A value that implements the Profunctor specification must also implement the Functor specification.
        > p.promap(a => a, b => b) is equivalent to p (identity)
        > p.promap(a => f(g(a)), b => h(i(b))) is equivalent to p.promap(f, i).promap(g, h) (composition)
 */

var monads = [
    { factory: Constant, delegate: constant },
    { factory: Future, delegate: future },
    { factory: Identity, delegate: identity },
    { factory: Io, delegate: io },
    { factory: Just, delegate: just },
    { factory: Left, delegate: left },
    { factory: List, delegate: list_core },
    { factory: Maybe },
    { factory: Nothing, delegate: nothing },
    { factory: Right, delegate: right },
    { factory: Validation, delegate: validation }
];

applyFantasyLandSynonyms(applyTransforms(applyAliases(setIteratorAndLift(monads))));

export { Constant, Either, Future, Identity, Io, Just, Left, List, Maybe, Nothing, Right, Validation };