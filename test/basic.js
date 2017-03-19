const assert = require('assert')
const stream = require('stream')
const del = require('del')
const fs = require('fs')
const path = require('path')
const UnityExtractClient = require('../').UnityExtractClient

const cleanup = (done) => {
    del([`${__dirname}/19248/**`, `${__dirname}/unity_modules`], {
        force: true
    }).then(() => {
        done()
    }, done)
}

const replaceAll = (target, search, replacement) => {
    return target.replace(new RegExp(search, 'g'), replacement)
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

    it('should createExtractStream', () => {
        const client = new UnityExtractClient()

        const dStream = client.createExtractStream(`${__dirname}/19248`)

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

    it('should convert in place', (done) => {
        const client = new UnityExtractClient()

        const dest = `${__dirname}/19248`

        client.extract(`${__dirname}/19248.pkg.decr`, dest)
            .then(() => {
                return client.convert(dest)
            })
            .then((results) => {
                
                const expected = [
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall4.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall4.tga`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit2.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit2.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Self-Illumin Diffuse Beige.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Self-Illumin Diffuse Beige.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/SteamSpray.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/SteamSpray.unity`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallWater.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallWater.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Prefabs/SteamSpray.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/SteamSpray.prefab`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallFoam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallFoam.mat`,
                    `${dest}/Assets/Water FX Pack/Scripts/ScrollUV.js`,
                    `${dest}/Assets/Water FX Pack/Scripts/ScrollUV.js`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud2.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud2.tga`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Snow.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Snow.unity`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud1.tga`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Waterfall.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Waterfall.prefab`,
                    `${dest}/Assets/Water FX Pack/Models/OBJ_WaterfallBig.fbx`,
                    `${dest}/Assets/Water FX Pack/Models/OBJ_WaterfallBig.fbx`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSnow.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSnow.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumSteamBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumSteamBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Textures/CloudRotation.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/CloudRotation.tga`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/VolumeSteam.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/VolumeSteam.unity`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit2.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit2.tga`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallSplashes.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallSplashes.mat`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Rain.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Rain.unity`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Rain.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Rain.prefab`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Waterfall.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Waterfall.unity`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Snow.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Snow.prefab`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall5.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall5.tga`,
                    `${dest}/Assets/Water FX Pack/Prefabs/VolumeSteam.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/VolumeSteam.prefab`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumeSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumeSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_snow1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_snow1.tga`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallMist.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallMist.mat`]
                
                expected.forEach((entry) => {
                    entry = replaceAll(entry, '\\\\', path.sep)
                    entry = replaceAll(entry, '/', path.sep)
                    
                    let found = false
                    
                    results.forEach((result) => {
                        result = replaceAll(result, '\\\\', path.sep)
                        result = replaceAll(result, '/', path.sep)
                        
                        if (entry == result) {
                            found = true
                        }
                    })
                    assert.ok(found, `missing ${entry}`)
                })

                done()
            }, done)
    }).timeout(5000)

    it('should convert and move', (done) => {
        const client = new UnityExtractClient()

        const dest = `${__dirname}/unity_modules`

        client.extract(`${__dirname}/19248.pkg.decr`, `${dest}/.temp`)
            .then(() => {
                return client.convert(`${dest}/.temp`, dest)
            })
            .then((results) => {
                
                const expected = [
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall4.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall4.tga`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit2.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit2.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Self-Illumin Diffuse Beige.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Self-Illumin Diffuse Beige.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/SteamSpray.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/SteamSpray.unity`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallWater.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterFallWater.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSpit.mat`,
                    `${dest}/Assets/Water FX Pack/Prefabs/SteamSpray.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/SteamSpray.prefab`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallFoam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallFoam.mat`,
                    `${dest}/Assets/Water FX Pack/Scripts/ScrollUV.js`,
                    `${dest}/Assets/Water FX Pack/Scripts/ScrollUV.js`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud2.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud2.tga`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Snow.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Snow.unity`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Cloud1.tga`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Waterfall.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Waterfall.prefab`,
                    `${dest}/Assets/Water FX Pack/Models/OBJ_WaterfallBig.fbx`,
                    `${dest}/Assets/Water FX Pack/Models/OBJ_WaterfallBig.fbx`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSnow.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxSnow.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumSteamBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumSteamBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Textures/CloudRotation.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/CloudRotation.tga`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/VolumeSteam.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/VolumeSteam.unity`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit2.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit2.tga`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallBottom.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallSplashes.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallSplashes.mat`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Rain.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Rain.unity`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Rain.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Rain.prefab`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Waterfall.unity`,
                    `${dest}/Assets/Water FX Pack/Demo Scenes/Waterfall.unity`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Snow.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/Snow.prefab`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall5.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_waterfall5.tga`,
                    `${dest}/Assets/Water FX Pack/Prefabs/VolumeSteam.prefab`,
                    `${dest}/Assets/Water FX Pack/Prefabs/VolumeSteam.prefab`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumeSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxVolumeSteam.mat`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/Spit.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_snow1.tga`,
                    `${dest}/Assets/Water FX Pack/Textures/FX_snow1.tga`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallMist.mat`,
                    `${dest}/Assets/Water FX Pack/Materials/Mat_FxWaterfallMist.mat`]
                
                expected.forEach((entry) => {
                    entry = replaceAll(entry, '\\\\', path.sep)
                    entry = replaceAll(entry, '/', path.sep)
                    
                    let found = false
                    
                    results.forEach((result) => {
                        result = replaceAll(result, '\\\\', path.sep)
                        result = replaceAll(result, '/', path.sep)
                        
                        if (entry == result) {
                            found = true
                        }
                    })
                    assert.ok(found, `missing ${entry}`)
                })

                done()
            }, done)
    }).timeout(5000)
})