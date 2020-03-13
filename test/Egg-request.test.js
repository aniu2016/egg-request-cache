'use strict';

const mock = require('egg-mock');

describe('test/Egg-request.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/Egg-request-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, request-cache')
      .expect(200);
  });
});
