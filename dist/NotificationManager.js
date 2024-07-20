"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const NotificationContainer_1 = __importDefault(require("./NotificationContainer"));
const Notification_1 = __importDefault(require("./Notification"));
/**
 * Handles the creation of NotificationContainer and
 * Notifications that get pushed into them.
 *
 * @todo Change to Singleton
 *
 * @class NotificationManager
 */
class NotificationManager {
    /**
     * The active NotificationContainer.
     *
     * @private
     * @static
     * @type {NotificationContainer}
     * @memberof NotificationManager
     */
    static container;
    /**
     * Prepares a NotificationContainer.
     *
     * @private
     * @static
     * @memberof NotificationManager
     */
    static getContainer() {
        if (!NotificationManager.container) {
            NotificationManager.container = new NotificationContainer_1.default();
        }
        return NotificationManager.container;
    }
    /**
     * Destroys a notification (and container if there are none left).
     *
     * @static
     * @param {Notification} notification
     * @memberof NotificationManager
     */
    static destroyNotification(notification) {
        if (NotificationManager.container) {
            NotificationManager.container.removeNotification(notification);
            // Once we have no notifications left, destroy the container.
            if (NotificationManager.container.notifications.length == 0) {
                NotificationManager.container.dispose();
                NotificationManager.container = null;
            }
        }
    }
    /**
     * Creates a new Notification and pushes it to the
     * NotificationContainer.
     *
     * @static
     * @param {INotificationOptions} options
     * @memberof NotificationManager
     */
    static createNotification(options) {
        const container = NotificationManager.getContainer();
        const notification = new Notification_1.default(options);
        container.addNotification(notification);
        return notification;
    }
}
exports.default = NotificationManager;
//# sourceMappingURL=NotificationManager.js.map