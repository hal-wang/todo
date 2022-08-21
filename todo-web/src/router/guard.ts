import { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { useUserStoreWithOut } from '../store/modules/user';

const title = 'todo';
function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}

NProgress.configure({ showSpinner: false }); // NProgress Configuration

export function createProgressGuard(router: Router) {
  router.beforeEach(async (to: any, _from: any, next: any) => {
    NProgress.start(); // start progress bar
    document.title = getPageTitle(to.meta.title); // set page title

    function done() {
      NProgress.done();
      next();
    }
    function goLogin() {
      userStore.logout();
      NProgress.done();
      next(`/login`);
    }

    const userStore = useUserStoreWithOut();
    if (to.path == '/login') {
      return done();
    }

    if (userStore.user) {
      done();
    } else {
      const userInfo = await userStore.getUserInfo();
      if (userInfo) {
        done();
      } else {
        goLogin();
      }
    }
  });

  router.afterEach(async () => {
    // finish progress bar
    NProgress.done();
  });
}
