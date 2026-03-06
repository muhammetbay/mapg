/** Dominant flag color for each country (ISO 3166-1 alpha-2, lowercase) */
const countryColors: Record<string, string> = {
  // A
  ad: '#D52B1E', ae: '#00732F', af: '#009900', ag: '#CE1126', ai: '#00247D',
  al: '#E41E20', am: '#D90012', ao: '#CC092F', ar: '#74ACDF', as: '#000080',
  at: '#ED2939', au: '#00008B', aw: '#4997D0', ax: '#003580', az: '#00B5E2',
  // B
  ba: '#002395', bb: '#00267F', bd: '#006A4E', be: '#FDDA24', bf: '#009E49',
  bg: '#00966E', bh: '#CE1126', bi: '#CE1126', bj: '#008751', bl: '#002395',
  bn: '#F7E017', bo: '#007934', bm: '#C8102E', bq: '#21468B', br: '#009C3B',
  bs: '#00ABC9', bt: '#FF4E12', bv: '#BA0C2F', bw: '#75AADB', by: '#CE1126',
  bz: '#003F87',
  // C
  ca: '#FF0000', cc: '#008000', cd: '#007FFF', cf: '#003082', cg: '#009543',
  ch: '#FF0000', ci: '#FF8200', ck: '#00247D', cl: '#D52B1E', cm: '#007A5E',
  cn: '#DE2910', co: '#FCD116', cr: '#002B7F', cu: '#002A8F', cv: '#003893',
  cw: '#002B7A', cx: '#1C8A42', cy: '#FFFFFF', cz: '#D7141A',
  // D
  de: '#DD0000', dj: '#6AB2E7', dk: '#C60C30', dm: '#006B3F', do: '#002D62',
  dz: '#006233',
  // E
  ec: '#FFD100', eg: '#CE1126', ee: '#0072CE', eh: '#007A3D', er: '#4189DD',
  es: '#AA151B', et: '#009A44',
  // F
  fi: '#003580', fj: '#68BFE5', fk: '#00247D', fm: '#75B2DD', fo: '#FFFFFF',
  fr: '#002395',
  // G
  ga: '#009E60', gb: '#012169', ge: '#FF0000', gd: '#CE1126', gf: '#002395',
  gg: '#FFFFFF', gh: '#006B3F', gi: '#FFFFFF', gl: '#D00C33', gm: '#CE1126',
  gn: '#CE1126', go: '#009E49', gp: '#002395', gq: '#3E9A00', gr: '#004C98',
  gs: '#012169', gt: '#4997D0', gu: '#002147', gw: '#CE1126', gy: '#009E49',
  // H
  hk: '#DE2910', hm: '#00008B', hn: '#0073CF', hr: '#171796', ht: '#00209F',
  hu: '#CE2939',
  // I
  id: '#CE1126', ie: '#169B62', il: '#0038B8', im: '#CF142B', in: '#FF9933',
  io: '#002147', iq: '#CE1126', ir: '#239F40', is: '#003897', it: '#008C45',
  // J
  je: '#FFFFFF', jm: '#009B3A', jo: '#007A3D', jp: '#BC002D', ju: '#CE1126',
  // K
  ke: '#000000', kg: '#E8112D', kh: '#032EA1', ki: '#CE1126', km: '#3A75C4',
  kn: '#009E49', kp: '#024FA2', kr: '#FFFFFF', xk: '#244AA5', kw: '#007A3D',
  ky: '#00247D', kz: '#00AFCA',
  // L
  la: '#CE1126', lb: '#CE1126', lc: '#65CFFF', li: '#002B7F', lk: '#8D153A',
  lr: '#BF0A30', ls: '#00209F', lt: '#006A44', lu: '#00A1DE', lv: '#9E3039',
  ly: '#000000',
  // M
  ma: '#C1272D', mc: '#CE1126', md: '#003DA5', mg: '#007E3A', me: '#D4AF37',
  mf: '#002395', mh: '#003893', mk: '#D20000', ml: '#14B53A', mo: '#00785E',
  mm: '#FECB00', mn: '#C4272F', mp: '#0033A0', mq: '#002395', mr: '#006233',
  ms: '#012169', mt: '#CF142B', mu: '#00A551', mv: '#D21034', mw: '#CE1126',
  mx: '#006847', my: '#010066', mz: '#009A44',
  // N
  na: '#003580', nc: '#002395', ne: '#E05206', nf: '#008000', ng: '#008751',
  ni: '#003893', nl: '#AE1C28', no: '#BA0C2F', np: '#DC143C', nr: '#002B7F',
  nu: '#C8A951', nz: '#00247D',
  // O
  om: '#DB161B',
  // P
  pa: '#FFFFFF', pe: '#D91023', pf: '#FFFFFF', pg: '#CE1126', ph: '#0038A8',
  pk: '#01411C', pl: '#DC143C', pm: '#002395', pn: '#00247D', pr: '#3C3B6E',
  ps: '#007A3D', pt: '#006600', pw: '#4AADD6', py: '#D52B1E',
  // Q
  qa: '#8A1538',
  // R
  re: '#002395', ro: '#002B7F', rs: '#C6363C', ru: '#0039A6', rw: '#20603D',
  // S
  sa: '#006C35', sb: '#003580', sc: '#003F87', sd: '#007229', se: '#004B87',
  sg: '#EF3340', sh: '#012169', si: '#003DA5', sj: '#BA0C2F', sk: '#0B4EA2',
  sl: '#1EB53A', sm: '#5EB6E4', sn: '#00853F', so: '#4189DD', sr: '#377E3F',
  ss: '#078930', st: '#12AD2B', sv: '#0047AB', sx: '#D21034', sy: '#CE1126',
  sz: '#3E5EB9',
  // T
  tc: '#00247D', td: '#002664', tf: '#002395', tg: '#006A4E', th: '#A51931',
  tj: '#CC0000', tk: '#003399', tl: '#DC241F', tm: '#28AE66', tn: '#E70013',
  to: '#C10000', tr: '#E30A17', tt: '#CE1126', tv: '#009FCA', tw: '#FE0000',
  tz: '#1EB53A',
  // U
  ua: '#005BBB', ug: '#000000', us: '#3C3B6E',
  'um-dq': '#3C3B6E', 'um-fq': '#3C3B6E', 'um-hq': '#3C3B6E',
  'um-jq': '#3C3B6E', 'um-mq': '#3C3B6E', 'um-wq': '#3C3B6E',
  uy: '#001489', uz: '#1EB53A',
  // V
  va: '#FFE000', vc: '#009E60', ve: '#003399', vg: '#00247D', vi: '#FFFFFF',
  vn: '#DA251D', vu: '#009543',
  // W
  wf: '#002395', ws: '#CE1126',
  // Y
  ye: '#CE1126', yt: '#002395',
  // Z
  za: '#007749', zm: '#198A00', zw: '#006400',
};

export default countryColors;
