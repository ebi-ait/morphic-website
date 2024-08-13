# Gatsby Static Website Deployment to AWS S3 with CloudFront

This repository contains the source code and deployment scripts for a static website built with [Gatsby](https://www.gatsbyjs.com/) and deployed to AWS S3 using CloudFront for content delivery.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Building the Project](#building-the-project)
- [Deployment](#deployment)
- [Accessing the Website](#accessing-the-website)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project is a static website built using Gatsby, a React-based framework for creating fast and modern websites. The website is hosted on AWS S3, with AWS CloudFront used as a CDN (Content Delivery Network) to deliver the content quickly and securely to users around the globe.

The website is accessible at [morphic.bio](https://morphic.bio).

## Technologies Used

- **Gatsby**: React-based open-source framework for creating websites and apps.
- **AWS S3**: Simple Storage Service used to host the static files of the website.
- **AWS CloudFront**: Content Delivery Network to distribute content globally with low latency.
- **GitHub Actions** (optional): For Continuous Deployment (CD) of the website.

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

## Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ebi-ait/morphic-website.git
    cd morphic-website
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

## Building the Project

To build the Gatsby site for production:

```bash
gatsby build
```
This command will generate the static files in the public directory.
Deployment

To deploy the site to AWS S3 and invalidate the CloudFront cache:

    Deploy to S3:

    You can use the AWS CLI or any S3 deployment tool. Here’s an example using the AWS CLI:

```bash
aws s3 sync ./public s3://your-s3-bucket-name --delete
```

Invalidate CloudFront Cache:

After deploying the changes to S3, invalidate the CloudFront cache to ensure the changes are reflected immediately:

```bash

    aws cloudfront create-invalidation --distribution-id your-distribution-id --paths "/*"
```
Accessing the Website

Once the deployment is complete, your website will be available at https://morphic.bio
Contributing

If you would like to contribute to this project, please follow these steps:

    1. Fork the repository.
    2. Create a new branch (git checkout -b feature-branch-name).
    3. Make your changes and commit them (git commit -m 'Add some feature').
    4. Push to the branch (git push origin feature-branch-name).
    5. Open a Pull Request.
