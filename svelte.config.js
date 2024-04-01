import adapter from "@sveltejs/adapter-static";

const BASE_PATH = "/svelte-github-template";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: "404.html",
    }),
    paths: {
      base: process.argv.includes("dev") ? "" : BASE_PATH,
    },
  },
};

export default config;
