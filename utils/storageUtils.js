/**
 * LocalStorage Management Utilities
 * ローカルストレージの管理ユーティリティ関数
 */

/**
 * 安全にlocalStorageから値を取得
 * @param {string} key - ストレージキー
 * @param {*} defaultValue - デフォルト値
 * @returns {*} 取得した値またはデフォルト値
 */
export const getStorageItem = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * 安全にlocalStorageに値を保存
 * @param {string} key - ストレージキー
 * @param {*} value - 保存する値
 * @returns {boolean} 保存成功可否
 */
export const setStorageItem = (key, value) => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * localStorageからキーを削除
 * @param {string} key - 削除するキー
 * @returns {boolean} 削除成功可否
 */
export const removeStorageItem = (key) => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * 文字列値専用のlocalStorage操作
 */
export const getStorageString = (key, defaultValue = '') => {
  if (typeof window === 'undefined') return defaultValue;
  return localStorage.getItem(key) || defaultValue;
};

export const setStorageString = (key, value) => {
  if (typeof window === 'undefined') return false;
  
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Error writing localStorage string key "${key}":`, error);
    return false;
  }
};

/**
 * boolean値専用のlocalStorage操作
 */
export const getStorageBoolean = (key, defaultValue = false) => {
  if (typeof window === 'undefined') return defaultValue;
  return localStorage.getItem(key) === 'true';
};

export const setStorageBoolean = (key, value) => {
  return setStorageString(key, value ? 'true' : 'false');
};