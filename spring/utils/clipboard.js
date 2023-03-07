import Clipboard from "clipboard";
import { ElMessage } from "element-plus";
/**
 * @description 复制数据
 * @param text
 */
export default function handleClipboard(text) {
  const clipboard = new Clipboard(`<div></div>`, {
    text: () => text,
  });
  clipboard.on("success", () => {
    ElMessage({
      message: "复制成功",
      type: "success",
    });
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    ElMessage({
      message: "复制失败",
      type: "warning",
    });
    clipboard.destroy();
  });
  clipboard.onClick(event);
}
