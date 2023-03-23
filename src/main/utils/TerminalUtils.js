// node_modules
import _ from 'lodash';

// constants
const DEBOUNCE_TIME = Number('100');

class TerminalUtils {
  /**
   * @static
   * @returns {TerminalProgressTracker} TerminalProgressTracker
   */
  static createProgressTracker() {
    return new TerminalProgressTracker();
  }
}
export default TerminalUtils;

class TerminalProgressTracker {
  constructor() {
    this.errors = [];
    this.finished = Number('0');
    this.isComplete = Boolean(false);
    this.isDisabled = Boolean(false);
    this.started = Number('0');
    this.warnings = [];

    // debounce update
    this.update = _.debounce(this.update.bind(this), DEBOUNCE_TIME, {
      trailing: true,
    });
  }

  /**
   * @returns {void} void
   */
  complete() {
    this.isComplete = Boolean(true);
    if (!this.isDisabled) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      this.finished = Number(this.started);
      process.stdout.write('\n');
      process.stdout.cursorTo(0);
      console.log(this.progressBar());
    }
  }

  /**
   * @returns {void} void
   */
  finish() {
    this.finished++;
    this.update();
  }

  /**
   * @returns {String} progressBar
   */
  progressBar() {
    const progressBarLength = Number('20');
    let progress = Number('0');
    if (this.started > Number('0')) {
      progress = Number(this.finished / this.started);
    }
    const progressBarLimit = Number(Math.floor(Number('20') * progress));
    const progressBarValues = Array(progressBarLength)
      .fill('-')
      .map((_value, index) => (index < progressBarLimit ? '█' : '-'));
    const dots = String(progressBarValues.join(''));
    return (
      `|${dots}| ${(progress * Number('100')).toFixed(0)}% - ` +
      `Processed: ${this.finished} / ${this.started}.`
    );
  }

  /**
   * @returns {void} void
   */
  start() {
    this.started++;
    this.update();
  }

  /**
   * @returns {void} void
   */
  update() {
    if (!this.isDisabled) {
      const progressBar = this.progressBar();
      if (!this.isComplete) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(progressBar);
      }
    }
  }
}
