# Assignment Analysis: Complete CI/CD Pipeline

## Source Summary

The assignment requires a complete CI/CD pipeline for the project. In the assignment wording this happens on every merge or push to `main`. For this repository, `master` can be treated as the equivalent target branch.

1. CI runs:
   - linting
   - formatting check
   - tests
2. Build and publish runs:
   - build a Docker image
   - push the image to a container registry
3. CD runs:
   - trigger an automated cloud deployment
   - make the app available on a publicly accessible website

The cloud provider is freely selectable.

## Clarified Project Decisions

Based on the current team decisions, the planning baseline is now:

- `master` is acceptable as the main working and deployment branch for this repository.
- GitHub Actions is the preferred CI/CD platform.
- GitHub Container Registry (GHCR) is approved by the teacher and will be used for image publishing.
- Render is the preferred deployment target, provided its current free offering is sufficient.
- A minimal application is acceptable because the focus is on the pipeline.
- Deployment should support both:
  - branch-based releases from `master`
  - version-tag-based releases such as `v*`
- The repository structure may be changed later if it improves clarity or delivery.
- Additional pipeline features are welcome later, but are not required for the first basic setup.

## Mandatory Acceptance Criteria

- The pipeline must have at least two stages or jobs:
  - CI
  - deploy
  - or equivalent separate jobs in the workflow
- Deployment must run only if CI succeeds.
- Deployment must run only for the main release branch.
  - In the assignment wording this is `main`.
  - In this repository, `master` is acceptable.
  - Tag-based deployment for `v*` should also be supported.
- The Docker image must be published to a registry.
- GHCR is explicitly acceptable for this project based on teacher confirmation.
- At minimum, the Docker tag `latest` must be pushed.
- Deployment must be automated.
  - Manual deployment is explicitly not enough.
  - Acceptable automation examples mentioned in the assignment:
    - deploy hook
    - webhook
    - CLI-based deployment
- The main `README.md` must contain the URL of the publicly available website.
- Additional features are optional.
- The focus is on the pipeline, not on building a complex app.

## Important Implications

The assignment is not just asking for CI. It expects a full path from source code to a running public service.

This means the final solution will need all of the following:

- a working application that can be built and run in production
- automated quality checks
- a Docker build strategy
- container registry authentication and publishing
- a cloud deployment target
- deployment automation triggered by GitHub events
- documentation of the public URL

## Current Repository State

### What already exists

- A Git repository with GitHub Actions enabled through `.github/workflows`.
- An Angular application in the subfolder `frontend/`.
- Basic npm scripts in `frontend/package.json` for:
  - `start`
  - `build`
  - `test`
  - `format`
  - `format:check`
- Prettier is installed and configured in `frontend/`.
- The Angular app includes SSR-related setup, so it can likely be containerized and run as a Node process.

### What is currently missing or incomplete

- No lint setup is present yet.
  - The assignment explicitly requires linting.
  - Angular 21 does not include ESLint by default, so this will need to be added deliberately.
- No Dockerfile is present.
- No Docker publishing setup is present.
- No deployment target is configured.
- The root `README.md` does not yet include the required public URL.
- The existing workflow in `.github/workflows/test.yml` does not satisfy the assignment.

## Existing Workflow Analysis

The current workflow is a useful starting point, but it does not match the assignment yet.

### Current behavior

- Runs on:
  - every `push`
  - `pull_request` to `master`
- Uses a Node version matrix
- Runs:
  - `npm ci`
  - `npm test`

### Problems relative to the assignment

- It runs from the repository root, but the Angular app lives in `frontend/`.
- It does not run linting.
- It does not run formatting checks.
- It does not build or publish a Docker image.
- It does not deploy anything.
- It does not enforce a CI-success-before-deploy dependency.
- It is named and structured like a test workflow, not a complete delivery pipeline.

## Likely Deliverables We Will Need

- A CI workflow or multi-job workflow in GitHub Actions
- Lint tooling and lint scripts
- A production-ready Dockerfile
- container registry publishing configuration
- Secrets configuration for credentials and deployment
- Automated deployment integration with a cloud provider
- A cleaned-up root `README.md` with:
  - project purpose
  - pipeline overview
  - public deployment URL
  - possibly setup notes for graders

## Recommended High-Level Pipeline Shape

This is planning only, not implementation.

