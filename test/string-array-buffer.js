import test from 'ava';

import StringArrayBuffer from '../string-array-buffer';
import basicTests from './helpers/_basic-tests';
import appendTest from './helpers/_append-tests';
import inheritanceTest from './helpers/_inheritance-tests';
import fromStringTests from './helpers/_from-string-tests';
import mapTests from './helpers/_map-tests';
import forEachTests from './helpers/_for-each-tests';

basicTests(test, StringArrayBuffer);
appendTest(test, StringArrayBuffer);
inheritanceTest(test, StringArrayBuffer);
fromStringTests(test, StringArrayBuffer);
mapTests(test, StringArrayBuffer);
forEachTests(test, StringArrayBuffer);
