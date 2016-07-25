import test from 'ava';

import StringBuffer from '../string-buffer';
import basicTests from './helpers/basic-tests';
import appendTest from './helpers/append-tests';
import inheritanceTest from './helpers/inheritance-tests';
import fromStringTests from './helpers/from-string-tests';
import mapTests from './helpers/map-tests';
import forEachTests from './helpers/for-each-tests';

basicTests(test, StringBuffer);
appendTest(test, StringBuffer);
inheritanceTest(test, StringBuffer);
fromStringTests(test, StringBuffer);
mapTests(test, StringBuffer);
forEachTests(test, StringBuffer);
