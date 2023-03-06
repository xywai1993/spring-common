import { isString, isArray } from 'lodash';
import { useAccountStore } from '@/spring/store/account';

const auth = {
  mounted(el, binding) {
    if (!checkAuth(binding.value)) {
      el.parentNode.removeChild(el);
    }
  },
};
// 检查权限
function checkAuth(name) {
  const accountStore = useAccountStore();
  const info = accountStore.info;
  const apiRules = accountStore.apiRules;
  if (isString(name)) {
    // return !(!info.is_super && !apiRules.includes(name));
    return apiRules.includes(name);
  } else if (isArray(name)) {
    let flag = name.every((n) => {
      return apiRules.includes(n);
    });
    return !(!info.is_super && !flag);
  }
}
export { checkAuth };
export default auth;
