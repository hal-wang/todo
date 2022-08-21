import Cookies from 'js-cookie';
import User from '../models/User';

export default class AuthCookie {
  static getLoginInfo() {
    const str = Cookies.get('LoginInfo');
    if (!str) return null;
    return JSON.parse(str) as User;
  }

  static setLoginInfo(user: User) {
    return Cookies.set('LoginInfo', JSON.stringify(user), { expires: 30 });
  }

  static removeLoginInfo() {
    return Cookies.remove('LoginInfo');
  }
}
