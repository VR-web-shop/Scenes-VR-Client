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
        this.options.plugins.init(this.options.view)
        setState(new ExecuteState())
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
