const StateMachinePlugin = require('./abstract')

/**
 * @class Store dates when states changed
 */
class StateMachineDates extends StateMachinePlugin {
  /**
   * Set up configuration for the dates plugin, controlling which properties on the host object to use
   * @param {object} options
   * @param {Array<string>} [options.skipTransitions=[]] - Array of transition names to be ignored
   */
  constructor ({ skipTransitions = [] } = {}) {
    super()
    this.skipTransitions = skipTransitions
  }

  /**
   * Observers object to add additional lifecycle observers
   * Adds our lifecycle observers to add a date to StateMachine when a new state is entered
   * @returns {object} Key value of observers
   */
  get observers () {
    const plugin = this

    return {
      onEnterState: function (lifecycle) {
        if (this.dates === undefined) {
          this.dates = {}
        }
        if (!plugin.skipTransitions.includes(lifecycle.transition)) {
          // set the date the state was entered, for example, 'created'
          this.dates[this.state] = new Date()
        }
      }
    }
  }
}

module.exports = StateMachineDates
