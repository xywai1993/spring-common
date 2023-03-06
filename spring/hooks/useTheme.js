import $storage from '@/spring/utils/storage';
import { useAppStore } from '@/spring/store/app';

// 加载主题设置
export function loadTheme() {
  setTheme();
  setDarkMode();
}
// 设置主题
export function setTheme(themeName = '') {
  const theme = themeName || $storage.get('theme') || 'element';

  useAppStore().setTheme(theme);
  $storage.set('theme', theme);
  createThemeLink();
}
// 设置暗黑模式
export function setDarkMode(modeName = '') {
  const mode = modeName || $storage.get('darkMode') || 'light';

  useAppStore().setDarkMode(mode);
  $storage.set('darkMode', mode);
  createThemeLink();
}
// 引入主题样式
function createThemeLink() {
  const appLayout = useAppStore().layout;
  const html = document.querySelector('html');
  html.className = '';
  html.classList.add('mode-' + appLayout.darkMode);
  html.classList.add('theme-' + appLayout.theme);
}

export default { loadTheme, setTheme, setDarkMode };
