module.exports = {
  title: "todo",
  description: "A demo of cloudbase-access",
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "https://blog.hal.wang/imgs/cba.png",
      },
    ],
  ],
  markdown: {
    lineNumbers: true,
  },
  base: "/docs/",
  serviceWorker: true,
  themeConfig: {
    logo: "https://blog.hal.wang/imgs/cba.png",
    lastUpdated: "lastUpdate",
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Docs",
        ariaLabel: "Docs",
        items: [
          { text: "About", link: "/about/" },
          {
            text: "Api",
            link: `https://todo-5gcg801923564f08-1253337886.ap-shanghai.service.tcloudbase.com/v2`,
          },
        ],
      },
      { text: "GitHub", link: "https://github.com/hal-wang/todo" },
    ],
    sidebar: {
      "/api/": [""],
      "/about/": [""],
    },
  },
};
