
/**
 * @function BaseUIInterface
 * @description Base UI interface.
 * @param {Object} parent - The parent UI object.
 */
export default (parent) => {

    /**
     * @function show
     * @description Show the UI.
     * @returns {void}
     */
    function show() {
        parent.container.setVisibility(true)
    }

    /**
     * @function hide
     * @description Hide the UI.
     * @returns {void}
     */
    function hide() {
        parent.container.setVisibility(false)
    }

    /**
     * @function setPosition
     * @description Set the position of the UI.
     * @param {THREE.Vector3}
     * @returns {void}
     */
    function setPosition(position) {
        parent.container.setPosition(position)
    }
    
    /**
     * @function setRotation
     * @description Set the rotation of the UI.
     * @param {THREE.Euler}
     * @returns {void}
     */
    function setRotation(rotation) {
        parent.container.setRotation(rotation)
    }

    /**
     * @function setScale
     * @description Set the scale of the UI.
     * @param {THREE.Vector3}
     * @returns {void}
     */
    function setScale(scale) {
        parent.container.setScale(scale)
    }

    /**
     * @function lookAt
     * @description Look at a position.
     * @param {THREE.Vector3}
     * @returns {void}
     */
    function lookAt(position) {
        parent.container.object3D.lookAt(position)
    }

    return {
        show,
        hide,
        setPosition,
        setRotation,
        setScale,
        lookAt
    }
}
