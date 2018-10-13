/**
 * The notification options.
 *
 * @export
 * @interface INotificationOptions
 */
export default interface INotificationOptions {
  template?: string;
  parameters?: { key: string; value: string }[];
  timeout?: number;
}
