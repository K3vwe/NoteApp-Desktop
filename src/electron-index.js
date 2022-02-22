const { app, BrowserWindow } = require('electron');
const { is, setContentSecurityPolicy } = require('electron-util');
const config = require('./config');

// Specify the details of the browser window
function createWindow() {
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            webSecurity: false
        }
    });

    
    // if in development mode, open the browser dev tools
    // specify the URL to load in development and production
    if(is.development){
      window.loadURL(config.LOCAL_WEB_URL)
      window.webContents.openDevTools();
    } else {
      window.loadURL(config.PRODUCTION_WEB_URL)
    }

    if(!is.development){
      setContentSecurityPolicy(`
        default-src 'none';
        script-src 'self';
        img-src 'self' https://www.gravater.com;
        style-src 'self' 'unsafe-inline';
        font-src 'self';
        connect-src 'self' ${config.PRODUCTION_API_URL};
        base-uri 'none';
        form-action 'none'
        frame-ancestors 'none'
      `);
    }

    // when the window is closed, reset the window object
    window.on('closed', () =>{
        window=null;
    });
}

// when electron is ready, create the application window
app.on('ready', createWindow);

// quit when allwindows are closed
app.on('window-all-closed', () => {
    // On macOS only quit when a user explicitly quits the application
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
  app.on('activate', () => {
    // on macOS, re-create the window when the icon is clicked in the dock
    if (window === null) {
      createWindow();
    }
  });