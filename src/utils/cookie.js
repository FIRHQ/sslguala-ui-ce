function saveCookie(name, value, exdays) {
  const cookie = `${name}=${value};`;
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toGMTString()}`;
  document.cookie = `${cookie + expires}; path=/`;
}

function getCookie(name) {
  const reg = new RegExp(`\\s*${name}=([^;]*)`);
  const match = document.cookie.match(reg);
  return match && match.length ? match[1] : undefined;
}

export {
  saveCookie,
  getCookie,
};
