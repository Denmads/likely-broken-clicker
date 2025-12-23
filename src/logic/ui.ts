import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { resetState } from './state';

library.add(faAngleDown)
dom.watch();

(document.querySelector("#temp-reset") as HTMLButtonElement).addEventListener("click", () => resetState())

export function formatNumber(value: number): string {
  if (value < 1000) return value.toString();

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

  return `${value.toFixed(2)}${units[u]}`;
}

export function formatLog10Number(value: number): string {
  if (value < 3) {
    let val = Math.pow(10, value);
    return val.toFixed(2);
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
  while (value >= 3 && u < units.length - 1) {
    value -= 3;
    u++;
  }

  let val = Math.pow(10, value % 3);
  return `${val.toFixed(2)}${units[u]}`;
}