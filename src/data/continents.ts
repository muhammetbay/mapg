export interface Continent {
  id: string;
  name: string;
  color: string;
  /** Country ISO codes belonging to this continent */
  countries: string[];
  /** SVG viewBox to zoom into when this continent is selected */
  viewBox: string;
}

const continents: Continent[] = [
  {
    id: 'na',
    name: 'North America',
    color: '#E8A838',
    countries: [
      'ag','ai','aw','bb','bl','bm','bs','bq','bz','ca','cr','cu','cw',
      'dm','do','gd','gl','gp','gt','hn','ht','jm','kn','ky','lc','mf',
      'mp','mq','ms','mx','ni','pa','pm','pr','sv','sx','tc','tt','us',
      'vc','vg','vi',
    ],
    viewBox: '30 100 380 280',
  },
  {
    id: 'sa',
    name: 'South America',
    color: '#6EC87A',
    countries: [
      'ar','bo','br','cl','co','ec','fk','gf','gs','gy','pe','py','sr',
      'uy','ve',
    ],
    viewBox: '170 390 220 280',
  },
  {
    id: 'eu',
    name: 'Europe',
    color: '#5B9BD5',
    countries: [
      'ad','al','at','ax','ba','be','bg','by','ch','cy','cz','de','dk',
      'ee','es','fi','fo','fr','gb','ge','gg','gi','gr','hr','hu','ie',
      'im','is','it','je','li','lt','lu','lv','mc','md','me','mk','mt',
      'nl','no','pl','pt','ro','rs','se','si','sj','sk','sm','ua','va',
      'xk',
    ],
    viewBox: '430 220 180 200',
  },
  {
    id: 'af',
    name: 'Africa',
    color: '#E06C4F',
    countries: [
      'ao','bf','bi','bj','bw','cd','cf','cg','ci','cm','cv','dj','dz',
      'eg','eh','er','et','ga','gh','gm','gn','gq','gw','ke','km','lr',
      'ls','ly','ma','mg','ml','mr','mu','mw','mz','na','ne','ng','re',
      'rw','sc','sd','sl','sn','so','ss','st','sz','td','tg','tn','tz',
      'ug','yt','za','zm','zw',
    ],
    viewBox: '430 310 180 300',
  },
  {
    id: 'as',
    name: 'Asia',
    color: '#C77DB5',
    countries: [
      'ae','af','am','az','bd','bh','bn','bt','cn','hk','id','il','in',
      'io','iq','ir','jo','jp','kg','kh','kp','kr','kw','kz','la','lb',
      'lk','mm','mn','mo','mv','my','np','om','ph','pk','ps','qa','ru',
      'sa','sg','sy','th','tj','tl','tm','tr','tw','uz','vn','ye',
    ],
    viewBox: '570 100 440 360',
  },
  {
    id: 'oc',
    name: 'Oceania',
    color: '#45B5AA',
    countries: [
      'as','au','cc','ck','cx','fj','fm','gu','hm','ki','mh','nc','nf',
      'nr','nu','nz','pf','pg','pn','pw','sb','tk','to','tv','vu','wf',
      'ws',
      'um-dq','um-fq','um-hq','um-jq','um-mq','um-wq',
    ],
    viewBox: '800 370 220 280',
  },
];

/** Quick lookup: country id → continent id */
const countryToContinent: Record<string, string> = {};
continents.forEach((c) => c.countries.forEach((cc) => {
  countryToContinent[cc] = c.id;
}));

export { countryToContinent };
export default continents;
