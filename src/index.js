import { queryable } from './queryObjects/queryable';
import { list } from './list_monad/list';
import { observable } from './streams/observable';

window.queryable = queryable || {};
window.list = list || {};
window.observable = observable || {};