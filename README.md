# svelte-github-template

An unopinionated Svelte web template for deploying to GitHub Pages bundling TypeScript, ESLint, and Tailwind CSS, utilizing atomic design.

## Getting started

You can recreate the repository yourself with the following steps:

1.  Run `npm create svelte@latest svelte-github-template` and select the **Skeleton project** app template. Enable TypeScript, ESLint, and Prettier. Then, push to a new repository.

2.  Install yarn:

    ```bash
    # Enable corepack if not already enabled
    corepack enable

    # Install latest version of yarn
    yarn set version stable
    ```

3.  Add `.yarn` to your `.gitignore` file.

4.  Create `.yarnrc.yml` and paste in the following to disable plug-and-play mode:

    ```yaml
    nodeLinker: node-modules
    ```

5.  Install dependencies:

    ```bash
    npx @svelte-add/tailwindcss@latest --typography true

    yarn add --dev \
        @sveltejs/adapter-static \
        prettier-plugin-classnames \
        prettier-plugin-jsdoc \
        prettier-plugin-merge
    ```

6.  Replace `.prettierrc` with the following:

    ```json
    {
      "trailingComma": "es5",
      "plugins": [
        "prettier-plugin-classnames",
        "prettier-plugin-jsdoc",
        "prettier-plugin-svelte",
        "prettier-plugin-tailwindcss",
        "prettier-plugin-merge"
      ],
      "overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }],
      "endingPosition": "absolute-with-indent"
    }
    ```

7.  Run `npx prettier --write .` to standardize formatting and indentation across all files (by default it is inconsistent).

8.  Modify `svelte.config.js` to be the following so that we incorporate the base path of the repository:

    ```js
    import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
    import adapter from "@sveltejs/adapter-static";

    const BASE_PATH = "/svelte-github-template";

    /** @type {import("@sveltejs/kit").Config} */
    const config = {
      kit: {
        adapter: adapter({
          fallback: "404.html",
        }),
        paths: {
          base: process.argv.includes("dev") ? "" : BASE_PATH,
        },
      },

      preprocess: [vitePreprocess({})],
    };

    export default config;
    ```

9.  Add the following options to `src/routes/+layout.ts`:

    ```js
    export const prerender = true;
    export const trailingSlash = "always";
    ```

10. Run `yarn build` to build the application and `yarn preview` to view the deployed application locally.

11. In GitHub, go to **Settings > Pages > Build and deployment > Source > GitHub Actions** and generate `svelte.yml` by pasting in the following:

    ```yml
    name: Deploy to GitHub Pages

    on:
      push:
        branches: "main"

    jobs:
      build_site:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout
            uses: actions/checkout@v4

          - name: Install Node.js
            uses: actions/setup-node@v4
            with:
              node-version: 20
              cache: npm

          - name: Install dependencies
            run: npm install

          - name: build
            env:
              BASE_PATH: "/${{ github.event.repository.name }}"
            run: |
              npm run build

          - name: Upload Artifacts
            uses: actions/upload-pages-artifact@v3
            with:
              # this should match the `pages` option in your adapter-static options
              path: "build/"

      deploy:
        needs: build_site
        runs-on: ubuntu-latest

        permissions:
          pages: write
          id-token: write

        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}

        steps:
          - name: Deploy
            id: deployment
            uses: actions/deploy-pages@v4
    ```

## CI/CD

The repository is configured with automatic daily updates using Dependabot and automatic build testing before each pull request. The CI/CD pipeline consists of the following workflows:

- `svelte.yml` automatically deploys the website to GitHub Pages on every push to the `main` branch.
- `pull_request.yml` runs a sanity check on every opened pull request to make sure the app still builds.
- `dependabot.yml` automatically updates dependencies on a daily basis. Major updates have individual pull requests while all minor and patch updates are grouped together.
- `dependabot_auto_merge.yml` automatically merges pull requests by Dependabot if it passes the sanity check.

The following GitHub settings are enabled:

- **General > Allow auto-merge**
- **Branches > Branch protection > Require status checks to pass before merging (pull_request_build)**

## Useful links

- https://kit.svelte.dev/docs/adapter-static
- https://flowbite-svelte.com/docs/pages/quickstart
