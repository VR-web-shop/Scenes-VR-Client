import SpatialUIElement from "../SpatialUIElement.js";
import * as THREE from 'three';

/**
 * @class SpatialUIGrid
 * @classdesc A grid container for spatial UI elements.
 * @extends SpatialUIElement
 */
class SpatialUIGrid extends SpatialUIElement {
    /**
     * @constructor
     * @param {number} columns - The number of columns.
     * @param {number} rows - The number of rows.
     * @param {number} rowSpacing - The row spacing.
     * @param {number} columnSpacing - The column spacing.
     */
    constructor(columns, rows, rowSpacing, columnSpacing) {
        super(new THREE.Group());

        this.columns = columns;
        this.rows = rows;
        this.rowSpacing = rowSpacing;
        this.columnSpacing = columnSpacing;
    }

    /**
     * @function arrangeElements
     * @description Arrange the elements in the grid.
     * @returns {void}
     */
    arrangeElements() {
        let elementIndex = 0;

        for (let i = this.rows - 1; i >= 0; i--) {
            for (let j = 0; j < this.columns; j++) {
                if (elementIndex >= this.children.length) {
                    return;
                }

                const element = this.children[elementIndex];
                const x = (j - this.columns / 2) * this.columnSpacing;
                const y = (i - this.rows / 2) * this.rowSpacing;
                
                element.setPosition(new THREE.Vector3(x, y, 0));
                elementIndex++;
            }
        }
    }

    /**
     * @function addElement
     * @description Add an element to the grid.
     * @param {SpatialUIElement} element - The element.
     * @returns {void}
     */
    addElement(element) {
        if (this.children.length >= this.columns * this.rows) {
            throw new Error('The grid is full');
        }

        super.addElement(element);
    }

    /**
     * @function setElements
     * @description Set the elements of the grid.
     * @param {Array} elements - The elements.
     * @returns {void}
     * @throws {Error} The elements must be an array.
     * @throws {Error} The elements must be an array of SpatialUIElement.
     * @throws {Error} The number of elements must be less than or equal to the number of rows times the number of columns.
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

        if (elements.length > this.columns * this.rows) {
            throw new Error('The number of elements must be less than or equal to the number of rows times the number of columns');
        }
        
        super.setElements(elements);
    }

}

export default SpatialUIGrid
