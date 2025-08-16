const https = require('https');
const fs = require('fs');
const path = require('path');

const S3_BASE_URL = 'https://s3.us-east-1.amazonaws.com/assets.ericphelan.com/img';

// Create the source assets/img directory
const srcImgDir = path.join(__dirname, 'src', 'assets', 'img');
if (!fs.existsSync(srcImgDir)) {
    fs.mkdirSync(srcImgDir, { recursive: true });
}

// Create subdirectories
const subdirs = [
    'logos',
    'thumbs', 
    'flipboards',
    'flipboards/stock',
    'lassa'
];

subdirs.forEach(subdir => {
    const subdirPath = path.join(srcImgDir, subdir);
    if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
    }
});

// List of all images found in the code references
const imagesToDownload = [
    // Logos
    { path: 'logos/facebook_icon.png', url: `${S3_BASE_URL}/logos/facebook_icon.png` },
    { path: 'logos/instagram_icon.png', url: `${S3_BASE_URL}/logos/instagram_icon.png` },
    { path: 'logos/linkedin_icon.png', url: `${S3_BASE_URL}/logos/linkedin_icon.png` },
    { path: 'logos/logo.png', url: `${S3_BASE_URL}/logos/logo.png` },
    { path: 'logos/logo_black.png', url: `${S3_BASE_URL}/logos/logo_black.png` },
    { path: 'logos/bofa.png', url: `${S3_BASE_URL}/logos/bofa.png` },
    { path: 'logos/lehman_red.png', url: `${S3_BASE_URL}/logos/lehman_red.png` },
    { path: 'logos/vagabond_startup.png', url: `${S3_BASE_URL}/logos/vagabond_startup.png` },
    { path: 'logos/principly_white.png', url: `${S3_BASE_URL}/logos/principly_white.png` },
    { path: 'logos/gathered_white.png', url: `${S3_BASE_URL}/logos/gathered_white.png` },
    { path: 'logos/harvard.png', url: `${S3_BASE_URL}/logos/harvard.png` },
    { path: 'logos/broad.png', url: `${S3_BASE_URL}/logos/broad.png` },
    { path: 'logos/apple.png', url: `${S3_BASE_URL}/logos/apple.png` },
    { path: 'logos/jetblue.png', url: `${S3_BASE_URL}/logos/jetblue.png` },
    { path: 'logos/delta.png', url: `${S3_BASE_URL}/logos/delta.png` },
    { path: 'logos/american_airlines.png', url: `${S3_BASE_URL}/logos/american_airlines.png` },
    
    // Thumbnails
    { path: 'thumbs/episampler.jpg', url: `${S3_BASE_URL}/thumbs/epiSampler.jpg` },
    { path: 'thumbs/lassa.jpg', url: `${S3_BASE_URL}/thumbs/lassa.jpg` },
    { path: 'thumbs/principly.jpg', url: `${S3_BASE_URL}/thumbs/principly.jpg` },
    { path: 'thumbs/vagabondstartup.jpg', url: `${S3_BASE_URL}/thumbs/vagabondstartup.jpg` },
    { path: 'thumbs/springshot.jpg', url: `${S3_BASE_URL}/thumbs/springshot.jpg` },
    { path: 'thumbs/ipplicant.jpg', url: `${S3_BASE_URL}/thumbs/ipplicant.jpg` },
    { path: 'thumbs/glamandgo.jpg', url: `${S3_BASE_URL}/thumbs/glamandgo.jpg` },
    { path: 'thumbs/gathered.jpg', url: `${S3_BASE_URL}/thumbs/gathered.jpg` },
    
    // Flipboards
    ...Array.from({length: 23}, (_, i) => ({
        path: `flipboards/${i + 1}.jpg`,
        url: `${S3_BASE_URL}/flipboards/${i + 1}.jpg`
    })),
    
    // Flipboards stock
    ...Array.from({length: 13}, (_, i) => ({
        path: `flipboards/stock/${i + 1}.png`,
        url: `${S3_BASE_URL}/flipboards/stock/${i + 1}.png`
    })),
    
    // Lassa
    { path: 'lassa/lassa_hero.jpg', url: `${S3_BASE_URL}/lassa/lassa_hero.jpg` },
    { path: 'lassa/lassa_bg_large.jpg', url: `${S3_BASE_URL}/lassa/lassa_bg_large.jpg` },
    { path: 'lassa/lassa_bg_medium.jpg', url: `${S3_BASE_URL}/lassa/lassa_bg_medium.jpg` },
    { path: 'lassa/lassa_bg_small.jpg', url: `${S3_BASE_URL}/lassa/lassa_bg_small.jpg` },
    
    // Portraits
    { path: 'portrait_2.jpg', url: `${S3_BASE_URL}/portrait_2.jpg` },
    { path: 'portrait_3.jpg', url: `${S3_BASE_URL}/portrait_3.jpg` },
    { path: 'portrait_4.jpg', url: `${S3_BASE_URL}/portrait_4.jpg` },
    { path: 'portrait_5.jpg', url: `${S3_BASE_URL}/portrait_5.jpg` },
    
    // Home videos
    { path: 'home_video_large.jpg', url: `${S3_BASE_URL}/home_video_large.jpg` },
    { path: 'home_video_medium.jpg', url: `${S3_BASE_URL}/home_video_medium.jpg` },
    { path: 'home_video_small.jpg', url: `${S3_BASE_URL}/home_video_small.jpg` },
    
    // Work backgrounds
    { path: 'work_bkg_large.jpg', url: `${S3_BASE_URL}/work_bkg_large.jpg` },
    { path: 'work_bkg_medium.jpg', url: `${S3_BASE_URL}/work_bkg_medium.jpg` },
    { path: 'work_bkg_small.jpg', url: `${S3_BASE_URL}/work_bkg_small.jpg` },
    
    // About images
    { path: 'about_upper_left.png', url: `${S3_BASE_URL}/about_upper_left.png` },
    { path: 'about_bottom_left.jpg', url: `${S3_BASE_URL}/about_bottom_left.jpg` },
    
    // UI elements
    { path: 'pointer-right.png', url: `${S3_BASE_URL}/pointer-right.png` },
    { path: 'pointer-right-red.png', url: `${S3_BASE_URL}/pointer-right-red.png` },
    { path: 'zigzag.png', url: `${S3_BASE_URL}/zigzag.png` },
    { path: 'down-arrow-arrow.png', url: `${S3_BASE_URL}/down-arrow-arrow.png` },
    { path: 'down-arrow-arrow-dark.png', url: `${S3_BASE_URL}/down-arrow-arrow-dark.png` },
    { path: 'down-arrow-circle.png', url: `${S3_BASE_URL}/down-arrow-circle.png` },
    { path: 'right-tab-arrow.png', url: `${S3_BASE_URL}/right-tab-arrow.png` },
    { path: 'thumb_up.png', url: `${S3_BASE_URL}/thumb_up.png` },
    { path: 'thumb_down.png', url: `${S3_BASE_URL}/thumb_down.png` },
    { path: 'full-screen-icon.png', url: `${S3_BASE_URL}/full-screen-icon.png` },
    { path: 'macbook-frame.png', url: `${S3_BASE_URL}/macbook-frame.png` },
    { path: 'contact_phone.png', url: `${S3_BASE_URL}/contact_phone.png` },
    { path: 'coffee.png', url: `${S3_BASE_URL}/coffee.png` },
    { path: 'map.jpg', url: `${S3_BASE_URL}/map.jpg` },
    { path: 'loading-apple.gif', url: `${S3_BASE_URL}/loading-apple.gif` },
    { path: 'cv-download.png', url: `${S3_BASE_URL}/cv-download.png` },
    
    // Case study images
    { path: 'vagabond_home.jpg', url: `${S3_BASE_URL}/vagabond_home.jpg` },
    { path: 'principly_hero.jpg', url: `${S3_BASE_URL}/principly_hero.jpg` },
    { path: 'gathered_hero.jpg', url: `${S3_BASE_URL}/gathered_hero.jpg` },
    { path: 'springshot_hero.jpg', url: `${S3_BASE_URL}/springshot_hero.jpg` },
    { path: 'ipplicant_logo.png', url: `${S3_BASE_URL}/ipplicant_logo.png` },
    { path: 'hands_1.jpg', url: `${S3_BASE_URL}/hands_1.jpg` },
    { path: 'springshot_01.png', url: `${S3_BASE_URL}/springshot_01.png` },
    
    // Video
    { path: 'ipplicant_intro_animation.mov', url: `${S3_BASE_URL}/ipplicant_intro_animation.mov` }
];

