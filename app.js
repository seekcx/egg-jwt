'use strict';

const assert = require('assert');
const koajwt = require('koa-jwt2');
const jwt = require('jsonwebtoken');

const MIDDLEWARE_NAME_JWT = 'jwt';

module.exports = app => {
  const { config } = app;
  const index = config.appMiddleware.indexOf(MIDDLEWARE_NAME_JWT);

  assert.equal(
    index,
    -1,
    `Duplication of middleware name found: ${MIDDLEWARE_NAME_JWT}. Rename your middleware other than "${MIDDLEWARE_NAME_JWT}" please.`
  );

  app.jwt = koajwt(config.jwt);

  app.jwt.verify = (token, options) => {
    return jwt.verify(
      token,
      config.jwt.secret,
      Object.assign({}, config.jwt.verify, options)
    );
  };

  app.jwt.sign = (payload, options) => {
    return jwt.sign(
      payload,
      config.jwt.secret,
      Object.assign({}, config.jwt.sign, options)
    );
  };

  app.jwt.decode = jwt.decode;

  config.appMiddleware.unshift(MIDDLEWARE_NAME_JWT);
};
