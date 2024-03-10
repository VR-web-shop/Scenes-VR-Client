import SpatialUIElement from "../SpatialUIElement.js";
import * as THREE from 'three';

/**
 * @class SpatialUIContainer
 * @classdesc A container for spatial UI elements.
 * 1. Create a spatial UI container.
 * 2. Add spatial UI elements to the container.
 * 3. Add the container to the scene.
 * @property {THREE.Group} container - The container.
 * @property {Function} addToScene - Add the spatial UI to the scene.
 * @property {Function} removeFromScene - Remove the spatial UI from the scene.
 * @property {Function} add - Add an object to the spatial UI.
 * @property {Function} remove - Remove an object from the spatial UI.
 */
class SpatialUIContainer extends SpatialUIElement {

    /**
     * @constructor
     */
    constructor() {
        super(new THREE.Group())     
    }

    /**
     * @function addToScene
     * @description Add the spatial UI to the scene.
     * @param {THREE.Scene} scene - The scene.
     * @returns {void}
     */
    addToScene(scene) {
        if (!(scene instanceof THREE.Scene)) {
            throw new Error('The scene must be an instance of THREE.Scene');
        }

        scene.add(this.object3D);
    }

    /**
     * @function removeFromScene
     * @description Remove the spatial UI from the scene.
     * @returns {void}
     */
    removeFromScene() {
        if (!this.object3D.parent) {
            return;
        }

        this.object3D.parent.remove(this.object3D);
    }
}

export default SpatialUIContainer
