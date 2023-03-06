import storage from './storage';
export { storage };

export function isArray(value) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === '[object Array]';
  }
}

export function isObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isNumber(value) {
  return !isNaN(Number(value));
}

export function isFunction(value) {
  return typeof value == 'function';
}

export function isString(value) {
  return typeof value == 'string';
}

export function isEmpty(value) {
  if (isArray(value)) {
    return value.length === 0;
  }

  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return value === '' || typeof value === 'undefined' || value === null;
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}

export function last(data) {
  if (isArray(data) || isString(data)) {
    return data[data.length - 1];
  }
}

export function cloneDeep(obj) {
  const d = isArray(obj) ? obj : {};

  if (isObject(obj)) {
    for (const key in obj) {
      if (obj[key]) {
        if (obj[key] && typeof obj[key] === 'object') {
          d[key] = cloneDeep(obj[key]);
        } else {
          d[key] = obj[key];
        }
      }
    }
  }

  return d;
}

export function clone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

export function deepMerge(a, b) {
  let k;
  for (k in b) {
    a[k] = a[k] && a[k].toString() === '[object Object]' ? deepMerge(a[k], b[k]) : (a[k] = b[k]);
  }
  return a;
}

export function contains(parent, node) {
  while (node && (node = node.parentNode)) if (node === parent) return true;
  return false;
}

export function getUrlParam(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}

export function isPc() {
  const userAgentInfo = navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  let flag = true;
  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

export function getBrowser() {
  const { clientHeight, clientWidth } = document.documentElement;

  // 浏览器信息
  const ua = navigator.userAgent.toLowerCase();

  // 浏览器类型
  let type = (ua.match(/firefox|chrome|safari|opera/g) || 'other')[0];

  if ((ua.match(/msie|trident/g) || [])[0]) {
    type = 'msie';
  }

  // 平台标签
  let tag = '';

  const isTocuh =
    'ontouchstart' in window || ua.indexOf('touch') !== -1 || ua.indexOf('mobile') !== -1;
  if (isTocuh) {
    if (ua.indexOf('ipad') !== -1) {
      tag = 'pad';
    } else if (ua.indexOf('mobile') !== -1) {
      tag = 'mobile';
    } else if (ua.indexOf('android') !== -1) {
      tag = 'androidPad';
    } else {
      tag = 'pc';
    }
  } else {
    tag = 'pc';
  }

  // 浏览器内核
  let prefix = '';

  switch (type) {
    case 'chrome':
    case 'safari':
    case 'mobile':
      prefix = 'webkit';
      break;
    case 'msie':
      prefix = 'ms';
      break;
    case 'firefox':
      prefix = 'Moz';
      break;
    case 'opera':
      prefix = 'O';
      break;
    default:
      prefix = 'webkit';
      break;
  }

  // 操作平台
  const plat = ua.indexOf('android') > 0 ? 'android' : navigator.platform.toLowerCase();

  // 屏幕信息
  let screen = 'full';

  if (clientWidth < 768) {
    screen = 'xs';
  } else if (clientWidth < 992) {
    screen = 'sm';
  } else if (clientWidth < 1200) {
    screen = 'md';
  } else if (clientWidth < 1920) {
    screen = 'xl';
  } else {
    screen = 'full';
  }

  // 是否 ios
  const isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

  // 浏览器版本
  const version = (ua.match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];

  // 是否微信浏览器
  const isWechatClient = /micromessenger/.test(navigator.userAgent.toLowerCase());

  // 是否 PC 端
  const isPC = tag === 'pc';

  // 是否移动端
  const isMobile = !isPC;

  // 是否移动端 + 屏幕宽过小
  const isMini = screen === 'xs' || isMobile;

  return {
    height: clientHeight,
    width: clientWidth,
    version,
    type,
    plat,
    tag,
    prefix,
    isMobile,
    isIOS,
    isPC,
    isWechatClient,
    isMini,
    screen,
  };
}

export function href(path, newWindow) {
  const { origin, pathname } = window.location;
  const routerMode = 'hash';
  if (pathname === path) {
    return false;
  }

  let url = '';

  if (routerMode === 'history') {
    url = origin + import.meta.env.BASE_URL + path.substr(1);
  } else {
    url = origin + import.meta.env.BASE_URL + '#' + path;
  }

  if (newWindow) {
    window.open(url);
  } else {
    window.location.href = url;
  }
}

// 搜索组装
export function composeFilter(search, op) {
  let filter = {};
  Object.keys(search).forEach((k) => {
    if (isObject(search[k])) {
      if (!isEmpty(search[k].value) && search[k].value !== 'all') {
        let stype = '=';
        if (op && op[search[k].field]) {
          if (isObject(op[search[k].field])) {
            stype = op[search[k].field].type || '=';
          } else {
            stype = op[search[k].field];
          }
        }
        filter[search[k].field] = [search[k].value, stype];
      }
    } else {
      if (!isEmpty(search[k]) && search[k] !== 'all') {
        let stype = '=';
        if (op && op[k]) {
          if (isObject(op[k])) {
            stype = op[k].type || '=';
          } else {
            stype = op[k];
          }
        }
        filter[k] = [
          isArray(search[k]) ? search[k].join(`${op[k].spacer ? op[k].spacer : ' - '}`) : search[k],
          stype,
        ];
      }
    }
  });
  return { search: JSON.stringify(filter) };
}

// 防抖
export function debounce(handle, delay) {
  let time = null;
  return function () {
    let self = this,
      arg = arguments;
    clearTimeout(time);
    time = setTimeout(function () {
      handle.apply(self, arg);
    }, delay);
  };
}

// 数组对象去重
export function doUnique(arr, field) {
  let map = new Map();
  for (let item of arr) {
    if (!map.has(item[field])) {
      map.set(item[field], item);
    }
  }
  return [...map.values()];
}

let unique = 0;
export function buildShortUUID(prefix = '') {
  const time = Date.now();
  unique++;
  return prefix + '_' + String(time) + unique;
}

export function isMobile() {
  return document.body.getBoundingClientRect().width - 1 < 768;
}
