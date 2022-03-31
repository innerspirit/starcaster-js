import { QIcon, QSystemTrayIcon, QMenu, QAction, ColorGroup } from '@nodegui/nodegui';
import { resolve } from 'path';
// @ts-ignore
import { getRepData } from 'screptools/packages/file/index';
import http from 'http';
import fs from 'fs';

const pp = (e: any) => console.dir(e, { depth: null});
// @ts-ignore
import { getProcessInfo } from 'bnetdata/lib/util/proc';
// @ts-ignore
import { BnetAPI } from 'bnetdata/lib/bnetapi';

import _ from 'lodash';

const tray = setupTrayIcon();

setupWebServer();

(global as any).tray = tray; // prevents garbage collection of tray

async function setupWebServer() {
  const hostname = '127.0.0.1';
  const port = 3000;
  
  const homedir = require("os").homedir();

  const [proc, bnetport] = await getProcessInfo();

  if (!proc) {
    return console.error('bnetdata: error: StarCraft is not running.', 18)
  }

  const lb = (new BnetAPI(bnetport)).getLeaderboards();
  pp(lb);

  const repdata = await getRepData(homedir + '\\Documents\\StarCraft\\Maps\\Replays\\LastReplay.rep');
  const mu = repdata.data.matchup;
  const opp = mu.teams[1].players[0];
  pp(repdata.data);
  const opponent = { name: opp.name, race: opp.race, eapm: opp.eapm }

  var tplstring = fs.readFileSync(resolve(__dirname, "../assets/templates/opponent.hbs"));
  const template = _.template(String(tplstring));

  const server = http.createServer((req: any, res: any) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');

    res.end(template({ opponent }));
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

