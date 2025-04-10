/**
 * Gets a cookie value by name
 * @param name The name of the cookie to retrieve
 * @returns The cookie value or an empty string if not found
 */
export function getCookie(name: string): string {
  if (typeof document === 'undefined') {
    return '';
  }
  
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return '';
}

/**
 * Sets a cookie with the given name, value and options
 * @param name The name of the cookie to set
 * @param value The value to store in the cookie
 * @param days Optional number of days until the cookie expires
 */
export function setCookie(name: string, value: string, days?: number): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  let cookie = `${name}=${value}; path=/; SameSite=Lax`;
  
  if (days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    cookie += `; expires=${expirationDate.toUTCString()}`;
  }
  
  document.cookie = cookie;
}

/**
 * Deletes a cookie by setting its expiration date to the past
 * @param name The name of the cookie to delete
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
} 