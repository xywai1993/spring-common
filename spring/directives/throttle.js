import { isString, isArray } from 'lodash';

const throttle = {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      // TODO: 怎么加入el-button的loading属性
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 2000);
      }
    });
  },
};

export default throttle;
