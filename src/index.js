import { queryable } from './queryObjects/queryable';
import { List } from './list_monad/list';
import { observable } from './streams/observable';

window.queryable = queryable || {};
window.list = List || {};
window.observable = observable || {};