import test from 'ava';

import StringBuffer from '../string-buffer';
import basicTests from './helpers/_basic-tests';
import appendTest from './helpers/_append-tests';
import inheritanceTest from './helpers/_inheritance-tests';
import fromStringTests from './helpers/_from-string-tests';
import mapTests from './helpers/_map-tests';
import forEachTests from './helpers/_for-each-tests';

basicTests(test, StringBuffer);
appendTest(test, StringBuffer);
inheritanceTest(test, StringBuffer);
fromStringTests(test, StringBuffer);
mapTests(test, StringBuffer);
forEachTests(test, StringBuffer);
