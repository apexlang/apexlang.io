// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/vsDark");
const darkCodeTheme = require("prism-react-renderer/themes/vsLight");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Apex",
  tagline:
    "A top-down / API-first description language for modeling and generating cloud-native applications",
  url: "https://apexlang.io",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "apexlang", // Usually your GitHub org/user name.
  projectName: "apexlang.io", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themes: ["@docusaurus/theme-live-codeblock"],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-WX664KEGDE",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "Apex",
          src: "img/logo-horizontal-light.svg",
          srcDark: "img/logo-horizontal-dark.svg",
        },
        items: [
          {
            type: "doc",
            docId: "getting-started",
            position: "left",
            label: "Docs",
          },
          /*{to: '/blog', label: 'Blog', position: 'left'},*/
          {
            href: "https://github.com/apexlang",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Introduction",
                to: "/docs/getting-started",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/apexlang",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/apexlang",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/apexlang",
              },
            ],
          },
          {
            title: "More",
            items: [
              /*{
                label: 'Blog',
                to: '/blog',
              },*/
              {
                label: "GitHub",
                href: "https://github.com/apexlang",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Apex Contributors.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["protobuf", "bash", "rust", "shell-session"],
        magicComments: [
          {
            className: "code-block-highlighted-line",
            line: "highlight-next-line",
            block: { start: "highlight-start", end: "highlight-end" },
          },
          {
            className: "code-block-error-line",
            line: "This will error",
          },
        ],
      },
    }),
};

module.exports = config;
