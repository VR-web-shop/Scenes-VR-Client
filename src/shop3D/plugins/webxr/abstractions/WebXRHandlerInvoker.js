import WebXRHandlerCommand from './WebXRHandlerCommand.js'

/**
 * @class WebXRHandlerInvoker
 * @classdesc The invoker of the command pattern.
 * @property options - The options for the invoker.
 * @property invoke - The function to execute a command.
 * @param {Object} options - The options for the invoker.
 */
const WebXRHandlerInvoker = function(options = {}) {
  this.options = options

  /**
   * @function invoke
   * @description Execute a command.
   * @param {WebXRHandlerCommand} command - The command to be executed.
   * @returns {void}
   * @throws {Error} - Invalid command.
   * @async
   */
  this.invoke = async function(command) {
    if (!(command instanceof WebXRHandlerCommand)) {
      throw new Error('Invalid command')
    }

    return await command.execute(this.options)
  }
}

export default WebXRHandlerInvoker
