import test from 'ava';

import defaultBuffer from '../';
import basicTests from './helpers/basic-tests';
import appendTest from './helpers/append-tests';
import inheritanceTest from './helpers/inheritance-tests';
import fromStringTests from './helpers/from-string-tests';
import mapTests from './helpers/map-tests';
import forEachTests from './helpers/for-each-tests';

basicTests(test, defaultBuffer);
appendTest(test, defaultBuffer);
inheritanceTest(test, defaultBuffer);
fromStringTests(test, defaultBuffer);
mapTests(test, defaultBuffer);
forEachTests(test, defaultBuffer);
