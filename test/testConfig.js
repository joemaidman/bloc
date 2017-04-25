global.assert = require('assert');
global.chai = require("chai");
global.expect = require('chai').expect;
global.sinon = require('sinon');
global.sinonChai = require("sinon-chai");
global.rewire = require('rewire');
chai.use(sinonChai);
