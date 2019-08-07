# Alchemy

## A dependency-light static site generator

Alchemy is a static site generator for Node.js that's been heavily inspired by tools such as Metalsmith and Jekyll, but to be as dependency-light and efficiency focused as possible.

Featuring a "transmuter system" and a clean, chainable API, Alchemy allows users to create their own transmuter functions to take an input source and change it to something else. This is very useful and flexible when performing operations such as converting markdown to HTML.

### Getting Started

- `npm i @alchemy-js/alchemy --save`

### Usage

Alchemy's chainable API executes sychronously.

#### Public Methods

##### Alchemy([object])
- Returns a new instance of Alchemy static site generator
- Requires an object with values that represent `src` and `dest` paths

##### Alchemy.clean()
- Cleans the destination directory
- Useful when a file or directory has been removed in between builds

##### Alchemy.transmute([function]) (optional)
- Transmute the contents of a file
- Accepts a function that returns a function with `file`, and `done` parameters
  - `file` is an object containing `content` and `data` key/values from `gray-matter` and the file `name` and `ext`
  - `done` is a callback function that is called once transmutations are completed
    - this accepts an object that can contain whatever data that was transmuted from the `file` object
      - e.g., `{ content: 'new content here, ext: '.html' }`
    - additionally, there is a property that can be passed to ignore a file entirely from generation
      - e.g., `{ ignore: true }`
    - if a file is not transmuted, call `done()` with no arguments to continue the process

##### Alchemy.build()
- Builds the site in the `this.dest` directory

##### Alchemy.watch([array]) (optional)
- Watches an array of directories for changes
- Results in cleaning and building the project

```javascript
const Alchemy = require('@alchemy-js/alchemy');

// optional transmuter example
const exampleTransmuter = (options) => (file, done) => {
  // available transmutable properties from file object
  const { content, data, ext, name } = file;
  // an example of a conditionally transmuted file
  if (ext === '.some-ext-we-want-to-work-with') {
    // operate on the incoming data from the above objects!
    const transmutedContent = 'return the eventual transmuted data';
    const transmutedData = 'can even transmute front-matter, if you choose';
    const transmutedName = 'new file name? sure';
    const transmutedExt = '.some-new-extension';
    // pass an object to done with updated values for whatever has changed
    return done({
      content: transmutedContent,
      data: transmutedData,
      name: transmutedName,
      ext: transmutedExt,
    });
    /* optional "ignore" boolean can conditionally exclude files
     * return done({ ignore: true });
    */
  }
  // otherwise, we're done
  return done();
};

	
Alchemy({
    src: './data',
    dest: './public',
    layouts: './layouts',
  })
  .clean()
  // optional transmute method accepts a function to operate upon file data
  .transmute(exampleTransmuter())
  .build()
  // optional watch method accepts an array of directories to listen to
  .watch([
    './example/data',
    './example/layouts',
   ]);
```