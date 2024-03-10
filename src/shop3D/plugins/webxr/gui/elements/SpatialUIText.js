import SpatialUIElement from "../SpatialUIElement.js";
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * @class SpatialUIText
 * @classdesc Text.
 * @extends SpatialUIElement
 */
class SpatialUIText extends SpatialUIElement {
    /**
     * @constructor
     * @param {string} text - The text.
     * @param {Object} textOptions - The text options.
     * @param {string} color - The color.
     * 
     * The textOptions object can contain the following properties:
     * 1. font: The font.
     * 2. size: The size.
     * 3. height: The height.
     * 4. curveSegments: The curve segments.
     * 5. bevelEnabled: The bevel enabled.
     * 6. bevelThickness: The bevel thickness.
     * 7. bevelSize: The bevel size.
     * 8. bevelOffset: The bevel offset.
     * 9. bevelSegments: The bevel segments.
     */
    constructor(text, textOptions, color) {
        super(new THREE.Mesh(
            new TextGeometry(text, textOptions),
            [
                new THREE.MeshBasicMaterial( { color } ), // front
                new THREE.MeshBasicMaterial( { color } ) // side
            ]
        ));

        this.textOptions = textOptions;
        this.color = color;
    }

    setText(text) {
        const oldGeometry = this.object3D.geometry;
        oldGeometry.dispose();

        const newGeometry = new TextGeometry(text, this.textOptions)
        this.object3D.geometry = newGeometry;
        
    }

    static async loadFont(fontUrl) {
        const loader = new FontLoader();
        return await loader.loadAsync(fontUrl);
    }
}

export default SpatialUIText
