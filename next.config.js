/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  basePath: "/paychecknow",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin",
        permanent: true,
      },
    ];
  },
};
