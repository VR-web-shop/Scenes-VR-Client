import Socket from '../Socket.js'
import * as THREE from 'three'

/**
 * @class SocketMesh
 * @description A special type of socket that is connected to a mesh.
 * Can be used to create a socket for a VR controller.
 * @extends Socket 
 */
export default class SocketMesh extends Socket {
    constructor(mesh) {
        super()
        this.mesh = mesh
        // Override the socket position to
        // use the mesh position
        this.position = mesh.position
    }

    intersect(selectables) {
        const box = new THREE.Box3().setFromObject(this.mesh);
        const selectable = selectables.find(selectable => selectable.intersectsBox(box))
        return selectable
    }
}
