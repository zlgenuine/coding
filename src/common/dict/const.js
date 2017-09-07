export const ALI_DOMAIN = process.env.NODE_ENV === 'production'
  ? `https://zsbg.oss-cn-shenzhen.aliyuncs.com/`
  : `http://zsbg.oss-cn-shenzhen.aliyuncs.com/`;
export const ECB_KEY = `zuoshibuguanzsbg`;
export const GAODE_MAP_KEY = `6d31eef168eeb05a84f0b1eeabb0de75`;

export let COOKIE_DOMAIN = window.location.hostname.indexOf('www') >= 0
  ? window.location.hostname.replace('www', '')
  : window.location.hostname;
export const BANNER = {
  // 静态=>纯banner
  static: [
    `${ALI_DOMAIN}banner/01.jpg`, `${ALI_DOMAIN}banner/002.jpg`, `${ALI_DOMAIN}banner/003.jpg`, `${ALI_DOMAIN}banner/04.jpeg`
  ],
  // 动态=>banner+跳转地址
  dynamic: [
    {
      pic: `${ALI_DOMAIN}banner/06.jpg`,
      link: '/aboutLace'
    }
  ]
};
export const MODELS = [
  'modle1_all.png',
  'modle1_back.png',
  'modle1_front.png',
  'modle1_side.png',
  'modle2_all.png',
  'modle2_back.png',
  'modle2_front.png',
  'modle2_side.png',
  'modle3_all.png',
  'modle3_back.png',
  'modle3_front.png',
  'modle3_side.png'
];
// 微官网
var arr6 = Array.from({
  length: 10
}, (v, k) => k + 1);
export const MIRCO_SITE = arr6.map(item => `template_${item}`);
