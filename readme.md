# Alchemy

## A dependency-light static site generator

Alchemy is a static site generator for Node.js that's been heavily inspired by tools such as Metalsmith and Jekyll, but to be as dependency-light and efficiency focused as possible.

Featuring a "transmuter system" and a clean, chainable API, Alchemy allows users to create their own transmuter functions to take an input source and transmute it into something else. This is very useful and flexible when performing operations such as converting markdown to HTML, appending new YAML with an array of certain content, pre-processing Sass to CSS, file templating such as Handlebars, or really any other file manipulation that can be of use.

### Getting Started

- `npm i @alchemy-js/alchemy --save`

### Usage

Alchemy's chainable API executes sychronously. It's also important to note that the order in which transmute functions are chained can impact the output, depending upon what the expected behavior of each function is. With this in mind, calls to `transmute` adds the passed in function to a queue. Once the `build` method is executed, Alchemy executes the contents of each transmute function from the previously created queue, following the FIFO (first in, first out) concept. For example, if a transmuter leverages a templating engine to convert Handlebars content to HTML and another transmuter is expecting the incoming file to already be an HTML document, then these must be in order, from top-down. If they were reversed, the process would fail.

#### Public Methods

##### Alchemy([object])
- Returns a new instance of Alchemy static site generator
- Requires an object with values that represent `src` and `dest` paths

##### Alchemy.clean()
- Cleans the destination directory, or creates one if it does not already exist
- Useful when a file or directory has been removed in between builds

##### Alchemy.transmute([function]) (optional)
- Transmutes file data for site generation
- Accepts a function that returns a function containing `file`, and `done` parameters
  - `file` is an object containing data related to the file that is currently being processed, specifically:
    - `content` and `data` key/values from the `gray-matter` package
    - Results from `path.prase` - specifically file `dir`, `name`, and `ext`
    - References to `src` and `dest`, the arguments passed to the `Alchemy` function
  - `done` is a callback function that must be called once transmutations are completed
    - this accepts an object that can contain whatever data that was transmuted from the `file` object. This transmuted data is then passed along to the next method in the chain
      - e.g., `{ content: [string], data: [object], dir: [string], name: [string], ext: [string] }`
    - additionally, there is a property that can be passed to ignore a file entirely from generation, having it not appear in the `dest` directory once the entire chain executes
      - e.g., `{ ignore: [boolean] }`
    - if a file is not transmuted or ignored, call `done()` with no arguments to continue the process

##### Alchemy.build()
- Builds the site in the `dest` directory

##### Alchemy.watch([array]) (optional)
- Watches an array of directories for changes
- Results in cleaning and building the project

#### Basic Example

```javascript
const Alchemy = require('@alchemy-js/alchemy');

Alchemy({ src: './data', dest: './public' })
  .clean()
  // optional transmute method accepts a closure to operate upon `{ file }` data,
  // followed by calling `done()` to move to the next chained method
  .transmute(foobar({
    // some config data for the foobar func here
  }))
  .build()
  .watch([
    './example/data',
    './example/layouts',
   ]);
```

#### Transmuter Function Example

```javascript
const Alchemy = require('@alchemy-js/alchemy');

const extUpdater = (options) => {
  const { find, replace } = options;
  return (file, done) => {
    if (file.ext === find) {
      done({ ext: replace })
    }
    done()
  }
}

Alchemy({ src: './data', dest: './public' })
  .clean()
  // extUpdater now changes each file extension from `.md` to `.html`
  .transmute(extUpdater({
    find: '.md',
    replace: '.html',
  }))
  .build()
  .watch([
    './example/data',
    './example/layouts',
   ]);
```

## MIT