import test from 'ava';

import basicTests from './helpers/_basic-tests';
import appendTest from './helpers/_append-tests';
import inheritanceTest from './helpers/_inheritance-tests';
import fromStringTests from './helpers/_from-string-tests';
import mapTests from './helpers/_map-tests';
import forEachTests from './helpers/_for-each-tests';

import defaultBuffer from '..';

basicTests(test, defaultBuffer);
appendTest(test, defaultBuffer);
inheritanceTest(test, defaultBuffer);
fromStringTests(test, defaultBuffer);
mapTests(test, defaultBuffer);
forEachTests(test, defaultBuffer);
