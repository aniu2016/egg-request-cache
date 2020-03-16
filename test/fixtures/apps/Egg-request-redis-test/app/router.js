'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/', controller.home.index);

  router.get('/request', controller.home.request);

  router.get('/request/cache', controller.home.requestCache);
};
