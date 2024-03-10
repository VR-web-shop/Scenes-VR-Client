
/**
 * @abstract
 * @class Command
 * @classdesc Abstract class for commands.
 */
class Command {

  /**
   * @function execute
   * @description Execute the command.
   * @abstract
   * @param {Object} options - The options for the command.
   * @returns {void}
   * @async
   */
  async execute(options) {
    throw new Error('Command.execute() must be overridden')
  }
}

export default Command
