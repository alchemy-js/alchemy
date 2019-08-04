const Generator = require('../index.js');

// optional tramsuter example
const markdownTransmuter = () => (context, file, done) => {
  // transmute incoming file data here!
  done();
};

Generator({
  src: './example/data',
  dest: './example/public',
  layouts: './example/layouts',
}).clean()
  // optional extensionMapper method accepts an object to help with transmuted file extensions
  .extensionMapper({
    '.md': '.html',
  })
  // optional transmute method accepts a function to operate upon file data
  .transmute(markdownTransmuter())
  .build()
  // optional watch method accepts an array of directories to listen to
  .watch([
    './example/data',
    './example/layouts',
  ]);
