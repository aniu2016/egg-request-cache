'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hi, ' + this.app.plugins['request-cache'].name;
  }

  async showData() {
    this.ctx.body = '';
  }

}

module.exports = HomeController;
