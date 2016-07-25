import test from 'ava';

import TypedArrayBuffer from '../typed-array-buffer';
import basicTests from './helpers/basic-tests';
import appendTest from './helpers/append-tests';
import inheritanceTest from './helpers/inheritance-tests';
import fromStringTests from './helpers/from-string-tests';
import mapTests from './helpers/map-tests';
import forEachTests from './helpers/for-each-tests';

basicTests(test, TypedArrayBuffer);
appendTest(test, TypedArrayBuffer);
inheritanceTest(test, TypedArrayBuffer);
fromStringTests(test, TypedArrayBuffer);
mapTests(test, TypedArrayBuffer);
forEachTests(test, TypedArrayBuffer);
