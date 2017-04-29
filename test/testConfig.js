global.assert = require('assert');
global.chai = require("chai");
global.expect = require('chai').expect;
global.sinon = require('sinon');
global.sinonChai = require("sinon-chai");
chai.use(sinonChai);
global.timekeeper = require('timekeeper');
