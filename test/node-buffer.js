import test from 'ava';

import NodeBuffer from '../node-buffer';
import basicTests from './helpers/_basic-tests';
import appendTest from './helpers/_append-tests';
import inheritanceTest from './helpers/_inheritance-tests';
import fromStringTests from './helpers/_from-string-tests';
import mapTests from './helpers/_map-tests';
import forEachTests from './helpers/_for-each-tests';

basicTests(test, NodeBuffer);
appendTest(test, NodeBuffer);
inheritanceTest(test, NodeBuffer);
fromStringTests(test, NodeBuffer);
mapTests(test, NodeBuffer);
forEachTests(test, NodeBuffer);
