const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Syncing entire S3 image directory...');

const S3_BUCKET_URL = 's3://assets.ericphelan.com/img';
const LOCAL_IMG_DIR = path.join(__dirname, 'src', 'assets', 'img');

// Ensure local directory exists
if (!fs.existsSync(LOCAL_IMG_DIR)) {
    fs.mkdirSync(LOCAL_IMG_DIR, { recursive: true });
    console.log('✓ Created local images directory');
}

// Check if AWS CLI is available
function checkAWSCLI() {
    try {
        execSync('aws --version', { stdio: 'pipe' });
        return true;
    } catch (error) {
        return false;
    }
}

// Sync using AWS CLI (most reliable method)
function syncWithAWSCLI() {
    console.log('📥 Using AWS CLI to sync images...');
    
    try {
        // Use AWS CLI to sync the entire directory
        execSync(`aws s3 sync ${S3_BUCKET_URL} ${LOCAL_IMG_DIR}`, { 
            stdio: 'inherit',
            cwd: __dirname
        });
        
        console.log('✅ AWS CLI sync completed successfully!');
        return true;
    } catch (error) {
        console.error('❌ AWS CLI sync failed:', error.message);
        return false;
    }
}

// Parse S3 directory listing and download files
function parseAndDownload(htmlData) {
    console.log('🔍 Parsing S3 directory listing...');
    
    // Extract file paths from S3 listing
    const fileMatches = htmlData.match(/<Key>([^<]+)<\/Key>/g);
    if (!fileMatches) {
        console.log('⚠️ No files found in directory listing, using fallback method');
        downloadKnownFiles();
        return;
    }
    
    const files = fileMatches
        .map(match => match.replace(/<Key>([^<]+)<\/Key>/, '$1'))
        .filter(file => !file.endsWith('/')) // Remove directories
        .map(file => file.replace(/^[^\/]+\//, '')); // Remove prefix
    
    console.log(`📁 Found ${files.length} files in S3 directory`);
    
    if (files.length === 0) {
        console.log('⚠️ No files found, using fallback method');
        downloadKnownFiles();
        return;
    }
    
    // Download all discovered files
    downloadDiscoveredFiles(files);
}

// Download files discovered from S3 listing
function downloadDiscoveredFiles(files) {
    console.log('📥 Downloading discovered files...');
    
    let downloadedCount = 0;
    let failedCount = 0;
    
    files.forEach((filePath, index) => {
        const url = `https://s3.us-east-1.amazonaws.com/assets.ericphelan.com/img/${filePath}`;
        const localPath = path.join(LOCAL_IMG_DIR, filePath);
        
        // Ensure directory exists
        const dir = path.dirname(localPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Download file
        setTimeout(() => {
            downloadFile(url, localPath, filePath, () => {
                downloadedCount++;
                if (downloadedCount + failedCount === files.length) {
                    console.log(`\n📊 Download Summary:`);
                    console.log(`✅ Downloaded: ${downloadedCount}`);
                    console.log(`❌ Failed: ${failedCount}`);
                    console.log(`📁 Total: ${files.length}`);
                }
            });
        }, index * 100); // Stagger downloads
    });
}

// Alternative: Use curl to get directory listing and download files
function downloadWithCurl() {
    console.log('📥 Using curl to discover and download images...');
    
    const https = require('https');
    
    // Try to get a directory listing (this might not work with S3)
    const url = 'https://s3.us-east-1.amazonaws.com/assets.ericphelan.com/img/';
    
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => {
                console.log('📋 Directory listing received, parsing...');
                parseAndDownload(data);
            });
        } else {
            console.log('⚠️ Directory listing not available, trying alternative method...');
            downloadKnownFiles();
        }
    }).on('error', (err) => {
        console.log('⚠️ Directory listing failed, trying alternative method...');
        downloadKnownFiles();
    });
}

