const storage = {
  // 存数据前处理
  _getInputData(data, options) {
    const _data = {
      data,
      keyInfo: Object.assign(options, {
        timestamp: Math.round(new Date().getTime() / 1000),
      }),
    };

    return JSON.stringify(_data);
  },

  // 取数据后处理
  _getOutputData(data) {
    return JSON.parse(data);
  },

  // 获取_key的数据 => { data, keyInfo }
  _getData(_key) {
    const _data = localStorage.getItem(_key);

    return this._getOutputData(_data);
  },

  // 特殊处理key
  _getKey(key) {
    return `${import.meta.env.SPRING_CACHE_PREFIX}${key}`;
  },

  _remove(_key) {
    localStorage.removeItem(_key);
  },

  // 是否过期
  _isExpired(_key) {
    const { keyInfo } = this._getData(_key);
    const { expires, timestamp } = keyInfo;

    if (!expires) {
      return false;
    }

    return timestamp + expires - Math.round(new Date().getTime() / 1000) < 0;
  },

  // 是否只读取一次
  _isOnce(_key) {
    const { keyInfo } = this._getData(_key);
    const { isOnce } = keyInfo;

    return !!isOnce;
  },

  get(key, value = null) {
    const _key = this._getKey(key);
    const _data = this._getData(_key);

    // 没有默认值 则返回空
    if (!_data && value === null) {
      return null;
    }

    // 有默认值则保存缓存并返回
    if (!_data && value !== null) {
      this.set(key, value);
      return value;
    }

    const isExpired = this._isExpired(_key);
    const isOnce = this._isOnce(_key);

    // 删除已过期或者只读取一次的_key
    if (isExpired || isOnce) {
      this._remove(_key);
    }

    return isExpired ? null : _data.data;
  },

  set(key, data, expires = 0) {
    const _key = this._getKey(key);
    const _data = this._getInputData(data, { expires });

    localStorage.setItem(_key, _data);
  },

  remove(key) {
    const _key = this._getKey(key);

    this._remove(_key);
  },

  clear() {
    localStorage.clear();
  },

  once(key, data, options = {}) {
    const _key = this._getKey(key);
    const _data = this._getInputData(
      data,
      Object.assign(options, {
        isOnce: true,
      }),
    );

    localStorage.setItem(_key, _data);
  },
};

export default storage;
