import Cookies from 'js-cookie';

export default class AuthCookie {
  static getToken() {
    return Cookies.get('Token');
  }

  static setToken(token: string) {
    return Cookies.set('Token', token, { expires: 30 });
  }

  static removeToken() {
    return Cookies.remove('Token');
  }
}
