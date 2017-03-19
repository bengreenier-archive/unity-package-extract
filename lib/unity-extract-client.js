const fs = require('fs')
const path = require('path')
const gunzip = require('gunzip-maybe')
const tar = require('tar-fs')
const write = require('write')
const del = require('del')

module.exports = class UnityExtractClient
{
    constructor() {

    }

    createExtractStream(src, dest) {
        return fs.createReadStream(src)
        .pipe(gunzip())
        .pipe(tar.extract(dest))
    }

    extract(src, dest) {
        return new Promise((resolve, reject) => {
            this.createExtractStream(src, dest)
                .on('finish', () => {
                    resolve(dest)
                })
                .on('error', (err) => {
                    reject(err)
                })
        })
    }

    convert(src) {
        return new Promise((resolve, reject) => {
            fs.readdir(src, (err, res) => {
                if (err) return reject(err)
                resolve(res)
            })
        })
        .then((files) => {
            let fProms = []

            files.forEach((file) => {
                fProms.push(new Promise((resolve, reject) => {
                    let fullPath = path.join(src, file)

                    fs.stat(fullPath, (err, stat) => {
                        if (err) return reject(err)

                        stat.path = fullPath
                        resolve(stat)
                    })
                }).then((stat) => {
                    if (stat.isDirectory()) {
                        return {
                            original: stat.path,
                            path: `${stat.path}/pathname`,
                            asset: `${stat.path}/asset`,
                            meta: `${stat.path}/asset.meta`
                        }
                    } else {
                        return false
                    }
                }))
            })

            return Promise.all(fProms)
        }).then((paths) => {
            let fProms = []

            paths.filter(e => e !== false).forEach((entry) => {
                fProms.push(new Promise((resolve, reject) => {
                    fs.readFile(entry.path, (err, data) => {
                        if (err) return reject(err)
                        resolve({
                            original: entry.original,
                            new: path.join(src, data.toString()),
                            asset: entry.asset,
                            meta: entry.meta
                        })
                    })
                }))
            })

            return Promise.all(fProms)
        }).then((locations) => {
            let fProms = []

            locations.forEach((entry) => {
                fProms.push(Promise.all([
                    new Promise((resolve, reject) => {
                        fs.exists(entry.asset, (exists) => {
                            resolve(exists)
                        })
                    }).then((exists) => {
                        if (exists) {
                            fs.createReadStream(entry.asset)
                                .pipe(write.stream(`${entry.new}.asset`, {
                                    encoding: 'binary'
                                }))
                                .on('finish', () => {
                                    resolve({
                                        original: entry.original,
                                        new: entry.new
                                    })
                                })
                                .on('error', (err) => {
                                    reject(err)
                                })
                        }
                    }),
                    new Promise((resolve, reject) => {
                        fs.exists(entry.meta, (exists) => {
                            resolve(exists)
                        })
                    }).then((exists) => {
                        if (exists) {
                            fs.createReadStream(entry.meta)
                                .pipe(write.stream(`${entry.new}.asset.meta`, {
                                    encoding: 'utf8'
                                }))
                                .on('finish', () => {
                                    resolve({
                                        original: entry.original,
                                        new: entry.new
                                    })
                                })
                                .on('error', (err) => {
                                    reject(err)
                                })
                        }
                    })
                ]))
            })

            return Promise.all(fProms)
        })
        .then((results) => {
            let fProms = []

            results.forEach((result) => {
                fProms.push(del(result.original, {
                    force: true
                }).then(() => {
                    return result.new
                }))
            })

            return Promise.all(fProms)
        })
    }
}