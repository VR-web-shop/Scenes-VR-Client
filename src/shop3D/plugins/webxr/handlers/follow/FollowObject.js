import * as THREE from 'three'

/**
 * @class
 * @classdesc Follows the XR camera position and updates the object3D position accordingly.
 */
class FollowObject {
    constructor(view, object3D, offset) {
        this.xr = view.renderer.xr
        this.object3D = object3D
        this.offset = offset
        this.position = new THREE.Vector3()
    }

    follow() {
        if (FollowObject.getXRCameraPosition(this.xr, this.position)) {
            if (this.offset) {
                this.position.add(this.offset)
            }
            
            this.object3D.position.copy(this.position)
        }
    }

    static getXRCameraPosition(xr, position) {        
        if (xr.isPresenting) {
            const camera = xr.getCamera()
            camera.getWorldPosition(position)
            return true
        }
        return false
    }
}

export default FollowObject
