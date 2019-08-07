module.exports = [{
  type: 'dir',
  path: './test/fixture/',
}, {
  type: 'dir',
  path: './test/fixture/layouts',
}, {
  type: 'dir',
  path: './test/fixture/public',
}, {
  type: 'file',
  path: './test/fixture/public/index.md',
  content: Buffer.from('---\ntitle: Hello World\n---\n\n# Hello World!'),
}, {
  type: 'file',
  path: './test/fixture/public/about.md',
  content: Buffer.from('---\ntitle: About World\n---\n\n# About World!'),
}, {
  type: 'dir',
  path: './test/fixture/public/images',
}, {
  type: 'file',
  path: './test/fixture/public/images/header.png',
  content: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
}, {
  type: 'file',
  path: './test/fixture/public/images/background.jpg',
  content: Buffer.from([255, 216, 255]),
}, {
  type: 'dir',
  path: './test/fixture/public/images/icons',
}, {
  type: 'file',
  path: './test/fixture/public/images/icons/icon.svg',
}, {
  type: 'dir',
  path: './test/fixture/public/scripts',
}, {
  type: 'file',
  path: './test/fixture/public/scripts/main.js',
}, {
  type: 'dir',
  path: './test/fixture/public/styles',
}, {
  type: 'file',
  path: './test/fixture/public/styles/main.scss',
}, {
  type: 'dir',
  path: './test/fixture/data',
}, {
  type: 'file',
  path: './test/fixture/data/index.md',
  content: Buffer.from('---\ntitle: Hello World\n---\n\n# Hello World!'),
}, {
  type: 'file',
  path: './test/fixture/data/about.md',
  content: Buffer.from('---\ntitle: About World\n---\n\n# About World!'),
}, {
  type: 'dir',
  path: './test/fixture/data/images',
}, {
  type: 'file',
  path: './test/fixture/data/images/header.png',
  content: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
}, {
  type: 'file',
  path: './test/fixture/data/images/background.jpg',
  content: Buffer.from([255, 216, 255]),
}, {
  type: 'dir',
  path: './test/fixture/data/images/icons',
}, {
  type: 'file',
  path: './test/fixture/data/images/icons/icon.svg',
}, {
  type: 'dir',
  path: './test/fixture/data/scripts',
}, {
  type: 'file',
  path: './test/fixture/data/scripts/main.js',
}, {
  type: 'dir',
  path: './test/fixture/data/styles',
}, {
  type: 'file',
  path: './test/fixture/data/styles/main.scss',
}];
