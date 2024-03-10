import PluginCtrl from './plugins/PluginCtrl.js'
import Plugin from './plugins/Plugin.js'
import Invoker from './commands/Invoker.js'
import Context from './states/Context.js'
import State from './states/State.js'
import View from './View.js'

/**
 * @class Manager
 * @classdesc The manager of the shop's view and state.
 * @property invoke - The function to invoke a command.
 * @property setState - The function to change the state of the context.
 * @property getState - The function to get the current state of the context.
 * @property addPlugin - The function to add a plugin to the manager.
 * @property removePlugin - The function to remove a plugin from the manager.
 * @property addOnStateChangeListener - The function to add an on state change listener to the manager.
 * @property removeOnStateChangeListener - The function to remove an on state change listener from the manager.
 * @param {View} view - The view of the shop.
 * @param {State} initialState - The initial state of the shop.
 */
const Manager = function(view = new View(), initialState = new State()) {
    if (!(view instanceof View)) {
        throw new Error('Invalid view')
    }

    if (!(initialState instanceof State)) {
        throw new Error('Invalid state')
    }

    /**
     * @property The PluginCtrl instance.
     * @private
     */
    const plugins = new PluginCtrl()

    /**
     * @property The command and state options.
     * @private
     */
    const options = { view, plugins: { 
        find: plugins.find.bind(plugins), 
        init: plugins.init.bind(plugins),
        exit: plugins.exit.bind(plugins)
    }}

    /**
     * @property The Context instance.
     * @private
     */
    const context = new Context(initialState, options)

    // Give the invoker access to context methods
    // Important: Must be after Context is created and before Invoker is created
    options.context = {
        addOnStateChangeListener: context.addOnStateChangeListener.bind(context),
        removeOnStateChangeListener: context.removeOnStateChangeListener.bind(context),
    }

    /**
     * @property The Invoker instance.
     * @private
     */
    const invoker = new Invoker(options)

    /**
     * @function invoke
     * @description Execute a command.
     * @param {Command} command - The command to be executed.
     * @returns {void}
     * @public
     * @async
     */
    this.invoke = invoker.invoke.bind(invoker)

    /**
     * @function setState
     * @description Change the state of the context.
     * @param {State} state - The new state.
     * @returns {void}
     * @public
     */
    this.setState = context.setState.bind(context)

    /**
     * @function getState
     * @description Get the current state of the context.
     * @returns {State} The current state.
     * @public
     */
    this.getState = context.getState.bind(context)

    /**
     * @function addPlugin
     * @description Add a plugin to the manager.
     * @param {Plugin} plugin - The plugin to be added.
     * @returns {void}
     * @public
     */
    this.addPlugin = plugins.add.bind(plugins)

    /**
     * @function removePlugin
     * @description Remove a plugin from the manager.
     * @param {string} name - The name of the plugin.
     * @returns {void}
     * @public
     */
    this.removePlugin = plugins.remove.bind(plugins)
}

export default Manager
