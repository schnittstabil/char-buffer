import test from 'ava';

import NodeBuffer from '../node-buffer';
import basicTests from './helpers/basic-tests';
import appendTest from './helpers/append-tests';
import inheritanceTest from './helpers/inheritance-tests';
import fromStringTests from './helpers/from-string-tests';
import mapTests from './helpers/map-tests';
import forEachTests from './helpers/for-each-tests';

basicTests(test, NodeBuffer);
appendTest(test, NodeBuffer);
inheritanceTest(test, NodeBuffer);
fromStringTests(test, NodeBuffer);
mapTests(test, NodeBuffer);
forEachTests(test, NodeBuffer);
