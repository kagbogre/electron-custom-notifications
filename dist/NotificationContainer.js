"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
/**
 * Container where Notifications are pushed into.
 *
 * @class NotificationContainer
 */
class NotificationContainer {
    /**
     * The container's width.
     * @default 300
     *
     * @static
     * @memberof NotificationContainer
     */
    static CONTAINER_WIDTH = 300;
    /**
     * Custom CSS styles to add to the container HTML.
     *
     * @static
     * @type {string}
     * @memberof NotificationContainer
     */
    static CUSTOM_STYLES;
    /**
     * Determines if the container window has been loaded.
     *
     * @type {boolean}
     * @memberof NotificationContainer
     */
    ready = false;
    /**
     * Collection of Notifications that are currently inside
     * the container.
     *
     * @private
     * @type {Notification[]}
     * @memberof NotificationContainer
     */
    notifications = [];
    /**
     * The Electron BrowserWindow for this container.
     *
     * @private
     * @type {BrowserWindow}
     * @memberof NotificationContainer
     */
    window;
    /**
     * Creates an instance of NotificationContainer.
     * @memberof NotificationContainer
     */
    constructor() {
        let options = {};
        const display = require("electron").screen.getPrimaryDisplay();
        const displayWidth = display.workArea.x + display.workAreaSize.width;
        const displayHeight = display.workArea.y + display.workAreaSize.height;
        options.height = displayHeight;
        options.width = NotificationContainer.CONTAINER_WIDTH;
        options.alwaysOnTop = true;
        options.skipTaskbar = true;
        options.resizable = false;
        options.minimizable = false;
        options.fullscreenable = false;
        options.focusable = false;
        options.show = false;
        options.frame = false;
        options.transparent = true;
        options.x = displayWidth - NotificationContainer.CONTAINER_WIDTH;
        options.y = 0;
        options.webPreferences = {
            nodeIntegration: true,
            contextIsolation: false,
        }; // Since we're not displaying untrusted content 
        // (all links are opened in a real browser window), we can enable this.
        this.window = new electron_1.BrowserWindow(options);
        this.window.setVisibleOnAllWorkspaces(true);
        this.window.loadURL(path.join("file://", __dirname, "/container.html"));
        this.window.setIgnoreMouseEvents(true, { forward: true });
        this.window.showInactive();
        // this.window.webContents.openDevTools({ mode: 'detach' });
        electron_1.ipcMain.on("notification-clicked", (e, id) => {
            const notification = this.notifications.find(notification => notification.id == id);
            if (notification) {
                notification.emit("click");
            }
        });
        electron_1.ipcMain.on("make-clickable", (e) => {
            this.window && this.window.setIgnoreMouseEvents(false);
        });
        electron_1.ipcMain.on("make-unclickable", (e) => {
            this.window && this.window.setIgnoreMouseEvents(true, { forward: true });
        });
        this.window.webContents.on("did-finish-load", () => {
            this.ready = true;
            if (NotificationContainer.CUSTOM_STYLES) {
                this.window &&
                    this.window.webContents.send("custom-styles", NotificationContainer.CUSTOM_STYLES);
            }
            this.notifications.forEach(this.displayNotification);
        });
        this.window.on("closed", () => {
            this.window = null;
        });
    }
    /**
     * Adds a notification logically (notifications[]) and
     * physically (DOM Element).
     *
     * @param {Notification} notification
     * @memberof NotificationContainer
     */
    addNotification(notification) {
        if (this.ready) {
            this.displayNotification(notification);
        }
        this.notifications.push(notification);
    }
    /**
     * Displays the notification visually.
     *
     * @private
     * @param {Notification} notification
     * @memberof NotificationContainer
     */
    displayNotification = (notification) => {
        this.window &&
            this.window.webContents.send("notification-add", notification.getSource());
        notification.emit("display");
        if (notification.options.timeout) {
            setTimeout(() => {
                notification.close();
            }, notification.options.timeout);
        }
    };
    /**
     * Removes a notification logically (notifications[]) and
     * physically (DOM Element).
     *
     * @param {Notification} notification
     * @memberof NotificationContainer
     */
    removeNotification(notification) {
        this.notifications.splice(this.notifications.indexOf(notification), 1);
        this.window &&
            this.window.webContents.send("notification-remove", notification.id);
        notification.emit("close");
    }
    /**
     * Destroys the container.
     *
     * @memberof NotificationContainer
     */
    dispose() {
        this.window && this.window.close();
    }
}
exports.default = NotificationContainer;
//# sourceMappingURL=NotificationContainer.js.map