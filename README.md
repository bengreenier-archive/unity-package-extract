# unity-package-extract

> Note: uses es6 classes, see [this](http://node.green/#ES2015-functions-class) for node version compatibility

[![Build Status](https://travis-ci.org/bengreenier/unity-package-extract.svg?branch=master)](https://travis-ci.org/bengreenier/unity-package-extract)

Client for extracting packages downloaded from the unity package service. 

## How

Do I...

### Install

Simple! Just `npm install unity-package-extract`

### Use

See the following (or the [tests](./test/basic.js)):

```
const client = new UnityExtractClient()

client.extract(src, dest).then(...)
client.convert(src, dest).then(...)
```

Where `extract` unzips a decrypted package (see [bengreenier/unity-package-decrypt](https://github.com/bengreenier/unity-package-decrypt) for more info)
into a given folder. And `convert` moves and appropriately names the content from one directory to another.

## License

MIT
