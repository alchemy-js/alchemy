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

// optional tramsuter example
const markdownTransmuter = () => (context, file, done) => {
  const { src, dest, layouts } = context;
  const { content, data, ext } = file;
  // transmute incoming file data here!
  done();
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
  .transmute(markdownTransmuter())
  .build()
  // optional watch method accepts an array of directories to listen to
  .watch([
    './example/data',
    './example/layouts',
   ]);
```