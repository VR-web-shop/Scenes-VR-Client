import SpatialUIElement from "../SpatialUIElement.js";
import SpatialUIText from "./SpatialUIText.js";
import SpatialUIButton from "./SpatialUIButton.js";
import SpatialUIGrid from "./SpatialUIGrid.js";
import * as THREE from 'three';

/**
 * @class SpatialUIPaginator
 * @classdesc An UI element for pagination.
 * @extends SpatialUIElement
 */
class SpatialUIPaginator extends SpatialUIElement {
    /**
     * @constructor
     */
    constructor(paginatableContainer, prevButton, nextButton, pagesText, emptyText, perPage = 1) {
        super(new THREE.Group());

        if (!(paginatableContainer instanceof SpatialUIGrid)) {
            throw new Error('The paginatable container must be a spatial UI grid');
        }

        if (!(prevButton instanceof SpatialUIButton)) {
            throw new Error('The previous button must be a spatial UI button');
        }

        if (!(nextButton instanceof SpatialUIButton)) {
            throw new Error('The next button must be a spatial UI button');
        }

        if (!(pagesText instanceof SpatialUIText)) {
            throw new Error('The pages text must be a spatial UI text');
        }

        if (!(emptyText instanceof SpatialUIText)) {
            throw new Error('The empty text must be a spatial UI text');
        }

        if (typeof perPage !== 'number') {
            throw new Error('The per page must be a number');
        }

        this.object3D.add(paginatableContainer.object3D);
        this.object3D.add(prevButton.object3D);
        this.object3D.add(nextButton.object3D);
        this.object3D.add(pagesText.object3D);
        this.object3D.add(emptyText.object3D);
        this.children.push(paginatableContainer, prevButton, nextButton, pagesText, emptyText);

        this.eventDispatcher = new THREE.EventDispatcher()
        this.paginatableContainer = paginatableContainer;
        this.prevButton = prevButton;
        this.nextButton = nextButton;
        this.emptyText = emptyText;
        this.pagesText = pagesText;
        this.pagesTextPrefix = pagesText.text;

        this.perPage = perPage
        this.content = []
        this.page = 0
        
        this.prevButton.addClickListener(this.previousPage.bind(this))
        this.nextButton.addClickListener(this.nextPage.bind(this))
        this.eventDispatcher.addEventListener('pageChange', () => {
            const text = this.content.length > 0 ? `${this.page + 1} / ${this.maxPages()}` : '1 / 1'
            this.pagesText.setText(`${this.pagesTextPrefix} ${text}`)
        })
    }

    /**
     * @function getPage
     * @description Get the current page.
     * @returns {number} - The current page.
     */
    getPage() {
        return this.page
    }

    /**
     * @function getMaxPages
     * @description Get the maximum number of pages.
     * @returns {number} - The maximum number of pages.
     */
    maxPages() {
        return Math.ceil(this.content.length / this.perPage)
    }

    /**
     * @function dispatchChange
     * @description Dispatch a change event.
     * @returns {void}
     */
    dispatchChange() {
        this.eventDispatcher.dispatchEvent({ 
            type: 'pageChange', 
            page: this.page,
            maxPages: this.maxPages()
        })
    }

    hideAllElements() {
        for (let i = 0; i < this.content.length; i++) {
            this.content[i].setVisbility(false)
        }
    }

    /**
     * @function arrangeElements
     * @description Arrange the elements after a change.
     * @returns {void}
     */
    arrangeElements() {
        this.hideAllElements()
        const start = this.page * this.perPage
        const end = start + this.perPage
        const elements = []
        for (let i = start; i < end; i++) {
            if (i < this.content.length) {
                this.content[i].setVisbility(true)
                elements.push(this.content[i])
            }
        }
        
        this.paginatableContainer.setElements(elements)
        this.paginatableContainer.arrangeElements() // Should ensure this container has an arrangeElements method
        this.emptyText.setVisbility(elements.length === 0)
    }

    /**
     * @function addElement
     * @description Add another spatial UI element to this element.
     * @param {SpatialUIElement} spatialUIElement - The spatial UI element to add.
     * @returns {void}
     * @throws {Error} The spatialUIElement must be an instance of SpatialUIElement.
     * @override
     */
    addElement(spatialUIElement) {
        this.content.push(spatialUIElement)
        this.showFirstPage()
    }

    /**
     * @function removeElement
     * @description Remove a spatial UI element from this element.
     * @param {SpatialUIElement} spatialUIElement - The spatial UI element to remove.
     * @returns {void}
     * @throws {Error} The spatialUIElement must be an instance of SpatialUIElement.
     * @override
     */
    removeElement(spatialUIElement) {
        this.content = this.content.filter(element => element !== spatialUIElement)
        if (this.page >= this.maxPages() - 1 && this.page > 0) {
            this.page = this.maxPages() - 1
        }

        this.arrangeElements()
        this.dispatchChange()
    }

    /**
     * @function removeElements
     * @description Remove the content of the paginator.
     * @returns {void}
     */
    removeElements() {
        this.content.length = 0
        this.showFirstPage()
    }

    /**
     * @function setElements
     * @description Set the elements of the element.
     * @param {Array} elements - The elements.
     * @returns {void}
     * @throws {Error} The elements must be an array.
     * @throws {Error} The elements must be an array of SpatialUIElement.
     * @override
     */
    setElements(elements) {
        this.content.length = 0
        this.content.push(...elements)
        this.showFirstPage()   
    }

    /**
     * @function addPageChangeListener
     * @description Add a listener for page change.
     * @param {Function} listener - The listener.
     * @returns {void}
     */
    addPageChangeListener(listener) {
        this.eventDispatcher.addEventListener('pageChange', listener)
    }

    /**
     * @function removePageChangeListener
     * @description Remove a listener for page change.
     * @param {Function} listener - The listener.
     * @returns {void}
     */
    removePageChangeListener(listener) {
        this.eventDispatcher.removeEventListener('pageChange', listener)
    }

    /**
     * @function showFirstPage
     * @description Show the first page.
     * @returns {void}
     */
    showFirstPage() {
        this.page = 0
        this.arrangeElements()
        this.dispatchChange()
    }

    /**
     * @function showLastPage
     * @description Show the last page.
     * @returns {void}
     */
    showLastPage() {
        this.page = this.maxPages()
        this.arrangeElements()
        this.dispatchChange()
    }

    /**
     * @function previousPage
     * @description Go to the previous page.
     * @returns {void}
     */
    previousPage() {
        if (this.page > 0) {
            this.page--
            this.arrangeElements()
            this.dispatchChange()
        }
    }
    
    /**
     * @function nextPage
     * @description Go to the next page.
     * @returns {void}
     */
    nextPage() {
        if (this.page < this.maxPages() - 1) {
            this.page++
            this.arrangeElements()
            this.dispatchChange()
        }
    }
}

export default SpatialUIPaginator
