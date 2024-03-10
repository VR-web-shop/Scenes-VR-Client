import State from "../abstractions/states/State.js";

/**
 * @class ExitState
 * @classdesc The last state before the shop is stopped. Responsible for disposing the view.
 * @extends State
 * @property options - The options for the state.
 */
class ExitState extends State {

    /**
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @function enter
     * @description Dispose the view and the plugins.
     * @param {Function} setState - The function to change the state of the context.
     * @returns {void}
     */
    enter(setState) {
        this.options.plugins.exit()
        this.options.view.exit()
    }

    /**
     * @function exit
     * @description Empty method.
     * @returns {void}
     */
    exit() {
    }
}

export default ExitState
