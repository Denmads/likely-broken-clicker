import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { resetState } from './state';
import { loop } from './core';

library.add(faAngleDown)
dom.watch();

(document.querySelector("#temp-reset") as HTMLButtonElement).addEventListener("click", () => {
    resetState()
    loop.reset()
})

export function formatNumber(value: number): string {
  if (value < 1000) {
        const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2})
        return formatter.format(value)
  }

  const units = [
    "", "K", "M", "B", "T", // thousand → trillion
    "Qa", "Qi", "Sx", "Sp", "Oc", "No", // quadrillion → novemdecillion
    "Dc", "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nd", // 10^33 → 10^51
    "Vg", "Uvg", "Dvg", "Tvg", "Qavg", "Qivg", "Sxvg", "Spvg", "Ocvg", "Novg", // 10^54 → 10^81
    "Tg", "Utg", "Dtg", "Ttg", "Qatg", "Qitg", "Sxtg", "Sptg", "Octg", "Notg", // 10^84 → 10^111
    "Qg", "Uqg", "Dqg", "Tqg", "Qaqg", "Qiqg", "Sxqg", "Spqg", "Ocqg", "Noqg", // 10^114 → 10^141
    "Rg", "Urg", "Drg", "Trg", "Qarg", "Qirg", "Sxrg", "Sprg", "Ocrg", "Norg", // 10^144 → 10^171
    "Cg", "Ucg", "Dcg", "Tcg", "Qacg", "Qicg", "Sxcg", "Spcg", "Occg", "Nocg", // 10^174 → 10^201
    "Mg", "Umg", "Dmg", "Tmg", "Qamg", "Qimg", "Sxmg", "Spmg", "Ocmg", "Nomg", // 10^204 → 10^231
    "Gg", "Ugg", "Dgg", "Tgg", "Qagg", "Qigg", "Sxgg", "Spgg", "Ocgg", "Nogg"  // 10^234 → 10^261+
  ];

  let u = 0;
  while (value >= 1000 && u < units.length - 1) {
    value /= 1000;
    u++;
  }

  const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2})
  return `${formatter.format(value)}${units[u]}`;
}

export function formatDuration(seconds: number) {
  if (seconds < 0) seconds = -seconds;
  const time = {
    day: Math.floor(seconds / 86400),
    hour: Math.floor(seconds / 3600) % 24,
    minute: Math.floor(seconds / 60) % 60,
    second: Math.floor(seconds) % 60
  };

  let filteredEntries = Object.entries(time)
    .filter(val => val[1] !== 0)

  if (filteredEntries.length == 0)
    return "0s"

  return filteredEntries
    .map(([key, val]) => `${val}${key[0]}`)
    // .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
    .join(', ');
};