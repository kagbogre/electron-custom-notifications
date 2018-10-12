# electron-custom-notifications
Display customized HTML/CSS notifications in a cross-platform way. Instead of relying on Windows, Mac or Linux APIs to show notifications, this uses an extra Electron window to display them, giving the developer the freedom to style the notifications as they choose to.



## Installation
To install simply: 
```
npm i --save electron-custom-notifications
```
## Examples
Check the examples folder for a full example.
### Full usage
Please note that you need to use this inside an existing Electron application after the `.on('ready')` event has been fired.
```javascript
  const {
    setContainerWidth,
    setGlobalStyles,
    setDefaultTemplate,
    createNotification,
  } = require("electron-custom-notifications");
  
  // OPTIONAL: Set optional container width.
  // DEFAULT: 300
  setContainerWidth(350);

  // OPTIONAL: Set custom styles.
  setGlobalStyles(`
    * {
      font-family: Helvetica;
    }
    notification {
      display:block;
      padding:20px;
      background-color:#fff;
      border-radius:12px;
      margin:10px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    notification h1 {
      font-weight:bold;
    }
  `);
  
  // OPTIONAL: Set a default template for ALL notifications.
  // * Root element MUST be "notification".
  // * Use %var% syntax for variables to have them replaced during runtime.
  //   These must be defined in the "parameters" property of each notification.
  // * Always include id="%id%" in the root element. No need to define
  //   id in the parameters property, they are auto-generated.
  setDefaultTemplate(`
    <notification id="%id%">
      <h1>%title%</h1>
      <p>%body%</p>
    </notification>  
  `);
  
  const notification = createNotification({
    // OPTIONAL: Parameters to replace in the template during runtime.
    parameters: [
      { key: "title", value: "My first notification" },
      { key: "body", value: "Hello, this is my first notification!" },
    ],

    // OPTIONAL: Custom template ONLY for this notification.
    // * Root element MUST be "notification".
    // * Use %var% syntax for variables to have them replaced during runtime.
    //   These must be defined in the "parameters" property.
    // * Always include id="%id%" in the root element.
    //
    // template: `
    //  <notification id="%id%">
    //    <h1>Notification title</h1>
    //    <p>Notification body</p>
    //  </notification>
    //`,

    // OPTIONAL: Specify a timeout.
    // timeout: 3000,
  });
  
  // When the notification was clicked.
  notification.on("click", () => {
    console.log("Notification has been clicked");
  });

  // When the notification was closed.
  notification.on("close", () => {
    console.log("Notification has been closed");
  });
  
  // Close the notification at will.
  // notification.close();
```
 ### Result of example above
 ![alt text](https://i.imgur.com/Djx9m1o.png "Notification result")
 
 (Notifications stack on top of each other)
