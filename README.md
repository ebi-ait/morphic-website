# Morphic Website

This repository hosts the **Morphic** public website built with [Gatsby](https://www.gatsbyjs.com/) a React‑based front‑end that is containerised with Docker and deployed to AWS EKS via GitHub Actions.

## Table of Contents

- [Branch strategy](#branch-strategy)
- [Repository layout](#repository-layout)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Docker & Kubernetes deployment](#docker--kubernetes-deployment)

## Branch strategy
| Branch | Purpose |
|--------|---------|
| **main** | Source of truth. Has a manual trigger when triggered, builds and deploys the `main` branch. |
| **dev** | Development beanch and environment that points to [dev.morphic.bio](https://dev.morphic.bio). Every push triggers a CI job that builds and deploys the latest Docker image to the live EKS cluster. |

> **Note:** Feature work is done in short‑lived branches and merged into `dev` through pull requests.
Once tested and when stakeholders are happy, changes are cherry-picked onto `main` and deployed.

The website is accessible at [morphic.bio](https://morphic.bio).

## Repository layout
```
morphic-website/
├─ react-app/          # Main React codebase
├─ k8s/                # Kubernetes manifests (Deployment, Service, Ingress, etc.)
├─ .github/workflows/  # CI/CD definitions (build & deploy)
├─ Dockerfile          # Builds the production image for the website
└─ README.md           # You are here 😊
```

## Technologies Used

| Layer            | Technology      |
|------------------|-----------------|
| Front‑end        | React (Create‑React‑App) |
| Runtime          | Docker |
| Orchestration    | Kubernetes on AWS EKS |
| CI/CD            | GitHub Actions |
| Data source      | Ingest API (`https://api.ingest.archive.morphic.bio`) |

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js** (>=18.13.x) and **npm** (Node Package Manager)
- **Gatsby CLI**: Install globally using `npm install -g gatsby-cli`
- **AWS CLI**: For interacting with AWS services from the command line
- **AWS Account**: With S3 and CloudFront configured
- **Git**: For version control

### AWS Configuration

Ensure that you have the following AWS resources set up:

- An S3 bucket configured to host a static website.
- A CloudFront distribution configured with the S3 bucket as the origin.
- An IAM user with sufficient permissions to upload files to S3 and manage CloudFront.

## Local development
```bash
# 1. Clone
git clone https://github.com/ebi-ait/morphic-website.git
cd morphic-website

# 2. Install dependencies
cd react-app
npm install    # or yarn install

# 3. Run the dev server
npm start      # http://localhost:3000
```

## Docker & Kubernetes deployment

1. **Image build**
   The root `Dockerfile` builds the production bundle from `react-app/`.

2. **CI/CD (GitHub Actions)**
   - On every push to `dev` the workflow:
     1. Builds and tags a Docker image.
     2. Pushes the image to the container registry.
     3. Applies manifests under `k8s/` to the EKS cluster (via `kubectl apply`).

3. **Kubernetes manifests**
   - `k8s/deployment.yaml` – Deployment & rolling updates.
   - `k8s/service.yaml` – ClusterIP / LoadBalancer.
   - `k8s/ingress.yaml` – External URL and TLS (if configured).