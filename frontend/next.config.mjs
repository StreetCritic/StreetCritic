/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // output: "export",

  webpack: (config, { isServer, dev }) => {
    config.experiments = {
      layers: true,
      asyncWebAssembly: true,
    };

    //   if (!dev && isServer) {
    //     webassemblyModuleFilename = "./../server/chunks/[modulehash].wasm";

    //     const patterns = [];

    //     const destinations = [
    //       "../static/wasm/[name][ext]", // -> .next/static/wasm
    //       "./static/wasm/[name][ext]",  // -> .next/server/static/wasm
    //       "."                           // -> .next/server/chunks (for some reason this is necessary)
    //     ];
    //     for (const dest of destinations) {
    //       patterns.push({
    //         context: ".next/server/chunks",
    //         from: ".",
    //         to: dest,
    //         filter: (resourcePath) => resourcePath.endsWith(".wasm"),
    //         noErrorOnMissing: true
    //       });
    //     }

    //     config.plugins.push(new CopyPlugin({ patterns }));
    //   }

    return config;
  },

  async rewrites() {
    return [
      {
        source: "/tiles/basemap.json",
        destination: "https://tiles.streetcritic.org/basemap.json",
        // destination: process.env.NODE_ENV === 'production' ?
        // 'https://nextjs.org' : 'https://github.com'
      },
    ];
  },
};

export default nextConfig;