// Download a comprehensive list of known files
function downloadKnownFiles() {
    console.log('📥 Downloading comprehensive list of known images...');
    
    const https = require('https');
    const knownFiles = [
        // Logos
        'logos/facebook_icon.png', 'logos/instagram_icon.png', 'logos/linkedin_icon.png',
        'logos/logo.png', 'logos/logo_black.png', 'logos/bofa.png', 'logos/lehman_red.png',
        'logos/vagabond_startup.png', 'logos/principly_white.png', 'logos/gathered_white.png',
        'logos/harvard.png', 'logos/broad.png', 'logos/apple.png', 'logos/jetblue.png',
        'logos/delta.png', 'logos/american_airlines.png',
        
        // Thumbnails
        'thumbs/epiSampler.jpg', 'thumbs/lassa.jpg', 'thumbs/principly.jpg',
        'thumbs/vagabondstartup.jpg', 'thumbs/springshot.jpg', 'thumbs/ipplicant.jpg',
        'thumbs/glamandgo.jpg', 'thumbs/gathered.jpg',
        
        // Flipboards
        'flipboards/1.jpg', 'flipboards/2.jpg', 'flipboards/3.jpg',
        'flipboards/stock/1.png', 'flipboards/stock/2.png',
        
        // Main images
        'portrait_2.jpg', 'portrait_3.jpg', 'home_video_large.jpg', 'work_bkg_large.jpg',
        'pointer-right.png', 'down-arrow-arrow.png', 'thumb_up.png', 'full-screen-icon.png',
        'principly_hero.jpg', 'springshot_hero.jpg', 'gathered_hero.jpg',
        
        // Additional images that might exist
        'about_bottom_left.jpg', 'about_upper_left.png', 'home_video_medium.jpg',
        'home_video_small.jpg', 'ipplicant_intro_animation.mov', 'ipplicant_logo.png',
        'coffee.png', 'contact_phone.png', 'cv-download.png', 'down-arrow-arrow-dark.png',
        'down-arrow-circle.png', 'hands_1.jpg', 'loading-apple.gif', 'email.svg', 'phone.svg'
    ];
    
    let downloadedCount = 0;
    let failedCount = 0;
    
    knownFiles.forEach((filePath, index) => {
        const url = `https://s3.us-east-1.amazonaws.com/assets.ericphelan.com/img/${filePath}`;
        const localPath = path.join(LOCAL_IMG_DIR, filePath);
        
        // Ensure directory exists
        const dir = path.dirname(localPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        // Download file
        setTimeout(() => {
            downloadFile(url, localPath, filePath, () => {
                downloadedCount++;
                if (downloadedCount + failedCount === knownFiles.length) {
                    console.log(`\n📊 Download Summary:`);
                    console.log(`✅ Downloaded: ${downloadedCount}`);
                    console.log(`❌ Failed: ${failedCount}`);
                    console.log(`📁 Total: ${knownFiles.length}`);
                }
            });
        }, index * 100); // Stagger downloads
    });
}

function downloadFile(url, localPath, fileName, callback) {
    const https = require('https');
    const file = fs.createWriteStream(localPath);
    
    https.get(url, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ ${fileName}`);
                callback();
            });
        } else {
            console.log(`❌ ${fileName} - Status ${response.statusCode}`);
            fs.unlink(localPath, () => {});
            callback();
        }
    }).on('error', (err) => {
        console.log(`❌ ${fileName} - Error: ${err.message}`);
        fs.unlink(localPath, () => {});
        callback();
    });
}

// Main execution
async function main() {
    console.log('🔍 Checking available methods...');
    
    if (checkAWSCLI()) {
        console.log('✅ AWS CLI found - using most reliable method');
        if (syncWithAWSCLI()) {
            console.log('🎉 Image sync completed successfully!');
            return;
        }
    }
    
    console.log('⚠️ AWS CLI not available or failed - using alternative method');
    downloadWithCurl();
}

main().catch(console.error); 