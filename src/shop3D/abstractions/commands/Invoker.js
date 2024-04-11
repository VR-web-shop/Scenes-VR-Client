import Command from './Command.js'

/**
 * @class Invoker
 * @classdesc The invoker of the command pattern.
 * @property options - The options for the invoker.
 * @property invoke - The function to execute a command.
 * @param {Object} options - The options for the invoker.
 */
const Invoker = function(options = {}) {
  this.options = options || {}

  /**
   * @function invoke
   * @description Execute a command.
   * @param {Command} command - The command to be executed.
   * @returns {void}
   * @async
   */
  this.invoke = async function(command) {
    if (!(command instanceof Command)) {
      throw new Error('Invalid command')
    }

    await command.execute(this.options)
  }
}

export default Invoker