console.log(`Starting download of ${imagesToDownload.length} images...`);

let downloadedCount = 0;
let failedCount = 0;

function downloadImage(imageInfo) {
    return new Promise((resolve) => {
        const filePath = path.join(srcImgDir, imageInfo.path);
        const fileDir = path.dirname(filePath);
        
        // Ensure directory exists
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }
        
        const file = fs.createWriteStream(filePath);
        
        https.get(imageInfo.url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    downloadedCount++;
                    console.log(`✓ Downloaded: ${imageInfo.path}`);
                    resolve();
                });
            } else {
                console.error(`✗ Failed to download ${imageInfo.path}: Status ${response.statusCode}`);
                failedCount++;
                resolve();
            }
        }).on('error', (err) => {
            console.error(`✗ Error downloading ${imageInfo.path}: ${err.message}`);
            failedCount++;
            // Clean up failed download
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            resolve();
        });
    });
}

async function downloadAllImages() {
    // Download images in batches to avoid overwhelming the server
    const batchSize = 5;
    for (let i = 0; i < imagesToDownload.length; i += batchSize) {
        const batch = imagesToDownload.slice(i, i + batchSize);
        await Promise.all(batch.map(downloadImage));
        
        // Small delay between batches
        if (i + batchSize < imagesToDownload.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }
    
    console.log('\nDownload complete!');
    console.log(`✓ Successfully downloaded: ${downloadedCount} images`);
    if (failedCount > 0) {
        console.log(`✗ Failed downloads: ${failedCount} images`);
    }
    
    if (downloadedCount > 0) {
        console.log('\nNext steps:');
        console.log('1. Run: npm run build');
        console.log('2. Start the server: npm start');
        console.log('3. Check that images are loading in the browser');
    }
}

downloadAllImages().catch(console.error); 