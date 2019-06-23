const { FuseBox } = require('fuse-box')
const { JSONPlugin } = require('fuse-box')

const fuse = FuseBox.init({
  homeDir: 'src',
  output: 'dist/$name.js',
  tsConfig: 'tsconfig.json',
  target: 'browser',
  plugins: [['**.json', JSONPlugin()]],
  natives: {
    stream: false,
    process: false,
    Buffer: false,
    http: false
  }
})

fuse.bundle('index').instructions(`> index.js`)

fuse.run()
