const assert = require('assert')
const stream = require('stream')
const del = require('del')
const fs = require('fs')
const UnityExtractClient = require('../').UnityExtractClient

const cleanup = (done) => {
    del(`${__dirname}/19248/**`, {
        force: true
    }).then(() => {
        done()
    }, done)
}

describe('UnityExtractClient', () => {
    before((done) => {
        cleanup(done)
    })
    after((done) => {
        cleanup(done)
    })

    it('should construct', () => {
        new UnityExtractClient()
    })

    it('should createDecryptStream', () => {
        const client = new UnityExtractClient()

        const dStream = client.createExtractStream(`${__dirname}/19248.pkg.decr`, `${__dirname}/19248`)

        assert.ok(dStream instanceof stream.Stream)
    })

    it('should extract', (done) => {
        const client = new UnityExtractClient()

        const dest = `${__dirname}/19248`

        client.extract(`${__dirname}/19248.pkg.decr`, dest)
            .then((resultDest) => {
                assert.equal(resultDest, dest)
                assert.ok(fs.existsSync(`${__dirname}/19248/.icon.png`))
                
                done()
            }, done)
    }).timeout(5000)

    //TODO: this is failing because conversion requires knowledge of the package layout, which varies
    // by unity version - currently it's pathname|asset|asset.meta, in the past we had pathname|asset|metaData
    // support at least both of these, and more as they're identified
    it('should convert', (done) => {
        const client = new UnityExtractClient()

        const dest = `${__dirname}/19248`

        client.extract(`${__dirname}/19248.pkg.decr`, dest)
            .then(() => {
                return client.convert(dest)
                    .then((resultDest) => {
                        assert.equal(resultDest, dest)
                        assert.ok(fs.existsSync(`${__dirname}/19248/.icon.png`))
                        
                        done()
                    }, done)
            }, done)
    }).timeout(5000)
})