
/**
 * @class State
 * @classdesc Abstract class for states.
 * @abstract
 * @property {Object} options - The options for the state.
 */
class State {

    /**
     * @constructor
     */
    constructor() {
        this.options = {}
    }

    /**
     * @function setOptions
     * @description Set the options for the state.
     * @param {Object} options - The options to be set.
     */
    setOptions(options) {
        this.options = options
    }

    /**
     * @function enter
     * @description Executed when the context changes to this state.
     * @param {Function} setState - The function to change the state of the context.
     * @abstract
     * @returns {void}
     */
    enter(setState) { }

    /**
     * @function exit
     * @description Executed before the state is changed. 
     * IMPORTANT: Avoid using Context.setState when exiting a state to prevent infinite loops.
     * @abstract
     * @returns {void}
     */
    exit() { }
}

export default State
