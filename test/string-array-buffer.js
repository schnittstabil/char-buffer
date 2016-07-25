import test from 'ava';

import StringArrayBuffer from '../string-array-buffer.js';
import basicTests from './helpers/basic-tests';
import appendTest from './helpers/append-tests';
import inheritanceTest from './helpers/inheritance-tests';
import fromStringTests from './helpers/from-string-tests';
import mapTests from './helpers/map-tests';
import forEachTests from './helpers/for-each-tests';

basicTests(test, StringArrayBuffer);
appendTest(test, StringArrayBuffer);
inheritanceTest(test, StringArrayBuffer);
fromStringTests(test, StringArrayBuffer);
mapTests(test, StringArrayBuffer);
forEachTests(test, StringArrayBuffer);
