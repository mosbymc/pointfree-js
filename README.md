# pointfree-js

[![Build Status](https://travis-ci.org/mosbymc/pointfree-js.svg?branch=master)](https://travis-ci.org/mosbymc/pointfree-js)
[![Build status](https://ci.appveyor.com/api/projects/status/duhd4ljv1to5apbq/branch/master?svg=true)](https://ci.appveyor.com/project/mosbymc/pointfree-js/branch/master)
[![Code Climate](https://codeclimate.com/github/mosbymc/pointfree-js/badges/gpa.svg)](https://codeclimate.com/github/mosbymc/pointfree-js)
[![Test Coverage](https://codeclimate.com/github/mosbymc/pointfree-js/badges/coverage.svg)](https://codeclimate.com/github/mosbymc/pointfree-js/coverage)
[![Issue Count](https://codeclimate.com/github/mosbymc/pointfree-js/badges/issue_count.svg)](https://codeclimate.com/github/mosbymc/pointfree-js)
[![Known Vulnerabilities](https://snyk.io/test/github/mosbymc/pointfree-js/badge.svg)](https://snyk.io/test/github/mosbymc/pointfree-js)
[![Dependency Status](https://david-dm.org/mosbymc/pointfree-js.svg)](https://david-dm.org/mosbymc/pointfree-js)
[![devDependency Status](https://david-dm.org/mosbymc/pointfree-js/dev-status.png)](https://david-dm.org/mosbymc/pointfree-js#info=devDependencies)
[![License](https://img.shields.io/npm/l/proxify-js.svg)](https://opensource.org/licenses/MIT)


A JavaScript library that brings together algebraic data structures, combinators, decorators, lenses, transducers, and more into a single environment.

This is a work in progress and is meant more as a learning tool for myself than anything else.

Currently in progress:
- lazify existing data structures
- monoids and groups
- semi-group/monoid/group factory for defining your own semi-groups/monoids/groups
- tests and refactoring of existing code base



|               |    Identity     |    Constant     |    Either     |     Maybe     |    Future     |     List      |    Additive   |  Conjunctive  | Disjunctive |
--------------- | :-------------: | :-------------: | :-----------: | :-----------: | :-----------: | :-----------: | :-----------: | :-----------: | :---------: |
| Functor       |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Apply         |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Bifunctor     |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Apply         |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Applicative   |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Chain         |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Monad         |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Chain         |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| ChainRec      |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Extend        |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Comonad       |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Foldable      |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Traversable   |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Contravariant |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Profunctor    |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |               |               |              |
| Semigroup     |                 |   **✔︎**        |                |               |              |   **✔︎**        |   **✔︎**      |    **✔︎**      |   **✔︎**      |
| Monoid        |                 |                 |               |               |               |   **✔︎**       |   **✔︎**       |    **✔︎**     |   **✔︎**      |
| Setoid        |    **✔︎**        |    **✔︎**       |    **✔︎**      |    **✔︎**     |   **✔︎**       |   **✔︎**       |   **✔︎**       |    **✔︎**     |   **✔︎**      |
| Group         |                 |                 |               |               |               |   **✔︎**       |   **✔︎**       |   **✔︎**       |   **✔︎**     |

