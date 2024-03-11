import Page from "./Page.js";
import Utils from "./Utils.js";
import * as THREE from 'three';

class CheckoutPage extends Page {
    constructor(parent) {
        super(parent)

        const title = Utils.createText('Checkout', 0xFFFFFF)
        const desc = Utils.createText('Remove your headset to\n complete the purchase', 0xFFFFFF)
        const total = Utils.createText('Total: $0.00', 0xFFFFFF)
        const cancel = Utils.createButton('Cancel')

        title.setPosition(new THREE.Vector3(-2.15, 1.4, .0001))
        desc.setPosition(new THREE.Vector3(-1.65, 0.25, .0001))
        total.setPosition(new THREE.Vector3(-2.15, -1.4, .0001))
        cancel.setPosition(new THREE.Vector3(1.2, -1.3, .0001))

        this.container.addElement(title)
        this.container.addElement(desc)
        this.container.addElement(total)
        this.container.addElement(cancel)

        this.totalText = total

        cancel.addClickListener(this.hide.bind(this))
    }

    setTotal(total) {
        this.totalText.setText(`Total: ${total}`)
    }
}

export default CheckoutPage;
