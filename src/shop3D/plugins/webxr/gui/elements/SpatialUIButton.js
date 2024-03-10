import SpatialUIElement from "../SpatialUIElement.js";
import SpatialUIText from "./SpatialUIText.js";
import * as THREE from 'three';

/**
 * @class SpatialUIButton
 * @classdesc A simple flat colored button.
 * @extends SpatialUIElement
 */
class SpatialUIButton extends SpatialUIElement {
    /**
     * @constructor
     * @param {number} width - The width.
     * @param {number} height - The height.
     * @param {string} color - The color.
     * @param {SpatialUIText} spatialUIText - The spatial UI text.
     */
    constructor(width, height, color, hoverColor, spatialUIText) {
        super(new THREE.Mesh(
            new THREE.PlaneGeometry(width, height),
            new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })
        ));

        if (!(spatialUIText instanceof SpatialUIText)) {
            throw new Error('The spatialUIText must be an instance of SpatialUIText');
        }

        // Center the text
        const box = new THREE.Box3().setFromObject(spatialUIText.object3D);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        center.x -= size.x;
        center.y -= size.y;
        center.z -= size.z;
        spatialUIText.object3D.position.copy(center);
        
        this.color = color;
        this.hoverColor = hoverColor;
        this.addElement(spatialUIText);
        this.eventDispatcher = new THREE.EventDispatcher();
    }

    addClickListener(listener) {
        this.eventDispatcher.addEventListener('click', listener);
    }

    removeClickListener(listener) {
        this.eventDispatcher.removeEventListener('click', listener);
    }

    click() {
        this.eventDispatcher.dispatchEvent({ type: 'click' });
    }

    showHover() {
        this.object3D.material.color.set(this.hoverColor);
    }

    hideHover() {
        this.object3D.material.color.set(this.color);
    }

    intersectBox(box) {
        const point = new THREE.Vector3();
        this.object3D.getWorldPosition(point);
        return box.containsPoint(point);
    }
}

export default SpatialUIButton
