# 🚀 Quick Deployment Checklist

## 🔐 **Step 1: AWS IAM Setup (Required)**

### Create IAM User for GitHub Actions
1. **AWS Console** → IAM → Users → Create user
2. **Name**: `github-actions-deployer`
3. **Access type**: Programmatic access
4. **Attach policy**: `AmazonS3FullAccess`
5. **Create access key** → Copy both values:
   - Access key ID (starts with `AKIA...`)
   - Secret access key (starts with `wJalr...`)

## 🎯 **Step 2: Choose Deployment Method:**

### Option A: GitHub Actions (Recommended - Automated)
1. **Push your code to GitHub** (if not already there)
2. **Set up GitHub Secrets** (see DEPLOYMENT.md for details)
3. **Push to master branch** → Automatic deployment!

### Option B: Manual Deployment
1. **Run the deployment script:**
   ```bash
   ./aws-deploy.sh
   ```
2. **Follow the prompts** to enter your S3 bucket name

### Option C: Manual AWS Console
1. **Build:** `npm run build`
2. **Upload:** Drag `dist/` folder contents to S3 bucket
3. **Configure:** Set bucket policy for public access

## 🔑 **Step 3: AWS S3 Setup:**

### 1. Create S3 Bucket
- Name: `ericphelan.com` (or your preferred name)
- Region: `us-east-1`
- **Uncheck** "Block all public access"
- Enable "Static website hosting"

### 2. Set Bucket Policy
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

### 3. Configure Website Hosting
- Index document: `index.html`
- Error document: `404.html`

## 🌐 **Access Your Website:**

After deployment, your site will be available at:
- **S3 URL:** `http://YOUR_BUCKET_NAME.s3-website-us-east-1.amazonaws.com`
- **Custom Domain:** `https://ericphelan.com` (if you set up CloudFront)

## ⚡ **GitHub Actions Setup (5 minutes):**

1. **Go to your repo** → Settings → Secrets and variables → Actions
2. **Add these secrets:**
   - `AWS_ACCESS_KEY_ID` - Your AWS access key (from IAM user)
   - `AWS_SECRET_ACCESS_KEY` - Your AWS secret key (from IAM user)
   - `S3_BUCKET_NAME` - Your S3 bucket name
3. **Push to master** → Automatic deployment!

## 🔧 **Troubleshooting:**

- **403 Error:** Check bucket policy and public access settings
- **404 Error:** Ensure `index.html` is in bucket root
- **Assets not loading:** Verify all files uploaded with correct structure
- **IAM Permission Errors:** Verify your IAM user has correct policies

## 📞 **Need Help?**

- Check `DEPLOYMENT.md` for detailed instructions
- Run `./aws-deploy.sh` for guided deployment
- Verify your S3 bucket permissions and policy
- Test AWS credentials: `aws sts get-caller-identity`

**Your website is ready to deploy! 🎉** 