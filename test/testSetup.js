const fs = require('fs');

function testSetup(arr) {
  arr.forEach((item) => {
    if (item.type === 'dir') {
      fs.mkdirSync(item.path);
    } else {
      fs.writeFileSync(item.path, item.content);
    }
  });
}

module.exports = testSetup;
