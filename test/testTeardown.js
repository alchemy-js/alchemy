const fs = require('fs');

function testTeardown(arr) {
  arr.reverse().forEach((item) => {
    if (item.type === 'dir') {
      fs.rmdirSync(item.path);
    } else {
      fs.unlinkSync(item.path);
    }
  });
}

module.exports = testTeardown;
