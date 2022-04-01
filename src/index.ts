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
  const bnet = await setupBnet();
  const lb = await bnet.getLeaderboards();
  pp(lb);

  const server = http.createServer(async (req: any, res: any) => {
    const tplfile = 'opponent.hbs';
    const template = getHbsTemplate(tplfile);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    const opponent = await getOpponent();

    res.end(template({ opponent }));
  });

  runWebServer(server);
}

function runWebServer(server: http.Server) {
  const hostname = '127.0.0.1';
  const port = 3000;
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

function getHbsTemplate(tplfile: string) {
  const tplstring = fs.readFileSync(resolve(__dirname, "../assets/templates/" + tplfile));
  const template = _.template(String(tplstring));
  return template;
}

async function getOpponent() {
  const repdata = await getLastReplay();
  pp(repdata);
  const mu = repdata.matchup;
  const opp = mu.teams[1].players[0];
  const opponent = { name: opp.name, race: opp.race, eapm: opp.eapm };
  return opponent;
}

async function getLastReplay() {
  const homedir = require("os").homedir();
  const repdata = await getRepData(homedir + '\\Documents\\StarCraft\\Maps\\Replays\\LastReplay.rep');
  return repdata.data;
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

async function setupBnet() {
  const [proc, bnetport] = await getProcessInfo();

  if (!proc) {
    console.error('bnetdata: error: StarCraft is not running.', 18)
    process.exit(0);
  }
  return (new BnetAPI(bnetport));
}

