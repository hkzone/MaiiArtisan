/* eslint-disable no-bitwise */

const crypto = require('crypto');

class Security {
  static md5(value) {
    if (!value) {
      return;
    }
    return crypto.createHash('md5').update(value).digest('hex');
  }

  static isValidNonce(value, req) {
    return value === this.md5(req.sessionID + req.headers['user-agent']);
  }

  static generateId() {
    const timestamp = ((new Date().getTime() / 1000) | 0).toString(16);
    const template = '%'.repeat(16);
    return (
      timestamp +
      template
        .replace(/[%]/g, () => ((Math.random() * 16) | 0).toString(16))
        .toLowerCase()
    );
  }
}

module.exports = Security;
