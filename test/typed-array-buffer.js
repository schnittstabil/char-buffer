import test from 'ava';

import TypedArrayBuffer from '../typed-array-buffer';
import basicTests from './helpers/_basic-tests';
import appendTest from './helpers/_append-tests';
import inheritanceTest from './helpers/_inheritance-tests';
import fromStringTests from './helpers/_from-string-tests';
import mapTests from './helpers/_map-tests';
import forEachTests from './helpers/_for-each-tests';

basicTests(test, TypedArrayBuffer);
appendTest(test, TypedArrayBuffer);
inheritanceTest(test, TypedArrayBuffer);
fromStringTests(test, TypedArrayBuffer);
mapTests(test, TypedArrayBuffer);
forEachTests(test, TypedArrayBuffer);
