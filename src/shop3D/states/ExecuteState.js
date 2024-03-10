import State from "../abstractions/states/State.js";

/**
 * @class ExecuteState
 * @classdesc The state in which the shop is running. Responsible for rendering the view.
 * @extends State
 * @property options - The options for the state.
 */
class ExecuteState extends State {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function enter
     * @description Render the view.
     * @param {Function} setState - The function to change the state of the context.
     * @returns {void}
     */
    enter(setState) {
        const view = this.options.view;

        /**
         * https://threejs.org/manual/#en/webxr-basics
         * > We need to let three.js run our render loop. 
         * > Until now we have used a requestAnimationFrame 
         * > loop but to support VR we need to let three.js 
         * > handle our render loop for us. We can do that by 
         * > calling WebGLRenderer.setAnimationLoop and passing a 
         * > function to call for the loop.
         */
        view.renderer.setAnimationLoop(view.render.bind(view));
    }

    /**
     * @function exit
     * @description Clear the interval.
     * @returns {void}
     */
    exit() {

        /**
         * https://threejs.org/docs/index.html?q=renderer#api/en/renderers/WebGLRenderer.setAnimationLoop
         * > The function will be called every available frame. 
         * > If null is passed it will stop any already ongoing animation.
         */
        this.options.view.renderer.setAnimationLoop(null);
    }
}

export default ExecuteState
