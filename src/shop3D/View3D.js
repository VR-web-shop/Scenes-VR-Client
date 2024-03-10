import View from "./abstractions/View.js";
import * as THREE from 'three';

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
    constructor() {
        super()
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
        this.canvas = canvas
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
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
        View3D.resizeRendererToDisplaySize(this)
        this.renderer.render(this.scene, this.camera)
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
}

export default View3D
