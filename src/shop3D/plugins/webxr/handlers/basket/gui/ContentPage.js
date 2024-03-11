import Page from "./Page.js";
import Utils from "./Utils.js";
import * as THREE from 'three';

class ContentPage extends Page {
    constructor(parent, showCheckoutPage) {
        super(parent)
        const rows = 3
        const columns = 5
        this.perPage = rows * columns
        this.paginator = new Utils.ContentPaginator(this.perPage);

        const title = Utils.createText('Basket Content', 0xFFFFFF)
        const empty = Utils.createText('No items in basket', 0xFFFFFF)
        const pages = Utils.createText('Pages 0/0', 0xFFFFFF)
        const grid = Utils.createGrid(rows, columns)
        const previous = Utils.createButton('Previous')
        const next = Utils.createButton('Next')
        const checkout = Utils.createButton('Checkout')
        const close = Utils.createButton('Close')

        title.setPosition(new THREE.Vector3(-2.15, 1.4, .0001))
        empty.setPosition(new THREE.Vector3(-2.15, 1.0, .0001))
        pages.setPosition(new THREE.Vector3(-2.15, -1.4, .0001))
        previous.setPosition(new THREE.Vector3(0.3, -1.3, .0001))
        next.setPosition(new THREE.Vector3(1.8, -1.3, .0001))
        grid.setPosition(new THREE.Vector3(0.25, .28, .0001))
        checkout.setPosition(new THREE.Vector3(1.8, 0.7, .0001))
        close.setPosition(new THREE.Vector3(1.8, 1.4, .0001))

        this.emptyText = empty

        this.container.addElement(title)
        this.container.addElement(empty)
        this.container.addElement(pages)
        this.container.addElement(grid)
        this.container.addElement(previous)
        this.container.addElement(next)
        this.container.addElement(checkout)
        this.container.addElement(close)

        const refreshPageText = (event) => {
            const page = event.page + 1
            const maxPages = event.maxPages
            this.pages.setText(`Pages ${page}/${maxPages}`)
        }

        const reloadContent = (event) => {
            const content = this.paginator.content
            const start = event.page * perPage
            const end = start + perPage
            const elements = []
            for (let i = start; i < end; i++) {
                if (i >= content.length) {
                    break
                }

                elements.push(createCard(content[i]))
            }

            grid.clearChildren()
            grid.setElements(elements)
            grid.arrangeElements()
        }

        previous.addClickListener(this.paginator.previousPage.bind(this.paginator))
        next.addClickListener(this.paginator.nextPage.bind(this.paginator))
        checkout.addClickListener(showCheckoutPage)
        close.addClickListener(this.closeParent.bind(this))

        this.paginator.addPageChangeListener(refreshPageText.bind(this))
        this.paginator.addPageChangeListener(reloadContent.bind(this))
    }

    setContent(newContent) {
        this.paginator.setContent(newContent)
        this.emptyText.setVisibility(newContent.length === 0)
    }
}

export default ContentPage;
