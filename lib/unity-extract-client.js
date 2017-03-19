const fs = require('fs')
const path = require('path')
const gunzip = require('gunzip-maybe')
const tar = require('tar-fs')
const write = require('write')
const del = require('del')
const combineStream = require('stream-combiner')
const flatten = arr => arr.reduce(
    (acc, val) => acc.concat(
        Array.isArray(val) ? flatten(val) : val
    ), []
)

module.exports = class UnityExtractClient
{
    constructor() {

    }

    createExtractStream(dest) {
        const extractor = tar.extract(dest)
        const extract = combineStream([gunzip(), extractor])

        extractor.on('finish', () => {
            extract.emit('finish')
        })

        return extract
    }

    extract(src, dest) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(src)
                .pipe(this.createExtractStream(dest))
                .on('end', () => {
                    resolve(dest)
                })
                .on('finish', () => {
                    resolve(dest)
                })
                .on('error', (err) => {
                    reject(err)
                })
        })
    }

    convert(src, dest) {
        dest = dest || src

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
                            meta: [`${stat.path}/asset.meta`, `${stat.path}/metaData`]
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
                        
                        let dataStr = data.toString();

                        resolve({
                            original: entry.original,

                            // we only use the first line because older formats have <path>\n<assethash>
                            // but we don't care about <assethash>
                            new: path.join(dest, dataStr.substring(0, dataStr.indexOf('\n'))),
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
                            return new Promise((resolve, reject) => {
                                fs.createReadStream(entry.asset)
                                    .pipe(write.stream(`${entry.new}`, {
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
                            })
                        }
                    }),
                    new Promise((resolve, reject) => {
                        fs.exists(entry.meta[0], (exists) => {
                            resolve(exists)
                        })
                    }).then((exists) => {
                        if (exists) {
                            return new Promise((resolve, reject) => {
                                fs.createReadStream(entry.meta[0])
                                    .pipe(write.stream(`${entry.new}.meta`, {
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
                            })
                        }
                    }),
                    new Promise((resolve, reject) => {
                        fs.exists(entry.meta[1], (exists) => {
                            resolve(exists)
                        })
                    }).then((exists) => {
                        if (exists) {
                            return new Promise((resolve, reject) => {
                                fs.createReadStream(entry.meta[1])
                                    .pipe(write.stream(`${entry.new}.meta`, {
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
                            })
                        }
                    })
                ]))
            })

            return Promise.all(fProms)
        })
        .then((results) => {
            let fProms = []

            results = flatten(results)

            results.filter(r => typeof r != 'undefined').forEach((result) => {
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