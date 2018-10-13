# electron-custom-notifications
Display customized HTML/CSS notifications in a cross-platform way. Instead of relying on Windows, Mac or Linux APIs to show notifications, this uses an extra Electron window to display them, giving the developer the freedom to style the notifications as they choose to.



## Installation
To install simply: 
```
npm i --save electron-custom-notifications
```
## Full Usage
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
 ### Result
 ![alt text](https://i.imgur.com/Djx9m1o.png "Notification result")
 
  (Notifications stack on top of each other)
 
 ## Adding Images
 To add images, we will load them in base64 encoding. Using relative/absolute paths will most likely not work.
 Here's an example of a YouTube-styled notification:
 ```javascript
const {
  setGlobalStyles,
  createNotification,
} = require("electron-custom-notifications");

// Load image in base64 encoding.
const logo = require("fs").readFileSync("youtube.png", "base64");

setGlobalStyles(`
  * {
    font-family: Helvetica;
  }
  notification {
    overflow:hidden;
    display:block;
    padding:20px;
    background-color:#fff;
    border-radius:12px;
    margin:10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    display:flex;
  }
  notification h1 {
    font-weight:bold;
  }
  notification #logo {
    background-image:url("data:image/png;base64,${logo}");
    background-size:cover;
    background-position:center;
    width:80px;
    height:50px;
  }
`);

app.on("ready", () => {
  const notification = createNotification({
    template: `
    <notification id="%id%">
      <div id="logo"></div>
      <div id="content">
        <h1>Watch on Youtube</h1>
        <p>This is a notification about a YouTube video.</p>
      </div>
    </notification> 
    `,

    timeout: 3000,
  });

  notification.on("click", () => {
    // Open the YouTube link in a browser.
    require("electron").shell.openExternal(
      "https://www.youtube.com/watch?v=M9FGaan35s0"
    );
  });
});
```
 ### Result
 ![alt text](https://i.imgur.com/W8L0e2J.png "Notification result")
 
 ## Adding custom fonts
 Same thing as with the images. We will need to use base64 encoding to add them to our styles.
 ```javascript
const {
  setGlobalStyles,
  createNotification,
} = require("electron-custom-notifications");

const fs = require("fs");

const logo = fs.readFileSync("youtube.png", "base64");
const robotoRegular = fs.readFileSync("Roboto-Regular.ttf", "base64");
const robotoBold = fs.readFileSync("Roboto-Bold.ttf", "base64");

setGlobalStyles(`
  @font-face {
    font-family: 'Roboto';
    src: url(data:font/truetype;charset=utf-8;base64,${robotoRegular}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }
  @font-face {
    font-family: 'Roboto';
    src: url(data:font/truetype;charset=utf-8;base64,${robotoBold}) format('truetype');
    font-weight: bold;
    font-style: normal;
  }
  * {
    font-family: Roboto;
  }
  notification {
    overflow:hidden;
    display:block;
    padding:20px;
    background-color:#fff;
    border-radius:12px;
    margin:10px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    display:flex;
  }
  notification h1 {
    font-weight:bold;
  }
  notification #logo {
    background-image:url("data:image/png;base64,${logo}");
    background-size:cover;
    background-position:center;
    width:80px;
    height:50px;
  }
`);

app.on("ready", () => {
  const notification = createNotification({
    template: `
    <notification id="%id%">
      <div id="logo"></div>
      <div id="content">
        <h1>Watch on Youtube</h1>
        <p>This is a notification about a YouTube video.</p>
      </div>
    </notification> 
    `,

    //timeout: 3000,
  });

  notification.on("click", () => {
    require("electron").shell.openExternal(
      "https://www.youtube.com/watch?v=M9FGaan35s0"
    );
  });
}); 
```
### Result
Our notification has the best font in the world.

![alt text](https://i.imgur.com/Ez6as51.png "Notification result")

## Animating 
You can write up your own CSS animations in `setGlobalStyles()`, or you can use Animate.css library, which is already included and ready to use in this library.
Example animated notification template:
```html
<notification id="%id%" class="animated fadeInUp">
  <div id="logo"></div>
  <div id="content">
    <h1>Watch on Youtube</h1>
    <p>This is a notification about a YouTube video.</p>
  </div>
</notification> 
```
[Check out Animate.css for more animations](https://github.com/daneden/animate.css)
### Result
![alt text](https://i.imgur.com/h7gJlfJ.gif "Notification result")
 

