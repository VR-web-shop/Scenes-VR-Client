import * as THREE from 'three'

export class Selectable {
    constructor(mesh) {
        this.mesh = mesh
        this.collider = new THREE.Box3().setFromObject(this.mesh)
    }

    intersectsBox(otherBox) {
        this.collider.setFromObject(this.mesh)
        return this.collider.intersectsBox(otherBox)
    }

    setPosition(target) {
        this.mesh.position.copy(target)
    }
    
    onSelect() {}
    onDeselect() {}
}

export class SelectableProduct extends Selectable {
    constructor(mesh) {
        super(mesh)
        this.lastPosition = new THREE.Vector3().copy(mesh.position)
    }

    onSelect() {
    }

    onDeselect() {
        this.mesh.position.copy(this.lastPosition)
    }
}

export class SelectableBasket extends Selectable {
    constructor(mesh, basketHandler) {
        super(mesh)
        this.basketHandler = basketHandler
        this.mesh.visible = false
    }

    onSelect() {
    }

    onDeselect() {
        this.mesh.visible = false
    }
}

/**
 * @class SelectHandler
 * @classdesc The select handler.
 * @param {Object} plugin - The webxr plugin.
 * @property {Function} start - Start the teleporter.
 * @property {Function} stop - Stop the teleporter.
 * @property {Function} addSelectable - Add a selectable.
 * @property {Function} removeSelectable - Remove a selectable.
 */
function SelectHandler(plugin) {
    const selectables = [];
    let offset = new THREE.Vector3();
    let selected = null;
    let interval = null;

    const update = function(target) {
        if (selected) {
            const nextPosition = target.position.clone().sub(offset)
            selected.setPosition(nextPosition)
        }
    }

    const clearSelected = function() {
        if (selected) {
            selected.onDeselect();
            selected = null;
        }

        if (interval) {
            clearInterval(interval);
            interval = null;
        }
    }

    this.sessionStarted = function() {
    }

    this.sessionEnded = function() {
        clearSelected();
    }

    this.start = function(event) {
        const target = event.target;
        const box = new THREE.Box3().setFromObject(target);
        for (let i = 0; i < selectables.length; i++) {
            if (selectables[i].intersectsBox(box)) {
                selectables[i].onSelect();
                selected = selectables[i];
                offset.copy(target.position).sub(selected.mesh.position)
                break;
            }
        }

        if (selected) {
            interval = setInterval(() => {
                update(target)
            }, 1000 / 60)
        }
    }

    this.stop = function(event) {
        clearSelected();
    }

    this.exit = function() {
        selectables.length = 0;
        clearSelected();
    }

    this.addSelectable = function(selectable) {
        if (!(selectable instanceof Selectable)) {
            throw new Error('The selectable is not an instance of Selectable')
        }

        selectables.push(selectable);
    }

    this.removeSelectable = function(mesh) {
        for (let i = 0; i < selectables.length; i++) {
            if (selectables[i].mesh.uuid === mesh.uuid) {
                selectables.splice(i, 1);
                break;
            }
        }
    }
}

export default SelectHandler
