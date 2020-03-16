'use strict';
const assert = require('assert');
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
  // 初始化参数
  // 调用效果
  // 黑盒测试
  it('对比拉取数据是否一致', async () => {
    const result = await app.httpRequest().get('/request');
    return app.httpRequest()
      .get('/request/cache')
      .expect(result.body)
      .expect(200);
  });
  it('对比两次拉取时间，速度是否更快', async () => {

    const requestCache_start_time = Date.now();
    await app.httpRequest().get('/request/cache');
    const requestCache_end_time = Date.now() - requestCache_start_time;

    await app.httpRequest().get('/request');
    const request_start_time = Date.now();
    await app.httpRequest().get('/request');
    const request_end_time = Date.now() - request_start_time;

    console.log(`直接请求：${request_end_time}ms`, `缓存请求：${requestCache_end_time}ms`);
    assert(requestCache_end_time < request_end_time);
  });


});
