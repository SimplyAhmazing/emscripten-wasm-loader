import { expect } from 'chai';
import { enableLogger, log } from '../../src/util/logger';

describe('logger', () => {
  it('should do nothing by default', () => {
    expect(() => log('')).to.not.throw();
  });

  it('should allow override logger', () => {
    const mock = jest.fn();
    enableLogger(mock);

    const message = 'message';
    const value = { value: 'value' };

    log(message, value);

    expect(mock.mock.calls).to.have.lengthOf(1);
    expect(mock.mock.calls[0]).to.deep.equal([message, value]);
  });
});