### Job 1: CI

Purpose:

- install dependencies
- run formatting check
- run lint
- run tests

Possible commands from `frontend/`:

- `npm ci`
- `npm run format:check`
- `npm run lint`
- `npm test`

### Job 2: Build and Publish Image

Purpose:

- build the Docker image
- push it to GHCR

Suggested tags:

- `latest`
- commit SHA tag for traceability
- optionally version tag when building from `v*`

This job should depend on CI success.

### Job 3: Deploy

Purpose:

- trigger automated cloud deployment after a successful publish

This job should:

- only run on `master` or `v*`
- depend on the CI and image publish job
- update the live app automatically

## Deployment Strategy Decision

The preferred provider is now Render.

Why this fits the assignment well:

- it supports public web services
- it works well with Docker-based deployments
- it supports automated deployment flows
- it is simpler than more infrastructure-heavy alternatives

### Render free-tier note

As of March 17, 2026, Render's official documentation still describes free web services, with limitations, under its "Deploy for Free" documentation:

- https://render.com/docs/free

This makes Render a reasonable first choice for the assignment. However, the exact limits should still be checked again at implementation time so we do not depend on outdated pricing assumptions.

## App Scope Recommendation

The assignment explicitly says to focus on the pipeline, not the app.

That suggests the app should remain intentionally simple:

- one page
- clearly deployable
- maybe a title and basic content only

We should avoid spending too much time on frontend complexity unless the team wants small improvements for presentation value.

## Risks and Ambiguities

### 1. Branch naming mismatch

The assignment says `main`, while this repository can proceed with `master`.

This is no longer a blocker, but the final workflow should be explicit and consistent so there is no ambiguity during grading.

### 2. Container registry ownership

We will need:

- GitHub owner or organization name
- GHCR package visibility set to public
- image naming convention

Without this, publishing cannot be completed.

### 3. Cloud provider credentials and access

Render is the preferred provider, but we still need the actual account access and deployment-hook setup details.

### 4. Deployment method expectations

The assignment allows webhook, deploy hook, or CLI. That gives flexibility, but we should choose one method early so the workflow design stays simple.

For Render, a deploy hook is likely the cleanest first implementation.

### 5. Root vs subfolder project structure

The app currently lives in `frontend/`, not in the repository root.

That is not inherently a problem, but all workflows, Docker context decisions, and README instructions must account for it.

### 6. Linting tool choice

The assignment only says "linting", not which linter. For Angular, ESLint is the natural choice.

### 7. Release/tagging scope

Deployment should support both branch-based and tag-based triggers.

Automated tag creation through GitHub Actions is a good future extension, but it is not required for the basic delivery.

## Proposed Next Steps

These are the next steps I would take after we clarify the open questions.

1. Confirm the deployment target and credentials strategy.
2. Confirm the exact release trigger rules for `master` and `v*`.
3. Add linting to the Angular app.
4. Standardize npm scripts so CI can call them cleanly.
5. Create a Dockerfile for the Angular app runtime.
6. Replace the current GitHub Actions workflow with a multi-job CI/CD workflow.
7. Add GHCR publish logic in GitHub Actions.
8. Add automated deployment logic.
9. Update the root `README.md` with the public URL and delivery notes.
10. Consider optional later enhancements such as markdown linting or automated tagging.
11. Validate the full flow from push to live deployment.

## Questions To Clarify Before Implementation

1. Do you want to keep the Angular app inside the `frontend/` subfolder for now, or should we rename or move it before implementation?
2. Do you want the first basic version to deploy on every push to `master` and every `v*` tag, or should tags be reserved for a later release flow?
3. Do you want optional extras like markdown linting included in the first implementation pass, or should we keep the first pass strictly minimal?
4. Once you have the Render deploy hook, do you also expect me to prepare the exact GitHub secret names and setup notes in the documentation?

## Working Assumption For Now

Until clarified, the most practical assumption is:

- keep Angular in `frontend/` for the first pass unless renaming improves clarity
- use GitHub Actions
- add ESLint
- build and publish a Docker image to GHCR
- deploy automatically to Render
- support releases from `master` and `v*`
- keep the app intentionally minimal
- document the public URL in the root `README.md`
- leave optional extras such as markdown linting and automated tagging for a later enhancement pass

No implementation has been done here beyond documenting and analyzing the assignment.
