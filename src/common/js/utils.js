import {ECB_KEY} from '@/common/dict/const';
import CryptoJS from 'crypto-js';

/**
 * 对象字符串转成对象
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export const parseText = (str) => {
  if (str.startsWith('{') || str.startsWith('[')) {
    str = str.replace(/'/g, '"');
    str = str.replace(/(\s?\{\s?)(\S)/g, '$1' + '"' + '$2');
    str = str.replace(/(\s?,\s?)(\S)/g, '$1' + '' +
      '$2');
    str = str.replace(/(\S\s?):(\s?\S)/g, '$1' + '":' + '$2');
    str = str.replace(/,'\{/g, ',{');
    str = str.replace(/""/g, '"');
    str = str.replace(/\s/g, '');
    try {
      str = JSON.parse(str);
    } catch (e) {
      console.log(e);
    }
  }
  return str;
};
/**
 * 判断是否对象
 * @param  {[type]}  arg [description]
 * @return {Boolean}     [description]
 */
export const isObject = (arg) => {
  return typeof arg === 'object' && arg !== null;
};

// COOKIE
export const cookie = (() => {
  return {
    // 设置cookie
    //   cookie.set('x-token', data, 7, '/');
    set: (sKey, sValue, vEnd, sPath, sDomain, bSecure) => {
      if (!sKey || /^(?:expires|max\/-age|path|domain|secure)$/i.test(sKey)) {
        return false;
      }
      var sExpires = '';
      if (vEnd) {
        var exp = new Date();
        exp.setTime(exp.getTime() + vEnd * 24 * 60 * 60 * 1000);
        sExpires = '; expires=' + exp.toGMTString();
      }
      document.cookie = encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue) + sExpires + (sDomain
        ? '; domain=' + sDomain
        : '') + (sPath
        ? '; path=' + sPath
        : '') + (bSecure
        ? '; secure'
        : '');
      return true;
    },
    // 删除cookie
    del: (sKey, sPath, sDomain) => {
      if (!sKey) {
        return false;
      }
      document.cookie = encodeURIComponent(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sDomain
        ? '; domain=' + sDomain
        : '') + (sPath
        ? '; path=' + sPath
        : '');
      return true;
    },
    // 获取cookie
    get: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + encodeURIComponent(sKey).replace(/[\\-\\.\\+\\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
    }
  };
})();

// =============
// 交换数组元素
export const swapItems = (arr, index1, index2) => {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
};
// 上移数组
export const upMove = (arr, $index) => {
  if ($index === 0) {
    return;
  }
  return swapItems(arr, $index, $index - 1);
};
// 下移数组
export const downMove = (arr, $index) => {
  if ($index === arr.length - 1) {
    return;
  }
  return swapItems(arr, $index, $index + 1);
};

// =============
/**
 * 获取短信验证码=>按钮状态
 * @param  {[type]} el      [description]
 * @param  {[type]} btnText [description]
 * @return {[type]}         [description]
 */
export const btnStatus = (el, btnText) => {
  let s = 60;
  const obj = el.target;
  const timer = setInterval(() => {
    s--;
    obj.disabled = true;
    obj.style.background = '#cccccc';
    obj.innerText = btnText + '(' + s + ')';
    if (s === -1) {
      clearInterval(timer);
      obj.disabled = false;
      obj.style.background = '#4c93fd';
      obj.innerText = '获取验证码';
      s = 60;
    }
  }, 1000);
};

// ========
// 合成&下载图片
/**
 * 获取mimeType
 * @param  {String} type the old mime-type
 * @return the new mime-type
 */
export const _fixType = (type) => {
  type = type.toLowerCase().replace(/jpg/i, 'jpeg');
  var r = type.match(/png|jpeg|bmp|gif/)[0];
  return 'image/' + r;
};

/**
 * 在本地进行文件保存
 * @param  {String} data     要保存到本地的图片数据
 * @param  {String} filename 文件名
 */
export const saveFile = (data, filename) => {
  var savelink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
  savelink.href = data;
  savelink.download = filename;
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  savelink.dispatchEvent(event);
};

/*
过滤一个结果的空记录添加，过滤空搜索
 */
export const historyItems = (() => {
  return {
    set: (keyword) => {
      keyword = keyword.trim();
      let {historyItems} = localStorage;
      if (historyItems === undefined) {
        localStorage.historyItems = keyword;
      } else {
        const onlyItem = historyItems.split('|').filter(e => e !== keyword);
        if (onlyItem.length > 0) {
          historyItems = keyword + '|' + onlyItem.join('|');
          localStorage.historyItems = historyItems;
        }
      }
    },
    clear: () => {
      localStorage.removeItem('historyItems');
    }
  };
})();

/**
 * 图片转成base64
 * @param  {[type]}   url          [description]
 * @param  {Function} callback     [description]
 * @param  {[type]}   error        [description]
 * @param  {[type]}   outputFormat [description]
 * @return {[type]}                [description]
 */
export const convertImgToBase64 = (url, callback, error, outputFormat) => {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');

  function requestImg (src) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    var timeStamp = +new Date();
    img.src = `${src}?r=${timeStamp}`;
    return img;
  };
  var imgObj = requestImg(url);
  imgObj.onload = () => {
    canvas.height = imgObj.height;
    canvas.width = imgObj.width;
    ctx.drawImage(imgObj, 0, 0);
    var dataURL = canvas.toDataURL(outputFormat || 'image/png');
    callback.call(this, dataURL);
    canvas = null;
  };
};

/**
 * AES加密
 * @param {[type]} word [description]
 */
export const Encrypt = (word) => {
  var key = CryptoJS.enc.Utf8.parse(ECB_KEY);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};

/**
 * 跳转新页面
 * @param  {[type]} url   [description]
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
export const goto = (url, param) => {
  var tempwindow = window.open();
  tempwindow.location = `${url}`;
};

// 设备检测
export const Device = (() => {
  let ua = navigator.userAgent;
  let isAndroid = /Android/i.test(ua);
  let isIOS = /iPhone|iPad|iPod/i.test(ua);
  let isMobile = isAndroid || isIOS;
  return {
    isIOS: isIOS,
    isMobile: isMobile,
    isPc: !isMobile,
    isAndroid: isAndroid
  };
})();

export const imgPath = function (path, options = 'x-oss-process=image/resize,m_fill,h_200,w_200') {
  if (String(path).indexOf('x-oss-process') >= 0) {
    if (options) {
      if (String(path).indexOf('?') >= 0) {
        let end = String(path).indexOf('?');
        path = String(path).substr(0 ,end);
        return `${path}?${options}`;
      }
      return `${path},${options}`;
    }
    return path;
  };
  return `${path}?${options}`;
};
