import * as THREE from 'three';

/**
 * @class SpatialUIElement
 * @classdesc A spatial UI element.
 * @property {THREE.Object3D} object3D - The object.
 * @property {Function} setPosition - Set the position of the spatial UI.
 * @property {Function} setRotation - Set the rotation of the spatial UI.
 * @property {Function} setVisbility - Set the visibility of the spatial UI.
 * @property {Function} addElement - Add another spatial UI element to this element.
 * @property {Function} removeElement - Remove a spatial UI element from this element.
 * @property {Function} add - Add an object to the spatial UI.
 * @property {Function} remove - Remove an object from the spatial UI.
 */
export default class SpatialUIElement {
    /**
     * @constructor
     * @param {THREE.Object3D} object3D - The object.
     */
    constructor(object3D) {
        if (!(object3D instanceof THREE.Object3D)) {
            throw new Error('The object3D must be an instance of THREE.Object3D');
        }

        this.object3D = object3D;
        this.children = [];
    }

    /**
     * @function setPosition
     * @description Set the position of the spatial UI.
     * @param {THREE.Vector3} position - The position.
     * @returns {void}
     * @throws {Error} The position must be an instance of THREE.Vector3.
     */
    setPosition(position) {
        if (!(position instanceof THREE.Vector3)) {
            throw new Error('The position must be an instance of THREE.Vector3');
        }

        this.object3D.position.copy(position);
    }

    /**
     * @function setRotation
     * @description Set the rotation of the spatial UI.
     * @param {THREE.Quaternion} rotation - The rotation.
     * @returns {void}
     * @throws {Error} The rotation must be an instance of THREE.Quaternion.
     */
    setRotation(rotation) {
        this.object3D.rotation.copy(rotation);
    }

    /**
     * @function setVisbility
     * @description Set the visibility of the spatial UI.
     * @param {boolean} visible - The visibility.
     * @returns {void}
     * @throws {Error} The visible must be a boolean.
     */
    setVisbility(visible) {
        if (typeof visible !== 'boolean') {
            throw new Error('The visible must be a boolean');
        }

        this.object3D.visible = visible;
    }

    /**
     * @function setName
     * @description Set the name of the spatial UI.
     * @param {string} name - The name.
     * @returns {void}
     * @throws {Error} The name must be a string.
     */
    setName(name) {
        if (typeof name !== 'string') {
            throw new Error('The name must be a string');
        }

        this.object3D.name = name;
    }

    /**
     * @function addElement
     * @description Add another spatial UI element to this element.
     * @param {SpatialUIElement} spatialUIElement - The spatial UI element to add.
     * @returns {void}
     * @throws {Error} The spatialUIElement must be an instance of SpatialUIElement.
     */
    addElement(spatialUIElement) {
        if (!(spatialUIElement instanceof SpatialUIElement)) {
            throw new Error('The spatialUIElement must be an instance of SpatialUIElement');
        }

        this.object3D.add(spatialUIElement.object3D);
        this.children.push(spatialUIElement);
    }

    /**
     * @function removeElement
     * @description Remove a spatial UI element from this element.
     * @param {SpatialUIElement} spatialUIElement - The spatial UI element to remove.
     * @returns {void}
     * @throws {Error} The spatialUIElement must be an instance of SpatialUIElement.
     */
    removeElement(spatialUIElement) {
        if (!(spatialUIElement instanceof SpatialUIElement)) {
            throw new Error('The spatialUIElement must be an instance of SpatialUIElement');
        }
        
        this.object3D.remove(spatialUIElement.object3D);
        
        const index = this.children.indexOf(spatialUIElement);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    /**
     * @function clearChildren
     * @description Clear the children of the spatial UI element.
     * @returns {void}
     */
    clearChildren() {
        for (let i = 0; i < this.children.length; i++) {
            this.object3D.remove(this.children[i].object3D);
        }

        this.children.length = 0;
    }

    /**
     * @function setElements
     * @description Set the elements of the element.
     * @param {Array} elements - The elements.
     * @returns {void}
     * @throws {Error} The elements must be an array.
     * @throws {Error} The elements must be an array of SpatialUIElement.
     */
    setElements(elements) {
        if (!Array.isArray(elements)) {
            throw new Error('The elements must be an array');
        }

        for (let i = 0; i < elements.length; i++) {
            if (!(elements[i] instanceof SpatialUIElement)) {
                throw new Error('The elements must be an array of SpatialUIElement');
            }
        }

        this.clearChildren();
        this.children = elements;
        this.children.forEach((element) => {
            this.object3D.add(element.object3D);
        });
    }

    /**
     * @function findAllChildren
     * @description Find all the children and their children of the spatial UI element.
     * @returns {Array} The children.
     */
    findAllChildren() {
        const findAllChildren = (obj, arr) => {
            arr.push(obj)

            if (obj.children.length > 0) {
                for (let i = 0; i < obj.children.length; i++) {
                    findAllChildren(obj.children[i], arr)
                }
            }
        }
        const children = []
        findAllChildren(this, children)

        return children
    }

    /**
     * @function isParentVisible
     * @description Check if the parent is visible.
     * @returns {boolean} The result.
     */
    isParentVisible() {
        // Continue to check until a parent is not visible or the root is reached.
        let parent = this.object3D
        while (parent) {
            if (!parent.visible) {
                return false
            }

            parent = parent.parent
        }

        return true
    }

    /**
     * @function dispose
     * @description Dispose the spatial UI element and its children.
     * @returns {void}
     */
    dispose() {
        this.object3D.traverse((object3D) => {
            if (object3D.geometry) {
                object3D.geometry.dispose();
            }

            if (object3D.material) {
                //object3D.material.dispose();
            }
        });
    }
}

/**
 * @class SelectableSpatialUIElement
 * @classdesc An extension of the spatial UI element that signifies it is selectable.
 */
export class SelectableSpatialUIElement extends SpatialUIElement {
    constructor(object3D) {
        super(object3D);
    }

    isActive() {
        return this.object3D.visible && this.isParentVisible()
    }

    click() {
    }

    onPointerOver() {
    }

    onPointerOut() {
    }
}
