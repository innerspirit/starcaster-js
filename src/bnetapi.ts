// @ts-ignore
import { getRepData } from 'screptools/packages/file/index';
// @ts-ignore
import { getProcessInfo } from 'bnetdata/lib/util/proc';
// @ts-ignore
import { BnetAPI } from 'bnetdata/lib/bnetapi';
import { pp } from './utils';

export async function getOpponent() {
  const repdata = await getLastReplay();
  pp(repdata);
  const mu = repdata.matchup;
  const opp = mu.teams[1].players[0];
  const opponent = { name: opp.name, race: opp.race, eapm: opp.eapm };
  return { opponent };
}

async function getLastReplay() {
  const homedir = require("os").homedir();
  const repdata = await getRepData(homedir + '\\Documents\\StarCraft\\Maps\\Replays\\LastReplay.rep');
  return repdata.data;
}

export async function setupBnet() {
  const [proc, bnetport] = await getProcessInfo();

  if (!proc) {
    console.error('bnetdata: error: StarCraft is not running.', 18);
    process.exit(0);
  }
  return (new BnetAPI(bnetport));
}
