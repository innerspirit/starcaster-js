import { QIcon, QSystemTrayIcon, QMenu, QAction } from '@nodegui/nodegui';
import { resolve } from 'path';
// @ts-ignore
import { getRepData } from 'screptools/packages/file/index';
import http from 'http';

const tray = setupTrayIcon();

setupWebServer();

(global as any).tray = tray; // prevents garbage collection of tray

async function setupWebServer() {
  const hostname = '127.0.0.1';
  const port = 3000;
  
  const homedir = require("os").homedir();

  const repdata = await getRepData(homedir + '\\Documents\\StarCraft\\Maps\\Replays\\LastReplay.rep');
  console.log(repdata);

  const server = http.createServer((req: any, res: any) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  });

  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

function setupTrayIcon() {
  const trayIcon = new QIcon(
    resolve(__dirname, "../assets/testicon.jpg")
  );
  const tray = new QSystemTrayIcon();

  const menu = new QMenu();
  tray.setContextMenu(menu);

  //Each item in the menu is called an action
  const visibleAction = new QAction();
  menu.addAction(visibleAction);
  visibleAction.setText('Exit Starcaster');
  visibleAction.addEventListener('triggered', () => {
    process.exit(0);
  });

  tray.setIcon(trayIcon);
  tray.show();
  return tray;
}

