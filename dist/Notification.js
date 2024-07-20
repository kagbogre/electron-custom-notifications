"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationManager_1 = __importDefault(require("./NotificationManager"));
const uuid_1 = require("uuid");
const events_1 = require("events");
/**
 * Represents a Notification.
 * Emits two events:
 *  - display: Fires when the notification is actually visible
 *  - close: Fires when the notification is closed
 *
 * @class Notification
 */
class Notification extends events_1.EventEmitter {
    /**
     * The notification´s unique ID.
     *
     * @type {string}
     * @memberof Notification
     */
    id;
    /**
     * Supplied notification options.
     *
     * @private
     * @type {INotificationOptions}
     * @memberof Notification
     */
    options;
    /**
     * Creates an instance of Notification.
     * @param {INotificationOptions} options
     * @memberof Notification
     */
    constructor(options) {
        super();
        this.id = (0, uuid_1.v4)();
        this.options = options;
    }
    /**
     * Asks the NotificationManager to remove this notification.
     *
     * @memberof Notification
     */
    close() {
        NotificationManager_1.default.destroyNotification(this);
    }
    /**
     * Returns the processed template source.
     *
     * @returns
     * @memberof Notification
     */
    getSource() {
        if (!this.options.content)
            return '';
        const firstClosingTagIndex = this.options.content?.indexOf('>');
        const idAttribute = ` data-notification-id="${this.id}"`;
        const output = [
            this.options.content.slice(0, firstClosingTagIndex),
            idAttribute,
            this.options.content.slice(firstClosingTagIndex)
        ];
        return output.join('');
    }
}
exports.default = Notification;
//# sourceMappingURL=Notification.js.map