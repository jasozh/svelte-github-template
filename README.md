# svelte-github-template

An unopinionated Svelte web template for deploying to GitHub Pages bundling TypeScript, ESLint, and Tailwind CSS, utilizing atomic design.

## Getting started

You can recreate the repository yourself with the following steps:

1. Run `npm create svelte@latest svelte-github-template` and push to a new repository.

2. Run `npx prettier . --write` to standardize formatting and indentation across all files (by default it is inconsistent).

3. In GitHub, go to **Settings > Pages > Build and deployment > Source > GitHub Actions** and generate `svelte.yml` by clicking pasting in the following:

   ```yml
   name: Deploy to GitHub Pages

   on:
   push:
       branches: 'main'

   jobs:
   build_site:
       runs-on: ubuntu-latest
       steps:
       - name: Checkout
           uses: actions/checkout@v4

       # If you're using pnpm, add this step then change the commands and cache key below to use `pnpm`
       # - name: Install pnpm
       #   uses: pnpm/action-setup@v3
       #   with:
       #     version: 8

       - name: Install Node.js
           uses: actions/setup-node@v4
           with:
           node-version: 20
           cache: npm

       - name: Install dependencies
           run: npm install

       - name: build
           env:
           BASE_PATH: '/${{ github.event.repository.name }}'
           run: |
           npm run build

       - name: Upload Artifacts
           uses: actions/upload-pages-artifact@v3
           with:
           # this should match the `pages` option in your adapter-static options
           path: 'build/'

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

4. Modify `svelte.config.js` to be the following so that we incorporate the base path of the repository:

   ```js
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
   };
   
   export default config;
   ```

5. Add the following options to `src/+layout.js`:

   ```js
   export const prerender = true;
   export const trailingSlash = "always";
   ```

6. Install Tailwind CSS with `npx svelte-add@latest tailwindcss`.

7. Run `yarn build` to build the application and `yarn preview` to view the deployed application locally.

## CI/CD

The repository is configured with automatic monthly updates using Dependabot and automatic build testing before each pull request. The CI/CD pipeline consists of the following workflows:

- `svelte.yml` automatically deploys the website to GitHub Pages on every push to the `main` branch.
- `pull_request.yml` runs a sanity check on every opened pull request to make sure the app still builds.
- `dependabot.yml` automatically updates versions on a monthly basis.
- `dependabot_auto_merge.yml` automatically merges pull requests by Dependabot if it passes the sanity check.

The following GitHub settings are enabled:

- **General > Allow auto-merge**
- **Branches > Branch protection > Require status checks to pass before merging (pull_request_build)**

## Useful links

- https://kit.svelte.dev/docs/adapter-static
- https://flowbite-svelte.com/docs/pages/quickstart
