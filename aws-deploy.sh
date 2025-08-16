#!/bin/bash

# 🚀 AWS S3 Deployment Script
# This script builds and deploys your website to S3

set -e  # Exit on any error

# Configuration
BUCKET_NAME=""
AWS_REGION="us-east-1"
CLOUDFRONT_DISTRIBUTION_ID=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first:"
        echo "  https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
}

# Check if user is authenticated with AWS
check_aws_auth() {
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "You are not authenticated with AWS. Please run:"
        echo "  aws configure"
        exit 1
    fi
}

# Get bucket name from user
get_bucket_name() {
    if [ -z "$BUCKET_NAME" ]; then
        echo -n "Enter your S3 bucket name: "
        read BUCKET_NAME
        if [ -z "$BUCKET_NAME" ]; then
            print_error "Bucket name cannot be empty"
            exit 1
        fi
    fi
}

# Build the project
build_project() {
    print_status "Building project..."
    npm run build
    print_success "Build completed successfully!"
}

# Deploy to S3
deploy_to_s3() {
    print_status "Deploying to S3 bucket: $BUCKET_NAME"
    
    # Check if bucket exists
    if ! aws s3 ls "s3://$BUCKET_NAME" &> /dev/null; then
        print_error "Bucket $BUCKET_NAME does not exist or you don't have access"
        print_status "Please create the bucket first or check your permissions"
        exit 1
    fi
    
    # Sync files to S3
    aws s3 sync dist/ "s3://$BUCKET_NAME" --delete --cache-control "max-age=31536000,public"
    print_success "Files uploaded to S3 successfully!"
}

# Invalidate CloudFront cache
invalidate_cloudfront() {
    if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        print_status "Invalidating CloudFront cache..."
        aws cloudfront create-invalidation \
            --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
            --paths "/*"
        print_success "CloudFront cache invalidated!"
    else
        echo -n "Do you have a CloudFront distribution? (y/n): "
        read has_cloudfront
        if [[ $has_cloudfront =~ ^[Yy]$ ]]; then
            echo -n "Enter your CloudFront distribution ID: "
            read CLOUDFRONT_DISTRIBUTION_ID
            if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
                print_status "Invalidating CloudFront cache..."
                aws cloudfront create-invalidation \
                    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
                    --paths "/*"
                print_success "CloudFront cache invalidated!"
            fi
        fi
    fi
}

# Show deployment info
show_deployment_info() {
    print_success "Deployment completed successfully!"
    echo ""
    echo "🌐 Your website is now available at:"
    echo "   S3: http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com"
    
    if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        echo "   CloudFront: https://$CLOUDFRONT_DISTRIBUTION_ID.cloudfront.net"
    fi
    
    echo ""
    echo "📁 Files deployed:"
    aws s3 ls "s3://$BUCKET_NAME" --recursive --human-readable --summarize | tail -1
}

# Main deployment flow
main() {
    echo "🚀 Starting deployment process..."
    echo ""
    
    check_aws_cli
    check_aws_auth
    get_bucket_name
    build_project
    deploy_to_s3
    invalidate_cloudfront
    show_deployment_info
}

# Run main function
main "$@" 