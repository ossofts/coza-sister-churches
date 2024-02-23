// import Cookies from "js-cookie";

/**
 *
 * @param {Obj} access access token obj{token, token_expires}
 * @param {obj} refresh same obj as access
 */

export const tokenNames = {
  accessToken: "NUMBER_ONE",
  refreshToken: "NUMBER_TWO"
};
async function setToken(accessToken: string, refreshToken: string) {
  //-->Set access token
  localStorage.setItem(tokenNames.accessToken, accessToken);
  //-->Set refresh token
  localStorage.setItem(tokenNames.refreshToken, refreshToken);
}

function getValueFromLocalStorage(value: string) {
  const response = localStorage.getItem(value);

  return response;
}
// function getValueFromCookie(value: string) {
//   let result = null;
//   const cookieResponse = Cookies.get(value);

//   // to be configured when cookie is set

//   if (cookieResponse) {
//     result = cookieResponse;
//     result = JSON.parse(result);

//     return result;
//   }

//   return result;
// }
/**
 *
 * @returns Access token
 */
function getToken() {
  return getValueFromLocalStorage(tokenNames.accessToken);
}
/**
 *
 * @returns Refresh Token
 */
function getRefreshToken() {
  return getValueFromLocalStorage(tokenNames.refreshToken);
}

function removeToken() {
  localStorage.removeItem(tokenNames.accessToken);
  localStorage.removeItem(tokenNames.refreshToken);
}

export { setToken, getToken, getRefreshToken, removeToken };
