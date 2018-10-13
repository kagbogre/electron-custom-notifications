import NotificationManager from "./NotificationManager";
import INotificationOptions from "./INotificationOptions";

import uuid from "uuid/v4";

import { EventEmitter } from "events";

/**
 * Represents a Notification.
 * Emits two events:
 *  - display: Fires when the notification is actually visible
 *  - close: Fires when the notification is closed
 *
 * @class Notification
 */
class Notification extends EventEmitter {
  /**
   * The notification´s unique ID.
   *
   * @type {string}
   * @memberof Notification
   */
  public id: string;
  /**
   * Supplied notification options.
   *
   * @private
   * @type {INotificationOptions}
   * @memberof Notification
   */
  public options: INotificationOptions;
  /**
   * Default notification template.
   *
   * @static
   * @type {string}
   * @memberof Notification
   */
  public static TEMPLATE: string = `
    <notification id="%id%">
        <h1>%title%</h1>
        <p>%body%</p>
    </notification>
  `;

  /**
   * Creates an instance of Notification.
   * @param {INotificationOptions} options
   * @memberof Notification
   */
  constructor(options: INotificationOptions) {
    super();
    this.id = uuid();
    this.options = options;
  }
  /**
   * Asks the NotificationManager to remove this notification.
   *
   * @memberof Notification
   */
  public close() {
    NotificationManager.destroyNotification(this);
  }
  /**
   * Returns the processed template source.
   *
   * @returns
   * @memberof Notification
   */
  public getSource(): string {
    let template = this.options.template || Notification.TEMPLATE;

    template = template.replace(new RegExp("%id%", "g"), this.id);

    if (this.options.parameters && this.options.parameters.length > 0) {
      for (let i = 0; i < this.options.parameters.length; i++) {
        const parameter = this.options.parameters[i];

        template = template.replace(
          new RegExp("%" + parameter.key + "%", "g"),
          parameter.value
        );
      }
    }
    return template;
  }
}

export default Notification;
