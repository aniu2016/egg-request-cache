'use strict';
const md5 = require('md5');
let instance;
const cache = {};

// 格式化响应体
function transformResponse(ctx) {
  return ctx.data;
}

// 构造函数 统一处理通用的逻辑
function constructor(defOpts = {}) {
  // 返回一个请求函数
  // @param conf (Object) : {
  //    noCache (Boolean) 是否需要缓存
  // } extend App.curl options
  return async function(url, conf = {}) {
    // 开始时间
    // console.time('此次请求花费时间');
    let response,
      cacheKey;
    const params = Object.assign({}, defOpts, conf);
    if (!conf.noCache) {
      cacheKey = createIndexes(url, params);
      // 读取缓存
      response = await getCache(cacheKey);
    }
    // 无缓存则请求且写入缓存
    if (!response) {
      response = await instance.curl(url, params);
      if (!conf.noCache) await setCache(cacheKey, response);
    }
    response = transformResponse(response);
    // 结束时间
    // console.timeEnd('此次请求花费时间');
    return response;
  };
}

// {test: 1, testB: 2} => MD5
function createIndexes(url, params) {
  let keys = Object.keys(params);
  keys = keys.sort(); // 防止因为key顺序问题导致认为不是同一个请求
  let strs = url;
  keys.forEach(key => {
    strs += `${key}${params[key]}`;
  });
  return md5(strs);
}

// 保存数据
async function setCache(key, val) {
  if (instance.redis) {
    if (typeof val === 'object') val = JSON.stringify(val);
    await instance.redis.set(instance.config.requestCache.redisPrefixKey + ':' + key, val, 'EX', (instance.config.requestCache.expireTime / 1000));
  } else {
    cache[key] = {
      value: val,
      expireTime: Date.now() + instance.config.requestCache.expireTime,
    };
  }
}

// 获取缓存
async function getCache(key) {
  if (instance.redis) {
    const val = await instance.redis.get(instance.config.requestCache.redisPrefixKey + ':' + key);
    return JSON.parse(val);
  }
  if (cache[key] && cache[key].expireTime < Date.now()) {
    delete cache[key];
  }
  return cache[key] && cache[key].value;
}

// 清理内存
async function clearExpireCache() {
  const keys = Object.keys(cache);
  keys.forEach(key => {
    if (cache[key].expireTime < Date.now()) {
      delete cache[key];
    }
  });
}


// 暴露的Api
const requestCache = constructor();
requestCache.get = constructor({
  method: 'GET',
  dataType: 'json',
});
requestCache.post = constructor({
  method: 'POST',
  dataType: 'json',
});

// 插件初始化
module.exports = app => {
  instance = app;
  app.requestCache = requestCache;
  app.config.requestCache = Object.assign({
    expireTime: 5000, // 默认一分钟缓存
    redisPrefixKey: 'requestcache', // 默认一分钟缓存
  }, app.config.requestCache);
  app.coreLogger.info('[egg-request] init instance success!');

  // 五秒清理一次内存
  const clearCacheTimer = setInterval(clearExpireCache, app.config.requestCache.expireTime);
  app.beforeClose(async () => {
    clearInterval(clearCacheTimer);
  });
};

