# 🚀 Deployment Guide

This guide will help you deploy your website to AWS S3 with optional CloudFront for HTTPS and CDN.

## 📋 Prerequisites

- AWS Account with appropriate permissions
- GitHub repository with your code
- Domain name (optional but recommended)

## 🔐 **AWS IAM Setup (Required First Step)**

### Step 1: Create IAM User for GitHub Actions
1. **Go to AWS Console** → IAM → Users → Create user
2. **User name**: `github-actions-deployer` (or your preferred name)
3. **Access type**: Programmatic access (for API keys)
4. **Click Next**

### Step 2: Attach Permissions
1. **Select policy**: "Attach existing policies directly"
2. **Search for**: `AmazonS3FullAccess` and select it
3. **If using CloudFront**: Also attach `CloudFrontFullAccess`
4. **Click Next** → **Create user**

### Step 3: Get Access Keys
1. **Select your new user** → Security credentials tab
2. **Create access key** → Application running outside AWS
3. **Copy both values**:
   - **Access key ID** (starts with `AKIA...`)
   - **Secret access key** (starts with `wJalr...`)
4. **Save these securely** - you won't see the secret key again!

### Alternative: Create Custom IAM Policy (More Secure)
If you prefer least-privilege access, create this custom policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::YOUR_BUCKET_NAME",
                "arn:aws:s3:::YOUR_BUCKET_NAME/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations"
            ],
            "Resource": "*"
        }
    ]
}
```

## 🏗️ Option 1: Manual Deployment

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Create S3 Bucket
1. Go to AWS S3 Console
2. Create a new bucket with your domain name (e.g., `ericphelan.com`)
3. **Important**: Uncheck "Block all public access" (we need public read access)
4. Enable "Static website hosting" in bucket properties

### Step 3: Configure S3 Bucket Policy
Replace `YOUR_BUCKET_NAME` with your actual bucket name:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
        }
    ]
}
```

### Step 4: Upload Files
```bash
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
```

### Step 5: Access Your Website
Your website will be available at:
`https://YOUR_BUCKET_NAME.s3-website-us-east-1.amazonaws.com`

## 🌐 Option 2: Automated GitHub Actions Deployment (Recommended)

### Step 1: Set Up GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

1. **`AWS_ACCESS_KEY_ID`** - Your AWS access key (from IAM user)
2. **`AWS_SECRET_ACCESS_KEY`** - Your AWS secret key (from IAM user)
3. **`S3_BUCKET_NAME`** - Your S3 bucket name (e.g., `ericphelan.com`)
4. **`CLOUDFRONT_DISTRIBUTION_ID`** - (Optional) CloudFront distribution ID
5. **`CLOUDFRONT_DOMAIN`** - (Optional) Your custom domain

### Step 2: Push to Master
The GitHub Action will automatically:
- Build your project
- Deploy to S3
- Invalidate CloudFront cache (if configured)

## 🔒 Option 3: CloudFront for HTTPS + Custom Domain

### Step 1: Create CloudFront Distribution
1. Go to CloudFront Console
2. Create distribution
3. **Origin**: Your S3 bucket
4. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
5. **Alternate Domain Names**: Add your custom domain
6. **SSL Certificate**: Request or import your SSL certificate

### Step 2: Configure DNS
Point your domain to the CloudFront distribution:
- **Type**: CNAME
- **Name**: @ or www
- **Value**: Your CloudFront domain (e.g., `d1234abcd.cloudfront.net`)

### Step 3: Update GitHub Secrets
Add your CloudFront details to GitHub secrets for automatic cache invalidation.

## 📁 S3 Bucket Structure
After deployment, your S3 bucket should contain:
```
ericphelan.com/
├── index.html
├── 404.html
├── cases/
├── assets/
│   ├── css/
│   ├── js/
│   └── img/
└── mixins/
```

## 🔧 Troubleshooting

### Common Issues:

1. **403 Forbidden**: Check bucket policy and public access settings
2. **404 Not Found**: Ensure index.html is in the root of your bucket
3. **Mixed Content**: Use HTTPS URLs for all external resources
4. **Caching Issues**: Invalidate CloudFront cache or add cache headers
5. **IAM Permission Errors**: Verify your IAM user has the correct policies

### Useful Commands:

```bash
# Check bucket contents
aws s3 ls s3://YOUR_BUCKET_NAME --recursive

# Test website access
curl -I https://YOUR_BUCKET_NAME.s3-website-us-east-1.amazonaws.com

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# Test AWS credentials
aws sts get-caller-identity
```

## 🎯 Next Steps

1. **Set up AWS IAM user** with proper permissions
2. **Choose your deployment method** (Manual, GitHub Actions, or CloudFront)
3. **Set up your S3 bucket** with proper permissions
4. **Configure GitHub Actions** for automated deployment
5. **Test your deployment** by visiting the S3 website URL
6. **Set up CloudFront** for HTTPS and custom domain (optional)

## 📞 Support

If you encounter issues:
1. Check AWS CloudTrail for permission errors
2. Verify S3 bucket policy and public access settings
3. Ensure all asset paths are relative (already fixed in this project)
4. Check CloudFront distribution status and error pages
5. Verify IAM user permissions and access keys

Your website is now ready for production deployment! 🎉 