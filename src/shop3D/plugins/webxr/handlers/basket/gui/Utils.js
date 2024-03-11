import SpatialUI from "../../../gui/SpatialUI.js"
import * as THREE from 'three';

let font = null

async function asyncInitFont() {
    if (font === null) {
        font = await SpatialUI.SpatialUIText.loadFont('fonts/helvetiker_regular.typeface.json')
    }
}

function createButton(label) {
    const text = createText(label, 0x000000)
    return new SpatialUI.SpatialUIButton(1.3, 0.5, 0xFFFFFF, 0xCCCDDD, text)
}

function createText(label, color) {
    return new SpatialUI.SpatialUIText(label, { font, size: .2, height: .01 }, color)
}

function createGrid(rows, columns) {
    return new SpatialUI.SpatialUIGrid(rows, columns, 0.9, 0.8)
}

function createCard (label) {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const threeColor = parseInt(randomColor, 16)
    const card = new SpatialUI.SpatialUIBuilder()
        .addPanel(0.8, 0.6, threeColor, 'Product_Card ' + i)
        .addText(label, { font, size: .2, height: .01 }, 0xFFFFFF, 'Product_Card_Text')
        .build().container
    return card
}

class ContentPaginator {
    constructor(perPage) {
        this.content = []
        this.page = 0
        this.perPage = perPage
        this.maxPages = this.content.length / perPage
        this.eventDispatcher = new THREE.EventDispatcher()
    }

    dispatchChange() {
        this.eventDispatcher.dispatchEvent({ 
            type: 'pageChange', 
            page: this.page,
            maxPages: this.maxPages 
        })
    }

    addPageChangeListener(listener) {
        this.eventDispatcher.addEventListener('pageChange', listener)
    }

    removePageChangeListener(listener) {
        this.eventDispatcher.removeEventListener('pageChange', listener)
    }

    previousPage() {
        if (this.page > 0) {
            this.page--
            this.dispatchChange()
        }
    }
    
    nextPage() {
        if (this.page < this.maxPages) {
            this.page++
            this.dispatchChange()
        }
    }

    setContent(newContent) {
        this.content.length = 0
        this.content.push(...newContent)
        this.maxPages = this.content.length / this.perPage
        this.page = 0
        this.dispatchChange()
    }
}

export default {
    asyncInitFont,
    createButton,
    createText,
    createGrid,
    createCard,
    ContentPaginator
}
