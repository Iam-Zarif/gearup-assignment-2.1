export function setCookie(key: string, value: string) {
  document.cookie = `${key}=${value}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
}

export function getCookie(key: string) {
  const cookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`));

  return cookies ? cookies.split("=")[1] : null;
}

export function removeCookie(key: string) {
  document.cookie = `${key}=; path=/; max-age=0`;
}
