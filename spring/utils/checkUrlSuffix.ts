/**
 * @description 检测domainurl拼接以及阿里云、腾讯云、七牛云缩略图
 * @param src 地址
 * @param params 1.不裁剪params = null（可不传值） 2.裁剪默认值params = {} 3.传值裁剪params = 参数
 * 缩略图参数 params:{ width:宽度 height:高度 mode:缩放模式 quality:压缩质量 gravity:剪裁质量 }
 * */
import { isEmpty } from "lodash";
import { useAppStore } from "../store/app";

export function checkUrl(src, params = null) {
  const appStore = useAppStore();
  let url = src;
  if (url && !url.includes("http")) {
    url = appStore.info.domainurl + url;
  }
  if (appStore.info.filesystem != "public" && params) {
    if (url.indexOf(appStore.info.domainurl) != -1) {
      url += "?" + suffix(appStore.info.filesystem, params);
    }
  }
  return url;
}

function suffix(type, params) {
  let width = params.width || "200"; // 宽度
  let height = params.height || "200"; // 高度
  let mode = params.mode || "lfit"; // 缩放模式
  let quality = params.quality || 90; // 压缩质量
  let gravity = params.gravity || "center"; // 剪裁质量
  let suffix = "";
  let crop_str = "";
  let quality_str = "";
  let size = width + "x" + height;
  switch (type) {
    case "aliyun":
      // 裁剪
      if (!isEmpty(gravity) && gravity != "center") {
        // 指定了裁剪区域
        mode = "mfit";
        crop_str =
          "/crop,g_" +
          gravityFormat(type, gravity) +
          ",w_" +
          width +
          ",h_" +
          height;
      }

      // 质量压缩
      if (quality > 0 && quality < 100) {
        quality_str = "/quality,q_" + quality;
      }

      // 缩放参数
      suffix =
        "x-oss-process=image/resize,m_" + mode + ",w_" + width + ",h_" + height;

      // 拼接裁剪和质量压缩
      suffix += crop_str + quality_str;
      break;
    case "qcloud":
      let mode_str = "thumbnail";

      if (mode == "fill" || (!isEmpty(gravity) && gravity != "center")) {
        // 指定了裁剪区域
        mode_str = "crop";
        mode = "fill";
        crop_str = "/gravity/" + gravityFormat(type, gravity);
      }

      // 质量压缩
      if (quality > 0 && quality < 100) {
        quality_str = "/rquality/" + quality;
      }

      switch (mode) {
        case "lfit":
          size = "" + size + ">";
          break;
        case "mfit":
          size = "!" + size + "r";
        case "fill":
          break;
        case "pad":
          size = size + "/pad/1";
          break;
        case "fixed":
          size = size + "!";
          break;
      }

      suffix = "imageMogr2/" + mode_str + "/" + size + crop_str + quality_str;
      break;
    case "qiniu":
      if (mode == "fill" || (!isEmpty(gravity) && gravity != "center")) {
        // 指定了裁剪区域,全部转为 mfit
        mode = "mfit";
        crop_str = "/gravity/" + gravityFormat(type, gravity) + "/crop/" + size;
      }

      // 质量压缩
      if (quality > 0 && quality < 100) {
        quality_str = "/quality/" + quality;
      }

      switch (mode) {
        case "lfit":
        case "pad": // 七牛不支持在缩放之后，尺寸不足时，填充背景色,所以这里和 lfit 模式一样
          size = size + ">";
          break;
        case "mfit":
          size = "!" + size + "r";
          break;
        case "fill":
          // 会被转为 mfit
          break;
        case "fixed":
          size = size + "!";
          break;
      }

      suffix = "imageMogr2/thumbnail/" + size + crop_str + quality_str;
      break;
  }
  return suffix;
}

/**
 * 裁剪区域格式转换
 *
 * @param string $type aliyun|qcloud|qiniu
 * @param string $gravity 统一的裁剪区域字符
 *
 * @return string
 */
function gravityFormat(type, gravity) {
  let gravityFormat = {
    aliyun: {
      north_west: "nw", // 左上
      north: "north", // 中上
      north_east: "ne", // 右上
      west: "west", // 左中
      center: "center", // 中部
      east: "east", // 右中
      south_west: "sw", // 左下
      south: "south", // 中下
      south_east: "se", // 右下
    },
    qcloud: {
      northwest: "nw", // 左上
      north: "north", // 中上
      northeast: "ne", // 右上
      west: "west", // 左中
      center: "center", // 中部
      east: "east", // 右中
      southwest: "sw", // 左下
      south: "south", // 中下
      southeast: "se", // 右下
    },
    qiniu: {
      NorthWest: "nw", // 左上
      North: "north", // 中上
      NorthEast: "ne", // 右上
      West: "west", // 左中
      Center: "center", // 中部
      East: "east", // 右中
      SouthWest: "sw", // 左下
      South: "south", // 中下
      SouthEast: "se", // 右下
    },
  };

  return gravityFormat[type][gravity];
}
