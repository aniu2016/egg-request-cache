'use strict';

exports.keys = '123456';
exports.redis = {
  client: {
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0,
  },
};

exports.requestCache = {
  expireTime: 8000,
  redisPrefixKey: 'test',
};
