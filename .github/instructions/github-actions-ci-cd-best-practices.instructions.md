---
applyTo: '.github/workflows/*.yml,.github/workflows/*.yaml'
description: 'Comprehensive guide for building robust, secure, and efficient CI/CD pipelines using GitHub Actions.'
---

# GitHub Actions CI/CD Best Practices

## Core Concepts and Structure

### 1. Workflow Structure
- Use consistent, descriptive names for workflow files
- Understand triggers: `push`, `pull_request`, `workflow_dispatch`, `schedule`, `workflow_call`
- Use `concurrency` to prevent simultaneous runs
- Define `permissions` at workflow level for secure defaults

### 2. Jobs
- Jobs should represent distinct phases (build, test, deploy, lint)
- Use `needs` to define dependencies between jobs
- Use `outputs` to pass data between jobs
- Use `if` conditions for conditional execution

### 3. Steps and Actions
- Pin actions to full commit SHA or major version tag (e.g., `@v4`)
- Use descriptive `name` for each step
- Never hardcode sensitive data in `env`

## Security

### Secret Management
- Use GitHub Secrets for sensitive information
- Use environment-specific secrets for deployment environments
- Never construct secrets dynamically or print them to logs

### OIDC for Cloud Authentication
- Use OIDC for secure, credential-less authentication with cloud providers
- Eliminates need for long-lived static credentials

### Least Privilege for GITHUB_TOKEN
- Start with `contents: read` as default
- Add write permissions only when strictly necessary
- Set `permissions` at workflow or job level

## Optimization

### Caching
- Use `actions/cache` for dependencies and build outputs
- Design cache keys using `hashFiles` for optimal hit rates
- Use `restore-keys` for fallbacks

### Fast Checkout
- Use `fetch-depth: 1` for most build and test jobs
- Only use `fetch-depth: 0` when full Git history is required

### Artifacts
- Use `actions/upload-artifact` and `actions/download-artifact` for inter-job data
- Set appropriate `retention-days`

## Testing
- Run unit tests early in pipeline on every push/PR
- Run integration tests after unit tests
- Collect and publish test reports as artifacts

## Deployment
- Use GitHub `environment` rules with protections
- Implement rollback strategies
- Run post-deployment health checks
