import router from "../router";
import { useAppStore } from "../store/app";

/**
 * @description 添加任务栏选项卡
 * @param {*} route
 */
export function addTaskbar(route) {
  const appStore = useAppStore();
  let taskbar = appStore.taskbar;
  let currentTaskKey = taskbar.history.findIndex((v) => v === route.name);
  if (currentTaskKey !== -1) taskbar.history.splice(currentTaskKey, 1);
  taskbar.history.unshift(route.name);

  let canAddTask = taskbar.list.every((v) => {
    return v.path !== route.path;
  });

  if (canAddTask) {
    if (appStore.taskbar.list.length > 8) {
      taskbar.list.shift();
    }
    taskbar.list.push(route);
  }
  appStore.setTaskbar(taskbar);
}

/**
 * @description 关闭选项卡
 * @param {*} name
 */
export function closeTaskbar(name) {
  const appStore = useAppStore();
  let taskbar = appStore.taskbar;
  // 移除任务栏历史
  let historyKey = taskbar.history.findIndex((v) => v == name);
  if (historyKey != -1) taskbar.history.splice(historyKey, 1);
  // 移除任务栏列表
  let listKey = taskbar.list.findIndex((v) => v.name == name);
  if (listKey != -1) taskbar.list.splice(listKey, 1);

  // 如果删除的是当前选项卡，跳转到上次访问的选项卡
  if (historyKey == 0) {
    let currentKey = taskbar.list.findIndex(
      (v) => v.name == taskbar.history[0]
    );
    if (taskbar.list[currentKey]) {
      router.push(taskbar.list[currentKey].path);
    } else {
      router.push("/");
    }
  }
  appStore.setTaskbar(taskbar);
}

/**
 * @description 关闭其它选项卡
 * @param {*} name
 */
export function closeOtherTaskbar(name) {
  const appStore = useAppStore();
  let taskbar = appStore.taskbar;
  let key = taskbar.list.findIndex((v) => v.name == name);
  let newTaskbar = {
    list: [taskbar.list[key]],
    history: [taskbar.list[key].name],
  };
  // 跳转已选中的选项卡
  if (taskbar.list[key].name != taskbar.history[0]) {
    router.push(newTaskbar.list[0].path);
  }
  appStore.setTaskbar(newTaskbar);
}

export const useTaskbar = () => {
  return {
    addTaskbar,
    closeTaskbar,
    closeOtherTaskbar,
  };
};
