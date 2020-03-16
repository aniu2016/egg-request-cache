'use strict';
const assert = require('assert');
const mock = require('egg-mock');

describe('test/Egg-request.test.js', () => {
  describe('single use', () => {
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
      return app
        .httpRequest()
        .get('/')
        .expect('hi, request-cache')
        .expect(200);
    });
    // 初始化参数
    // 调用效果
    // 黑盒测试
    it('对比拉取数据是否一致', async () => {
      const result = await app.httpRequest().get('/request');
      return app
        .httpRequest()
        .get('/request/cache')
        .expect(result.body)
        .expect(200);
    });
    it('对比两次拉取时间，速度是否更快', async () => {
      await app.httpRequest().get('/request');
      const request_start_time = Date.now();
      await app.httpRequest().get('/request');
      const request_end_time = Date.now() - request_start_time;

      await app.httpRequest().get('/request/cache');
      const requestCache_start_time = Date.now();
      await app.httpRequest().get('/request/cache');
      const requestCache_end_time = Date.now() - requestCache_start_time;
      console.log(
        `直接请求：${request_end_time}ms`,
        `缓存请求：${requestCache_end_time}ms`
      );
      assert(requestCache_end_time < request_end_time);
    });


    it('use cache', async () => {
      app.mockHttpclient('http://test.com/a', {
        // 模拟的参数，可以是 buffer / string / json，
        // 都会转换成 buffer
        // 按照请求时的 options.dataType 来做对应的转换
        data: {
          val: 1,
        },
      });
      const result1 = await app.httpRequest().get('/request/cache/random');

      app.mockHttpclient('http://test.com/a', {
        // 模拟的参数，可以是 buffer / string / json，
        // 都会转换成 buffer
        // 按照请求时的 options.dataType 来做对应的转换
        data: {
          val: 2,
        },
      });

      const result2 = await app.httpRequest().get('/request/cache/random');
      assert(result2.body.val === result1.body.val);
    });


    it('no cache', async () => {
      app.mockHttpclient('http://test.com/a', {
        // 模拟的参数，可以是 buffer / string / json，
        // 都会转换成 buffer
        // 按照请求时的 options.dataType 来做对应的转换
        data: {
          val: 1,
        },
      });
      const result1 = await app.httpRequest().get('/request/random');

      app.mockHttpclient('http://test.com/a', {
        // 模拟的参数，可以是 buffer / string / json，
        // 都会转换成 buffer
        // 按照请求时的 options.dataType 来做对应的转换
        data: {
          val: 2,
        },
      });

      const result2 = await app.httpRequest().get('/request/random');
      assert(result2.body.val !== result1.body.val);
    });

  });

  describe('redis cache', () => {
    let app;
    before(() => {
      app = mock.app({
        baseDir: 'apps/Egg-request-redis-test',
      });
      return app.ready();
    });

    after(() => app.close());
    afterEach(mock.restore);

    it('should GET /', () => {
      return app
        .httpRequest()
        .get('/')
        .expect('hi, request-cache')
        .expect(200);
    });
    // 初始化参数
    // 调用效果
    // 黑盒测试
    it('对比拉取数据是否一致', async () => {
      const result = await app.httpRequest().get('/request');
      return app
        .httpRequest()
        .get('/request/cache')
        .expect(result.body)
        .expect(200);
    });
    it('对比两次拉取时间，速度是否更快', async () => {
      await app.httpRequest().get('/request');
      const request_start_time = Date.now();
      await app.httpRequest().get('/request');
      const request_end_time = Date.now() - request_start_time;

      await app.httpRequest().get('/request/cache');
      const requestCache_start_time = Date.now();
      await app.httpRequest().get('/request/cache');
      const requestCache_end_time = Date.now() - requestCache_start_time;
      console.log(
        `直接请求：${request_end_time}ms`,
        `缓存请求：${requestCache_end_time}ms`
      );
      assert(requestCache_end_time < request_end_time);
    });
  });
});
