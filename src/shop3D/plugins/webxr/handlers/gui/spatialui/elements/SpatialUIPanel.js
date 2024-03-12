import { SelectableSpatialUIElement } from "../SpatialUIElement.js";
import * as THREE from 'three';

/**
 * @class SpatialUIPanel
 * @classdesc A simple flat colored panel.
 * @extends SpatialUIElement
 */
class SpatialUIPanel extends SelectableSpatialUIElement {
    /**
     * @constructor
     * @param {number} width - The width.
     * @param {number} height - The height.
     * @param {string} color - The color.
     */
    constructor(width, height, color) {
        super(new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide })
        ));
    }
}

export default SpatialUIPanel
