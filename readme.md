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
- Accepts an option object with values for `src`, `dest`, and `layouts`.

##### Alchemy.clean()
- Cleans the destination directory
- Useful when a file or directory has been removed in between builds

##### Alchemy.extensionMap([object]) (optional)
- Provides a map for when file extensions need to change due to transmutations

##### Alchemy.transmute([function]) (optional)
- Transmute the contents of a file
- Accepts a function that returns a function with `context`, `file`, and `done` parameters
  - `contenxt` provides an object with a reference to the instance's `this.src`, `this.dest`, and `this.layouts` paths
  - `file` is an object containing `content` and `data` key/values from `gray-matter` and the `ext` file extension
  - `done` is a callback function that is called once transmutations are completed
    - this callback also accepts the transmuted `content` value and this value must be passed for any transmuted files to be generated

##### Alchemy.build()
- Builds the site in the `this.dest` directory

##### Alchemy.watch([array]) (optional)
- Watches an array of directories for changes
- Results in cleaning and building the project

```javascript
const Alchemy = require('@alchemy-js/alchemy');

// optional transmuter example
const exampleTransmuter = (options) => (context, file, done) => {
  // available read-only properties from the context object
  const { src, dest, layouts } = context;
  // available transmutable properties from file object
  const { content, data, ext, name } = file;
  // an example of a conditionally transmuted file
  if (ext === '.some-ext-we-want-to-work-with') {
    // operate on the incoming data from the above objects!
    const transmutedContent = 'return the eventual transmuted data';
    const transmutedData = 'can even transmute front-matter, if you choose';
    const transmutedExt = '.some-new-extension';
    // pass an object to done with updated values for whatever has changed
    return done({
      content: transmutedContent,
      data: transmutedData,
    });
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
  // optional extensionMapper method accepts an object to help with transmuted file extensions
  .extensionMapper({
    '.md': '.html',
  })
  // optional transmute method accepts a function to operate upon file data
  .transmute(exampleTransmuter())
  .build()
  // optional watch method accepts an array of directories to listen to
  .watch([
    './example/data',
    './example/layouts',
   ]);
```