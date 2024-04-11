import View from "./abstractions/View.js";
import * as THREE from 'three';

/**
 * Parameters for a camera
 * rotation effect.
 */
let rotateSwitch = false
const rotateSpeed = 0.0001
const rotateThreshold = 0.05

/**
 * @function _createDefaultScene
 * @description create a Three.js scene
 * @param {object} rendererOptions - the renderers options
 * returns {object}
 */
function _createDefaultScene(rendererOptions) {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer(rendererOptions)
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	return { scene, camera, renderer }
}

/**
 * @class View3D
 * @classdesc A 3D view based on Three.js
 * @extends View
 * @property canvas - The canvas element.
 * @property scene - The scene.
 * @property camera - The camera.
 * @property renderer - The renderer.
 * @property initialized - A flag to indicate whether the view is initialized.
 */
class View3D extends View {

    /**
     * @constructor
     */
    constructor(createDefaultScene=_createDefaultScene) {
        super()
        this.eventDispatcher = new THREE.EventDispatcher()
		this.createDefaultScene = createDefaultScene
    }

    /**
     * @function init
     * @description Initialize the view.
     * @param {HTMLElement} canvas - The canvas element.
     * @returns {void}
     */
    init(canvas) {
        if (this.initialized)
            return;
        this.initialized = true

		const rendererOptions = { antialias: true }
		if (canvas) rendererOptions.canvas = canvas
        
		const data = this.createDefaultScene(canvas)
		this.scene = data.scene;
		this.camera = data.camera;
		this.renderer = data.renderer;
		this.canvas = data.renderer.domElement;
        this.cameraYRotation = this.camera.rotation.y

        View3D.resizeRendererToDisplaySize(this)
    }

    /**
     * @function exit
     * @description Dispose the view.
     * @returns {void}
     */
    exit() {
        if (!this.initialized)
            return;

        this.initialized = false
        this.canvas = null
        this.scene = null
        this.camera = null
        this.renderer = null
    }

    /**
     * @function render
     * @description Render the view.
     * @returns {void}
     */
    render() {
        this.eventDispatcher.dispatchEvent({ type: 'beforerender' })
        if (!this.renderer.xr.isPresenting) {
            View3D.resizeRendererToDisplaySize(this)
            View3D.rotateCamera(this)
        }
        this.renderer.render(this.scene, this.camera)
    }

    /**
     * @function addBeforeRenderListener
     * @description Add a listener to the render event.
     * @param {Function} listener - The listener.
     * @returns {void}
     */
    addBeforeRenderListener(listener) {
        this.eventDispatcher.addEventListener('beforerender', listener)
    }

    /**
     * @function removeBeforeRenderListener
     * @description Remove a listener from the render event.
     * @param {Function} listener - The listener.
     * @returns {void}
     */
    removeBeforeRenderListener(listener) {
        this.eventDispatcher.removeEventListener('beforerender', listener)
    }

    /**
     * @function resizeRendererToDisplaySize
     * @description Resize the renderer to the display size.
     * @param {View3D} view - The view.
     * @returns {void}
     * @private
     * @static
     */
    static resizeRendererToDisplaySize(view) {
        const { camera, canvas, renderer } = view
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;

        if (needResize) {
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
    }

    static rotateCamera(view) {
        if (rotateSwitch) {
            view.camera.rotation.y += rotateSpeed
        } else {
            view.camera.rotation.y -= rotateSpeed
        }
    
        if (view.camera.rotation.y > view.cameraYRotation+rotateThreshold) {
            rotateSwitch = false
        } else if (view.camera.rotation.y < view.cameraYRotation-rotateThreshold) {
            rotateSwitch = true
        }
    }
}

export default View3D
