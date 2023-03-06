<template>
  <div class="login-content">
    <el-row>
      <el-col :xs="0" :sm="0" :md="13" :lg="14" :xl="14"></el-col>
      <el-col class="main" :xs="24" :sm="24" :md="11" :lg="10" :xl="10">
        <transition name="el-zoom-in-center">
          <!-- 使用账号密码登录 -->
          <div
            v-if="login.type == 'input'"
            class="login-wrap sa-flex sa-flex-center sa-flex-1"
            :class="
              login.config.mode != 'none'
                ? 'login-wrap-code'
                : 'login-wrap-none'
            "
          >
            <div class="admin-name">
              <div>
                <div class="sa-line-1">很高兴再次见到您!</div>
                <!--                <div class="admin-welcome"></div>-->
              </div>
            </div>
            <el-form
              :model="form.data"
              :rules="form.rules"
              label-position="left"
              ref="formRef"
              label-width="0"
            >
              <el-form-item prop="account">
                <el-input
                  :class="form.data.username ? 'is-focus' : ''"
                  v-model="form.data.username"
                >
                  <template #prefix>
                    <div class="label">账号</div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  :class="form.data.password ? 'is-focus' : ''"
                  v-model="form.data.password"
                  :type="showPwd ? 'password' : 'text'"
                  autocomplete="new-password"
                >
                  <template #prefix>
                    <div class="label">密码</div>
                  </template>
                  <template #suffix>
                    <span v-if="showPwd" @click="showPwd = false">
                      <sa-svg name="sa-password-hide" size="24"></sa-svg>
                    </span>
                    <span v-if="!showPwd" @click="showPwd = true">
                      <sa-svg name="sa-password-show" size="24"></sa-svg>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
              <div class="admin-captcha">
                <el-form-item v-if="login.config.mode == 'code'" prop="captcha">
                  <el-input
                    class="mode-code"
                    :class="form.data.captcha ? 'is-focus' : ''"
                    v-model="form.data.captcha"
                  >
                    <template #prefix>
                      <div class="label">验证码</div>
                    </template>
                  </el-input>
                  <img
                    :src="codeImage"
                    @click="refreshCodeImage"
                    class="mode-code-image"
                  />
                </el-form-item>
                <el-form-item v-if="login.config.mode == 'geetest'">
                  <div id="captchaWrap"></div>
                </el-form-item>
              </div>
              <div>
                <el-checkbox
                  v-model="login.last.rememberMe"
                  @change="changeRememberMe"
                  label="记住我"
                ></el-checkbox>
              </div>
              <el-button
                type="primary"
                :loading="loginLoading"
                @click="accountLogin"
                >登录
              </el-button>
              <div class="login-or sa-flex sa-row-center">或</div>
              <el-button @click="thirdLogin">
                <sa-svg
                  class="sa-m-r-8"
                  name="sa-login-wechat"
                  size="22"
                ></sa-svg>
                微信快捷登录
              </el-button>
            </el-form>
          </div>
          <!-- 有记住的用户 -->
          <div
            v-else-if="login.type == 'rememberMe'"
            class="login-wrap sa-flex sa-flex-center sa-flex-1"
            :class="
              login.config.mode != 'none'
                ? 'login-wrap-code'
                : 'login-wrap-none'
            "
          >
            <div class="admin-name sa-flex sa-row-center">
              <sa-image
                :url="login.last.info.avatar"
                size="80"
                radius="40"
              ></sa-image>
            </div>
            <el-form
              :model="form.data"
              :rules="form.rules"
              label-position="left"
              ref="formRef"
              label-width="0"
            >
              <el-form-item prop="account">
                <div class="sa-flex-1 sa-flex sa-row-center">
                  {{ login.last.info.nickname }}
                </div>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  :class="form.data.password ? 'is-focus' : ''"
                  v-model="form.data.password"
                  :type="showPwd ? 'password' : 'text'"
                  autocomplete="new-password"
                >
                  <template #prefix>
                    <div class="label">密码</div>
                  </template>
                  <template #suffix>
                    <span v-if="showPwd" @click="showPwd = false">
                      <sa-svg name="sa-password-hide" size="24"></sa-svg>
                    </span>
                    <span v-if="!showPwd" @click="showPwd = true">
                      <sa-svg name="sa-password-show" size="24"></sa-svg>
                    </span>
                  </template>
                </el-input>
              </el-form-item>
              <div class="admin-captcha">
                <el-form-item v-if="login.config.mode == 'code'" prop="captcha">
                  <el-input
                    class="mode-code"
                    :class="form.data.captcha ? 'is-focus' : ''"
                    v-model="form.data.captcha"
                  >
                    <template #prefix>
                      <div class="label">验证码</div>
                    </template>
                  </el-input>
                  <img
                    :src="codeImage"
                    @click="refreshCodeImage"
                    class="mode-code-image"
                  />
                </el-form-item>
                <el-form-item v-if="login.config.mode == 'geetest'">
                  <div id="captchaWrap"></div>
                </el-form-item>
              </div>
              <el-button
                type="primary"
                :loading="loginLoading"
                @click="accountLogin"
                >登录
              </el-button>
              <div class="login-or sa-flex sa-row-center">或</div>
              <el-button @click="changeLoginType('input')">
                使用其他账号登录
              </el-button>
            </el-form>
          </div>
          <!-- 扫码登录 -->
          <div
            v-else-if="login.type == 'scan'"
            class="login-wrap sa-flex sa-flex-center sa-flex-1"
            :class="
              login.config.mode != 'none'
                ? 'login-wrap-code'
                : 'login-wrap-none'
            "
          >
            <div class="admin-name">
              <div>
                <div class="sa-line-1">很高兴再次见到您!</div>
                <!--                <div class="admin-welcome"></div>-->
              </div>
            </div>
            <div class="scan-image">
              <sa-image v-if="qrcodeUrl" :url="qrcodeUrl"></sa-image>

              <div
                class="scan-image-tip sa-flex"
                v-if="qrcodeStatus === 'expired'"
              >
                <div class="tip-code">二维码已过期</div>
                <div
                  class="tip-refresh sa-flex sa-row-center"
                  @click="thirdLogin"
                >
                  <el-icon>
                    <RefreshRight />
                  </el-icon>
                  <span>点击刷新</span>
                </div>
              </div>

              <div
                class="scan-image-tip sa-flex"
                v-if="qrcodeStatus === 'success'"
              >
                <div class="tip-code">登录中...</div>
                <div class="tip-refresh sa-flex sa-row-center">
                  <el-icon>
                    <SuccessFilled />
                  </el-icon>
                  <span>已扫码</span>
                </div>
              </div>

              <div
                class="scan-image-tip sa-flex"
                v-if="qrcodeStatus === 'error'"
              >
                <div class="tip-code">未配置微信公众平台</div>
                <div
                  class="tip-refresh sa-flex sa-row-center"
                  @click="thirdLogin"
                >
                  <el-icon>
                    <RefreshRight />
                  </el-icon>
                  <span>点击重试</span>
                </div>
              </div>
            </div>
            <div class="scan-tip">请使用微信扫描二维码登录</div>
            <div
              class="back-input sa-flex sa-flex-center"
              @click="changeLoginType('input')"
            >
              <el-icon>
                <ArrowLeft />
              </el-icon>
              使用其他账号登录
            </div>
          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import {
  reactive,
  ref,
  unref,
  computed,
  onBeforeMount,
  onMounted,
  onUnmounted,
} from "vue";

