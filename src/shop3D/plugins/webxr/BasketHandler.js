import * as THREE from 'three'

/**
 * @class SelectPoint
 * @classdesc The Select Point.
 * @param {Object} scene - The scene.
 * @property {Function} setPosition - Set the position of the pointer.
 * @property {Function} dispose - Dispose the pointer.
 */
function SelectPoint(plugin, offset=new THREE.Vector3(0, 0, 0)) {
    const scene = plugin.view.scene
    const cubeGeometry = new THREE.BoxGeometry(.1, .1, .1)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF })
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    scene.add(cube)

    this.setPosition = function(position) {
        cube.position.copy(position)
    }

    this.dispose = function() {
        cubeGeometry.dispose()
        cubeMaterial.dispose()
        scene.remove(cube)
    }

    this.setVisbility = function(visible) {
        cube.visible = visible
    }

    this.updatePosition = function() {
        const xr = plugin.view.renderer.xr
        if (xr.isPresenting) {
            const camera = xr.getCamera()
            const position = new THREE.Vector3()
            camera.getWorldPosition(position)
            cube.position.copy(position).add(offset)
        }
    }

    this.intersectsBox = function(box) {
        const point = new THREE.Vector3()
        cube.getWorldPosition(point)
        return box.containsPoint(point)
    }
}

function BasketHandler(plugin) {
    const checkouts = []
    let basketSelected = false
    let basketInterval = null
    let selectPoint = null;
    let interval = null;
    let basket = null;

    const clearSelectPoint = function() {
        if (selectPoint) {
            selectPoint.dispose()
            selectPoint = null
        }

        if (interval) {
            clearInterval(interval)
            interval = null
        }
    }

    const clearSelected = function() {
        if (basketSelected) {
            basket.visible = false
            basketSelected = false
            clearInterval(basketInterval)
            basketInterval = null
        }
    }

    const clear = function() {
        clearSelectPoint()
        clearSelected()
        checkouts.length = 0
        basket = null
    }

    this.sessionStarted = function() {
        selectPoint = new SelectPoint(plugin, new THREE.Vector3(-1, -.5, -.5))
        interval = setInterval(() => {
            selectPoint.updatePosition()
        }, 1000 / 60)
    }

    this.sessionEnded = function() {
        clearSelectPoint()
    }

    this.start = function(event) {
        if (!basket || basketSelected) {
            return
        }

        const target = event.target;
        if (!basketSelected) {
            const box = new THREE.Box3().setFromObject(target);
            if (selectPoint.intersectsBox(box)) {
                basketSelected = true;
                basket.visible = true;
            }
        }

        if (basketSelected) {
            basketInterval = setInterval(() => {
                basket.position.copy(target.position)
            }, 1000 / 60)
        }
    }

    this.stop = function(event) {
        clearSelected()
    }

    this.exit = function() {
        clear()
    }

    this.addCheckout = function(checkout) {
        checkouts.push(checkout);
    }

    this.removeCheckout = function(checkout) {
        const index = checkouts.indexOf(checkout);
        if (index > -1) {
            checkouts.splice(index, 1);
        }
    }

    this.addBasket = function(basketMesh) {
        basket = basketMesh;
    }

    this.getBasket = function() {
        return basket;
    }

    this.removeBasket = function() {
        basket = null;
    }
}

export default BasketHandler
