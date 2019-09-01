# Alchemy

## A dependency-light static site generator

Alchemy is a static site generator for Node.js that's been heavily inspired by tools such as Metalsmith and Jekyll, but to be as dependency-light and efficiency focused as possible.

Featuring a "transmuter system" and a clean, chainable API, Alchemy allows users to create their own transmuter functions to take an input source and transmute it into something else. This is very useful and flexible when performing operations such as converting markdown to HTML.

### Getting Started

- `npm i @alchemy-js/alchemy --save`

### Usage

Alchemy's chainable API executes sychronously. It's also important to note that the order in which transmute functions are chained can impact the output, depending upon what the expected behavior of each function is.

#### Public Methods

##### Alchemy([object])
- Returns a new instance of Alchemy static site generator
- Requires an object with values that represent `src` and `dest` paths

##### Alchemy.clean()
- Cleans the destination directory
- Useful when a file or directory has been removed in between builds

##### Alchemy.transmute([function]) (optional)
- Transmutes file data for site generation
- Accepts a function that returns a function containing `file`, and `done` parameters
  - `file` is an object containing `content` and `data` key/values from the `gray-matter` package, as well as file `dir`, `name`, and `ext`
  - `done` is a callback function that is called once transmutations are completed
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

```javascript
const Alchemy = require('@alchemy-js/alchemy');

Alchemy({ src: './data', dest: './public' })
  .clean()
  // optional transmute method accepts a closure to operate upon `{ file }` data
  .transmute(foobar())
  .build()
  // optional watch method accepts an array of directories to listen to
  .watch([
    './example/data',
    './example/layouts',
   ]);
```
