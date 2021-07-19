import httpUtil from "utils/request";

const WECHAT_SIGN_UP = "users/auth/wechat";
const EMAIL_SIGN_UP = "users.json";
const EMAIL_SIGN_IN = "/users/sign_in.json";
const USER_INFO = "api/v1/users/info.json";
const API_TOKEN = "/api/v1/users/reset_token";

export function postSignUp(params) {
  return httpUtil.post(WECHAT_SIGN_UP, params);
}

export function postSignUpByEmail(params) {
  return httpUtil.post(EMAIL_SIGN_UP, params);
}
export function postSignInByEmail(params) {
  return httpUtil.post(EMAIL_SIGN_IN, params);
}

export function postSignIn(params) {
  return httpUtil.post(WECHAT_SIGN_UP, params);
}

export function getUserInfo() {
  return httpUtil.get(USER_INFO);
}

export function resetApiToken() {
  return httpUtil.post(API_TOKEN);
}
