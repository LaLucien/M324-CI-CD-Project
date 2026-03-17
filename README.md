# M324 CI/CD Project

This repository contains a minimal Angular SSR frontend and a complete CI/CD flow built around GitHub Actions, GitHub Container Registry, and Render. The app stays intentionally small so the main focus can remain on quality checks, container publishing, and automated deployment.

## Repository Layout

- `frontend/` - Angular SSR application
- `.github/workflows/ci-cd.yml` - CI, image publish, and deploy workflow
- `render.yaml` - Render Blueprint service definition

## Local Setup

Requirements:

- Node.js 22 or a current Node.js LTS version
- npm
- Docker Desktop for local container testing

Install dependencies:

```bash
cd frontend
npm ci
```

Run the app locally:

```bash
cd frontend
npm start
```

Run the SSR build locally:

```bash
cd frontend
npm run build
npm run serve:ssr
```

## Quality Commands

Run all local quality gates from `frontend/`:

```bash
npm run format:check
npm run lint
npm test
npm run build
```

Use this if you want to format the frontend workspace:

```bash
npm run format
```

## Docker

Build the production image from the repository root:

```bash
docker build -t m324-cicd-frontend .
```

Run the container locally:

```bash
docker run --rm -p 4000:4000 -e PORT=4000 m324-cicd-frontend
```

The container serves the Angular SSR app through the generated Node server.

## Container Registry

The workflow publishes the production image to GitHub Container Registry:

```text
ghcr.io/lalucien/m324-cicd-frontend
```

Published tags:

- `latest` on `master`
- `sha-<shortsha>` on `master` and `v*`
- `v*` on tag pushes

After the first successful publish, open the package in GitHub and change its visibility to public so Render can pull it without registry credentials.

## CI/CD Flow

The GitHub Actions workflow is split into three jobs:

1. `ci`
2. `publish_image`
3. `deploy`

Behavior:

- pull requests to `master` run `ci` only
- pushes to `master` run `ci`, publish the GHCR image, and trigger Render deployment
- pushes of tags matching `v*` run `ci`, publish `latest` plus the version tag, and trigger Render deployment

## Render Setup

Render is managed from the root `render.yaml` Blueprint file.

One-time setup:

1. In Render, create a new Blueprint from this repository.
2. Confirm the web service uses the image `ghcr.io/lalucien/m324-cicd-frontend:latest`.
3. Keep the region set to Frankfurt and the plan set to Free.
4. After the service is created, generate a deploy hook from the Render service settings.
5. Add that hook URL as the GitHub repository secret `RENDER_DEPLOY_HOOK_URL`.

The workflow then triggers Render automatically after each successful image publish.

## GitHub Configuration

Required repository secret:

- `RENDER_DEPLOY_HOOK_URL`

No extra registry secret is required because GitHub Actions publishes to GHCR using `GITHUB_TOKEN`.

## Public Deployment URL

Render deployment URL: [https://m324-cicd-frontend.onrender.com/](https://m324-cicd-frontend.onrender.com/)
