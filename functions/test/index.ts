import { add } from '../src/index'
import * as assert from 'assert';
import * as chai from 'chai';

describe('index.ts', () => {
    it('add numbers by assert', () => {
        assert.equal(3, add(1, 2))
    });

    it('add numbers by chai', () => {
        chai.expect(add(5, 2)).to.equal(7);
    });

    it('add numbers', () => {
        chai.expect(add(5, 9)).to.equal(14);
    });
});