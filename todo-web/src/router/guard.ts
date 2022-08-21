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

    const userStore = useUserStoreWithOut();
    if (to.path == '/login' || userStore.user) {
      NProgress.done();
      next();
      return;
    }

    userStore.logout();
    NProgress.done();
    next(`/login`);
  });

  router.afterEach(async () => {
    // finish progress bar
    NProgress.done();
  });
}
