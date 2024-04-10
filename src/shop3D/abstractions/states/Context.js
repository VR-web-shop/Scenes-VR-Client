import State from './State.js'
import * as THREE from 'three'

/**
 * @class Context
 * @classdesc The context of the state machine.
 * @property state - The current state of the context.
 * @property options - The options for the context.
 * @property setState - The function to change the state of the context.
 * @property getState - The function to get the current state of the context.
 * @property eventDispatcher - The event dispatcher for the context.
 * @param {State} initialState - The initial state of the context.
 * @param {Object} options - The options for the context.
 */
const Context = function(initialState, options = {}) {
  if (!(initialState instanceof State)) {
    throw new Error('Invalid state')
  }

  this.state = null;
  this.options = { ...options };
  this.eventDispatcher = new THREE.EventDispatcher();

  /**
   * @function setState
   * @description Change the state of the context.
   * @param {State} state - The new state.
   * @returns {void}
   */
  this.setState = function(state) {
    if (!(state instanceof State)) {
        throw new Error('Invalid state')
    }

	if (this.state && this.state === state) {
		return;
	}

    if (this.state && this.state !== state) {
        this.state.exit()
    }

    this.eventDispatcher.dispatchEvent({ 
      type: 'stateChange', 
      oldState: this.state, 
      newState: state 
    })
    
    this.state = state

    if (this.state) {
        this.state.setOptions(this.options)
        this.state.enter(this.setState.bind(this))
    }
  }

  /*
   * Set the initial state
   */
   this.setState(initialState)
  
  /**
   * @function getState
   * @description Get the current state of the context.
   * @returns {State} The current state.
   */
  this.getState = function() {
    return this.state 
  }

  /**
   * @function addOnStateChangeListener
   * @description Add an on state change listener to the context.
   * @param {Function} listener - The listener for the event.
   * @returns {void}
   */
  this.addOnStateChangeListener = function(listener) {
    this.eventDispatcher.addEventListener('stateChange', listener)
  }

  /**
   * @function removeOnStateChangeListener
   * @description Remove an on state change listener from the context.
   * @param {Function} listener - The listener for the event.
   * @returns {void}
   */
  this.removeOnStateChangeListener = function(listener) {
    this.eventDispatcher.removeEventListener('stateChange', listener)
  }
}

export default Context
