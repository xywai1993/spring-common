import { request } from "../request";

export function login(data) {
  return request(
    {
      url: "auth/login",
      method: "POST",
      data,
    },
    {
      isGetDataDirectly: false,
    }
  );
}

export function getSiteConf() {
  return request(
    {
      url: "site/config",
    },
    {
      isGetDataDirectly: false,
    }
  );
}

export function currentUser() {
  return request(
    {
      url: "/auth/me",
    },
    {
      isGetDataDirectly: false,
    }
  );
}

export function getServerMenu() {
  return request(
    {
      url: "access/index",
    },
    {
      isGetDataDirectly: false,
    }
  );
}