import router from "@/spring/router";
import { useRoute } from "vue-router";
import storage from "@/spring/utils/storage";
import sheep from "@/spring";
import { checkUrl } from "@/spring/utils/checkUrlSuffix";
import { useAccountStore } from "@/spring/store/account";
import { useAppStore } from "@/spring/store/app";

const accountStore = useAccountStore();
const appStore = useAppStore();
const routeQuery = useRoute().query;
if (routeQuery.token) {
  accountStore.setToken(`${routeQuery.token}`);
}
const appName = computed(() => appStore.info.name);

const showPwd = ref(true);

const loginLoading = ref(false);
const formRef = ref(null);

const form = reactive({
  data: {
    username: "",
    password: "",
    captcha: "",
  },
  rules: {
    username: [{ required: true, message: "请输入账号", trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  },
  geetest: reactive({}),
});

// 登录
const accountLogin = async () => {
  // 表单验证
  unref(formRef).validate(async (valid) => {
    if (!valid) return;
    loginLoading.value = true;
    let submit = form.data;

    if (login.config.mode === "geetest") {
      submit.captcha = login.config.mode;
      submit = { ...submit, ...form.geetest };
    }
    if (login.config.mode === "none") {
      delete submit.captcha;
    }
    // submit.captcha = login.config.mode;

    const { code, data } = await accountStore.login(submit);
    loginLoading.value = false;

    if (code === 200) {
      // storage.set('lastLogin', login.last);
      await appStore.appLoad();
      accountStore.setToken(data.token);
      accountStore.afterLogin().then();
      router.push("/");
    }
  });
};

// 初始化验证码
function initCaptcha() {
  if (login.config.mode === "code") {
    refreshCodeImage();
  }
  if (login.config.mode === "geetest") {
    initGt();
  }
}

// 初始化极验验证码
const initGt = async () => {
  window.initGeetest(
    {
      gt: login.config.config.gt,
      challenge: login.config.config.challenge,
    },
    function (captchaObj) {
      captchaObj.appendTo("#captchaWrap");
      captchaObj.onSuccess(function () {
        form.geetest = captchaObj.getValidate();
      });
    }
  );
};

// 图片验证码地址
const codeImage = ref("");
// 刷新图片验证码
const refreshCodeImage = () => {
  codeImage.value = login.config.config.url + "?d=" + Math.random();
};

const login = reactive({
  config: {},
  type: "input",
  last: {},
});

// 初始化登陆表单
function checkLastLogin() {
  login.last = storage.get("lastLogin", { rememberMe: false });
  if (login.last.rememberMe) {
    login.type = "rememberMe";
    form.data.account = login.last.info.account;
  }
}

function changeLoginType(type) {
  login.type = type;
  if (type == "input") {
    form.data.account = "";
    form.data.password = "";
    initLogin();
  }
}

function changeRememberMe(e) {
  login.last.rememberMe = e;
}

let qrcodeUrl = ref("");
let eventId = "";
let qrcodeStatus = ref("pending");

// 获取登录二维码
async function getLoginQrcode() {
  login.type = "scan";
  qrcodeStatus.value = "";
  // const { error, data } = await wechatApi.admin.user.getQrcode({
  //   event: 'login',
  // });
  // if (error === 1) {
  //   qrcodeStatus.value = 'error';
  //   return;
  // }
  // qrcodeUrl.value = data.url;
  // eventId = data.eventId;
  // qrcodeStatus.value = 'pending';
  // checkLoginScanResult(eventId);
}

// 检查二维码扫码状态
async function checkLoginScanResult(eventId) {
  const { error, data } = await wechatApi.admin.user.checkScan({
    event: "login",
    eventId,
  });
  if (error == 1) {
    // 二维码过期
    qrcodeStatus.value = "expired";
  } else if (error == -1 && login.type == "scan") {
    // 未扫码
    setTimeout(function () {
      checkLoginScanResult(eventId);
    }, 900);
  } else if (error == 0) {
    // 扫码成功
    qrcodeStatus.value = "success";
    setTimeout(async () => {
      await appStore.appLoad();
      router.push("/");
    }, 500);
  }
}

onBeforeMount(async () => {
  // 检测登录态
  if (accountStore.isLogin) {
    await appStore.appLoad();
    await router.push("/admin/profile");
  } else {
    await initLogin();
    checkLastLogin();
  }
});

onMounted(() => {
  document.addEventListener("keyup", enterKey);
});

onUnmounted(() => {
  document.removeEventListener("keyup", enterKey);
});

function enterKey(event) {
  const code = event.keyCode
    ? event.keyCode
    : event.which
    ? event.which
    : event.charCode;
  if (code === 13) {
    accountLogin();
  }
}

async function initLogin() {
  // const { data } = await adminApi.loginConfig();
  // login.config = data;
  // login.config.background = checkUrl(login.config.background);
  // // 加载验证码
  // if (login.config.mode !== 'none') {
  //   initCaptcha();
  // }
}

// 微信公众号登录
async function thirdLogin() {
  const { isWechatClient } = appStore.browser;
  if (!isWechatClient) {
    await getLoginQrcode();
  } else {
    let params = {
      payload: encodeURIComponent(
        JSON.stringify({
          page: location.href,
        })
      ),
    };
    // const { data } = await adminApi.account.thirdLogin(params);
    window.location = data.oauth_url;
  }
}
</script>
<style lang="scss">
.login-content {
  .mode-code {
    flex: 1;
  }

  .mode-code-image {
    height: 48px;
    margin-left: 30px;
    cursor: pointer;
  }

  #captchaWrap {
    width: 100%;
  }

  .geetest_wind {
    width: inherit !important;

    .geetest_logo,
    .geetest_success_logo {
      right: 15px !important;
    }

    .geetest_radar_tip,
    .geetest_success_radar_tip {
      padding: 0 46px 0 55px !important;
    }

    .geetest_radar {
      margin: 6px 6px 6px 15px !important;
    }

    .geetest_success_box {
      left: 15px !important;
    }
  }

  .el-form {
    width: 100%;

    .el-button {
      width: 100%;
      height: 48px;
      line-height: 1;
      margin-top: 10px;
    }

    .el-button--default {
      margin-top: 0;

      .sa-svg {
        font-size: 22px;
        margin-right: 6px;
      }
    }

    .el-form-item {
      margin-bottom: 32px;
    }

    .admin-captcha {
      .el-form-item {
        margin-bottom: 10px;
      }
    }

    .el-form-item__content {
      line-height: unset;
    }
  }
}
</style>
<style lang="scss" scoped>
.login-content {
  height: 100%;
  color: var(--sa-subtitle);
  background-size: cover;
  background-repeat: no-repeat;
  background-color: var(--sa-background-assist);
  background-image: url("assets/background.jpg");

  @media only screen and (max-width: 768px) {
    background-position: center;
  }

  .el-row {
    height: 100%;

    .el-col {
      display: flex;
      align-items: center;
    }

    @media only screen and (max-width: 992px) {
      .el-col {
        justify-content: center;
      }
    }
  }

  .main {
    position: relative;
  }

  .login-wrap {
    width: 460px;
    flex-direction: column;
    padding: 56px 52px 64px;
    border-radius: 8px;
    background: var(--sa-background-assist);
    filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.2));
    position: absolute;

    .admin-name {
      width: 100%;
      height: 112px;
      font-size: 32px;
      text-align: center;

      .admin-welcome {
        font-size: 20px;
        margin-top: 16px;
        text-align: center;
      }

      .sa-image {
        margin-bottom: 32px;
      }
    }

    .login-or {
      margin: 16px 0;
      color: var(--sa-subfont);
    }

    .scan-image {
      width: 264px;
      height: 264px;
      border: 1px solid var(--sa-border);
      position: relative;

      .sa-image {
        width: 100%;
        height: 100%;
      }

      .scan-image-tip {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(253, 253, 253, 0.94);
        flex-direction: column;
        justify-content: center;

        .tip-code {
          font-size: 18px;
          color: var(--sa-title);
          margin-bottom: 16px;
        }

        .tip-refresh {
          font-size: 16px;
          color: var(--el-color-primary);
          cursor: pointer;

          .el-icon {
            font-size: 20px;
          }

          span {
            line-height: 1;
          }
        }
      }
    }

    .scan-tip {
      font-size: 16px;
      color: var(--sa-font);
      font-weight: 600;
      margin: 47px 0 58px;
    }

    .back-input {
      font-size: 14px;
      color: var(--sa-font);
      cursor: pointer;

      .el-icon {
        margin-right: 8px;
      }
    }
  }

  .login-wrap-code {
    height: 636px;
  }

  .login-wrap-none {
    height: 592px;

    .scan-image {
      width: 177px;
      height: 177px;
    }

    .scan-tip {
      margin: 70px 0 58px;
    }
  }

  @media only screen and (max-width: 768px) {
    .login-wrap {
      width: 100%;
      max-width: unset;
      height: 100%;
      border-radius: 0;
      padding: 56px 20px 64px;
      background: transparent;
      filter: unset;

      .admin-name {
        font-size: 26px;
      }
    }
  }

  :deep() {
    .el-input {
      --el-input-height: 48px;
      max-width: unset;

      .el-input__wrapper {
        position: relative;

        .label {
          display: flex;
          align-items: center;
          width: fit-content;
          height: 20px;
          position: absolute;
          top: 14px;
          left: 11px;
          pointer-events: none;
          font-size: 18px;
          color: var(--sa-subfont);
        }

        &.is-focus {
          .label {
            top: 4px;
            font-size: 12px;
            transition: ease-in-out 0.2s;
          }

          .el-input__inner {
            padding: 25px 0 9px;
          }
        }
      }

      &.is-focus {
        .label {
          top: 4px;
          font-size: 12px;
          transition: ease-in-out 0.2s;
        }

        .el-input__inner {
          padding: 25px 0 9px;
        }
      }
    }
  }
}
</style>
