# egg-request-cache
只是代理了Egg内置的curl函数，参数都与curl保持一致



## Install

```bash
$ npm i egg-request --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports['request-cache'] = {
  enable: true,
  package: 'egg-request-cache',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.requestCache = {
  expiresTime: '', // 缓存时间 单位毫秒
  redisPrefixKey: 'test', // redis key前缀
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->
```javascript
  // {app_root}/Controller/user.js

  // 默认设置了 dataType json method get
  await this.app.requestCache.get('http://127.0.0.1:7001/users');
  // 默认设置了 dataType json method post
  await this.app.requestCache.post('http://127.0.0.1:7001/users', [options]);

  // 没默认值
  await this.app.requestCache('http://127.0.0.1:7001/users', [options]);
```


优化
1. 将代码重构，分为三个class  一个总控制 一个redisclass 一个内存class
2. 将相关函数抽离成独立的类 如 getCache  setCache
3. 将相关帮助函数抽离成一个helper类
4. test 代码编写