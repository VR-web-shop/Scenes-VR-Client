import Plugin from "../abstractions/plugins/Plugin.js";
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * @constant cacheList
 * @description The list of caches.
 * @type {Object}
 * @property {Object} meshes - The list of meshes.
 * @property {Object} materials - The list of materials.
 * @property {Object} textures - The list of textures.
 */
const cacheList = {
    meshes: {},
    materials: {},
    textures: {}
}

/**
 * @function calculateCASKey
 * @description Calculate the key for the cache.
 * @param {string} str - The string to be calculated.
 * @param {Array} arr - The array to be calculated.
 * @returns {string} The key.
 */
function calculateCASKey(str, arr = []) {
    const u = str.toString().toLowerCase()
    const s = JSON.stringify(arr).toLowerCase().replace(/[^a-z0-9|]/g, '')
    return btoa(`${u}#${s}`)
}

/**
 * @class caches plugin
 * @classdesc The plugin for the caches.
 * @extends Plugin
 * @property {Object} view - The view of the shop.
 */
class CachesPlugin extends Plugin {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function init
     * @description Initialize the plugin.
     * @param {Object} view - The view of the shop.
     * @returns {void}
     */
    init(view) {
        this.view = view
    }

    /**
     * @function exit
     * @description Dispose the plugin.
     * @returns {void}
     */
    exit() {
        const meshes = Object.values(cacheList.meshes)
        const materials = Object.values(cacheList.materials)
        const textures = Object.values(cacheList.textures)

        for (let i = 0; i < meshes.length; i++) {
            const objects = meshes[i]

            for (let j = 0; j < objects.length; j++) {
                this.view.scene.remove(objects[j])

                objects[j].traverse(child => {
                    if (child.isMesh) child.geometry.dispose()
                })
            }
        }

        for (let i = 0; i < materials.length; i++) {
            const objects = materials[i]

            for (let j = 0; j < objects.length; j++) {
                objects[j].dispose()
            }
        }

        for (let i = 0; i < textures.length; i++) {
            const objects = textures[i]

            for (let j = 0; j < objects.length; j++) {
                objects[j].dispose()
            }
        }

        cacheList.meshes = {}
        cacheList.materials = {}
        cacheList.textures = {} 
    }

    /**
     * @function loadMesh
     * @description Load a mesh.
     * @param {string} url - The url of the mesh.
     * @param {Array} submeshes - The submeshes of the mesh.
     * @returns {Promise} The promise to load the mesh.
     * @async
     * @static
     */
    static async loadMesh(url, submeshes = []) {
        const key = calculateCASKey(url, submeshes)

        if (cacheList.meshes[key]) {
            const clone = cacheList.meshes[key][0].clone()
            cacheList.meshes[key].push(clone)
            return clone
        }
        
        const loader = new GLTFLoader()
        const gltf = await loader.loadAsync(url)
        const mesh = gltf.scene

        const wrapper = new THREE.Object3D()
        const box3 = new THREE.Box3().setFromObject(mesh)
        const center = box3.getCenter(new THREE.Vector3())
        mesh.position.sub(center)
        wrapper.add(mesh)
        
        wrapper.traverse(async child => {
            if (child.isMesh) {
                const submesh = submeshes.find(e => e.name === child.name)
                if (submesh) {
                    child.material = await CachesPlugin.loadMaterial(submesh.material.type, submesh.material.textures)
                }
            }
        })

        cacheList.meshes[key] = [wrapper]

        return wrapper
    }

    /**
     * @function loadMaterial
     * @description Load a material.
     * @param {string} type - The type of the material.
     * @param {Array} textures - The textures of the material.
     * @returns {Promise} The promise to load the material.
     * @async
     * @static
     */
    static async loadMaterial(type, textures = []) {
        const key = calculateCASKey(type, textures)
        if (cacheList.materials[key]) {
            return cacheList.materials[key][0]
        }

        const material = new THREE[type]
        for (let i = 0; i < textures.length; i++) {
            const texture = await CachesPlugin.loadTexture(textures[i].src)
            material[textures[i].type] = texture
        }

        cacheList.materials[key] = [material]
        return material
    }

    /**
     * @function loadTexture
     * @description Load a texture.
     * @param {string} src - The source of the texture.
     * @returns {Promise} The promise to load the texture.
     * @async
     * @static
     */
    static async loadTexture(src) {
        const key = calculateCASKey(src)
        if (cacheList.textures[key]) {
            return cacheList.textures[key][0]
        }

        const texture = new THREE.TextureLoader().load(src)
        cacheList.textures[key] = [texture]
        return texture
    }

    /**
     * @function findByName
     * @description Find an object by name.
     * @param {string} cacheKey - The key of the cache.
     * @param {string} name - The name of the object.
     * @returns {Object}
     * @static
     */
    static findByName(cacheKey, name) {
        const cache = cacheList[cacheKey]
        for (const key in cache) {
            for (let i = 0; i < cache[key].length; i++) {
                if (cache[key][i].name === name) {
                    return cache[key][i]
                }
            }
        }
        return null 
    }

    /**
     * @function findByUUID
     * @description Find an object by UUID.
     * @param {string} cacheKey - The key of the cache.
     * @param {string} uuid - The UUID of the object.
     * @returns {Object}
     * @static
     */
    static findByUUID(cacheKey, uuid) {
        const cache = cacheList[cacheKey]
        for (const key in cache) {
            for (let i = 0; i < cache[key].length; i++) {
                if (cache[key][i].uuid === uuid) {
                    return cache[key][i]
                }
            }
        }
        return null
    }

    /**
     * @function removeByName
     * @description Remove an object by name.
     * @param {string} cacheKey - The key of the cache.
     * @param {string} name - The name of the object.
     * @returns {void}
     * @static
     */
    static removeByName(cacheKey, name) {
        const cache = cacheList[cacheKey]
        
        for (const key in cache) {
            
            for (let i = 0; i < cache[key].length; i++) {
                if (cache[key][i].name === name) {
                    const object = cache[key][i]
                    cache[key].splice(i, 1)
                    return object
                }
            }

            if (cache[key].length === 0) {
                delete cache[key]
            }
        }

        return null
    }

    /**
     * @function removeByUUID
     * @description Remove an object by UUID.
     * @param {string} cacheKey - The key of the cache.
     * @param {string} uuid - The UUID of the object.
     * @returns {void}
     * @static
     */
    static removeByUUID(cacheKey, uuid) {
        const cache = cacheList[cacheKey]
        for (const key in cache) {
            for (let i = 0; i < cache[key].length; i++) {
                if (cache[key][i].uuid === uuid) {
                    const object = cache[key][i]
                    cache[key].splice(i, 1)
                    return object
                }
            }

            if (cache[key].length === 0) {
                delete cache[key]
            }
        }

        return null
    }

    /**
     * @function debug
     * @description Debug the cache list.
     * @returns {void}
     * @static
     */
    static debug() {
        console.log(
            Object.values(cacheList.meshes),
            Object.values(cacheList.materials),
            Object.values(cacheList.textures)
        )
    }
}

export default CachesPlugin
