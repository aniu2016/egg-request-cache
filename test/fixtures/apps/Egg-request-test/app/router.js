'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/request', controller.home.request);
  router.get('/request/cache', controller.home.requestCache);
  router.get('/request/cache/random', controller.home.requestRandom);
  router.get('/request/random', controller.home.requestRandomNoCache);
};
