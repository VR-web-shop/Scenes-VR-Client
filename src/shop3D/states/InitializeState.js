import State from "../abstractions/states/State.js";
import ExecuteState from "./ExecuteState.js";

/**
 * @class InitializeState
 * @classdesc The first state after executing start. Responsible for initializing the view and the plugins.
 * @extends State
 * @property options - The options for the state.
 */
class InitializeState extends State {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function enter
     * @description Initialize the view and the plugins.
     * @param {Function} setState - The function to change the state of the context.
     * @returns {void}
     */
    enter(setState) {
        const view = this.options.view;

        this.options.plugins.init(view)
        setState(new ExecuteState())

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
     * @description Empty method.
     * @returns {void}
     */
    exit() {
    }
}

export default InitializeState
