const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');

console.log('Building minified JavaScript files...');

// Ensure dist directories exist
const distJsDir = path.join(__dirname, 'dist', 'assets', 'js');
const distJsLibDir = path.join(distJsDir, 'lib');
const distImgDir = path.join(__dirname, 'dist', 'assets', 'img');

if (!fs.existsSync(distJsDir)) {
    fs.mkdirSync(distJsDir, { recursive: true });
}
if (!fs.existsSync(distJsLibDir)) {
    fs.mkdirSync(distJsLibDir, { recursive: true });
}
if (!fs.existsSync(distImgDir)) {
    fs.mkdirSync(distImgDir, { recursive: true });
}

// Create subdirectories for images
const imgSubdirs = [
    'logos', 'thumbs', 'flipboards', 'flipboards/stock', 'lassa'
];
imgSubdirs.forEach(subdir => {
    const subdirPath = path.join(distImgDir, subdir);
    if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
    }
});

// Download jQuery if it doesn't exist
const jqueryPath = path.join(distJsLibDir, 'jquery-3.2.1.min.js');
if (!fs.existsSync(jqueryPath)) {
    console.log('Downloading jQuery 3.2.1...');
    const jqueryUrl = 'https://code.jquery.com/jquery-3.2.1.min.js';
    const file = fs.createWriteStream(jqueryPath);
    https.get(jqueryUrl, (response) => {
        if (response.statusCode === 200) {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log('✓ jQuery downloaded successfully');
            });
        } else {
            console.error('✗ Failed to download jQuery. Status:', response.statusCode);
        }
    }).on('error', (err) => {
        console.error('✗ Error downloading jQuery:', err.message);
        fs.unlink(jqueryPath, () => {});
    });
} else {
    console.log('✓ jQuery already exists');
}

// Function to process CodeKit concatenation files
function processCodeKitFile(filePath) {
    if (!fs.existsSync(filePath)) return '';
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let concatenatedContent = '';
    lines.forEach(line => {
        const match = line.match(/\/\/ @codekit-append "([^"]+)"/);
        if (match) {
            const appendPath = path.join(path.dirname(filePath), match[1]);
            if (fs.existsSync(appendPath)) {
                concatenatedContent += fs.readFileSync(appendPath, 'utf8') + '\n';
            } else {
                console.warn(`⚠ File not found: ${appendPath}`);
            }
        }
    });
    return concatenatedContent;
}

// Process concatenation files first
console.log('Processing CodeKit concatenation files...');
const scenesContent = processCodeKitFile(path.join(__dirname, 'src', 'assets', 'js', 'scenes.js'));
if (scenesContent) {
    fs.writeFileSync(path.join(__dirname, 'src', 'assets', 'js', 'scenes-concatenated.js'), scenesContent);
    console.log('✓ Created scenes-concatenated.js');
}
const pluginsContent = processCodeKitFile(path.join(__dirname, 'src', 'assets', 'js', 'plugins.js'));
if (pluginsContent) {
    fs.writeFileSync(path.join(__dirname, 'src', 'assets', 'js', 'plugins-concatenated.js'), pluginsContent);
    console.log('✓ Created plugins-concatenated.js');
}
const libsContent = processCodeKitFile(path.join(__dirname, 'src', 'assets', 'js', 'libs.js'));
if (libsContent) {
    fs.writeFileSync(path.join(__dirname, 'src', 'assets', 'js', 'libs-concatenated.js'), libsContent);
    console.log('✓ Created libs-concatenated.js');
}

// Build main JS files (using concatenated versions where available)
const mainJsFiles = [
    { src: 'pageLoad.js', dest: 'pageLoad-min.js' },
    { src: 'eric.js', dest: 'eric-min.js' },
    { src: 'libs-concatenated.js', dest: 'libs-min.js' },
    { src: 'plugins-concatenated.js', dest: 'plugins-min.js' },
    { src: 'scenes-concatenated.js', dest: 'scenes-min.js' }
];

mainJsFiles.forEach(({ src, dest }) => {
    const srcPath = path.join(__dirname, 'src', 'assets', 'js', src);
    const destPath = path.join(distJsDir, dest);
    if (fs.existsSync(srcPath)) {
        try {
            execSync(`npx terser "${srcPath}" -o "${destPath}" -c -m --source-map`, { stdio: 'inherit' });
            console.log(`✓ Built ${destPath}`);
        } catch (error) {
            console.error(`✗ Failed to build ${destPath}:`, error.message);
        }
    } else {
        console.warn(`⚠ Source file not found: ${srcPath}`);
    }
});

// Build lib JS files
const libJsFiles = [
    'caseStudy.js', 'caseLoadingFunctions.js', 'caseScroll.js', 'cases.js', 'cvDisplay.js',
    'dataTextIO.js', 'fingerprint2.js', 'flipBoard.js', 'flipSquare.js', 'floatingHero.js',
    'glitch.js', 'menu.js', 'peekABooTwo.js', 'photoMorph.js', 'scrollHint.js',
    'scrollPlayer.js', 'shootingStar.js', 'siteTracking.js', 'speedBoost.js',
    'terminalTypeout.js', 'unfoldingCards.js', 'bloomingSkills.js'
];

libJsFiles.forEach(file => {
    const srcPath = path.join(__dirname, 'src', 'assets', 'js', 'lib', file);
    const destPath = path.join(distJsLibDir, file.replace('.js', '-min.js'));
    if (fs.existsSync(srcPath)) {
        try {
            execSync(`npx terser "${srcPath}" -o "${destPath}" -c -m --source-map`, { stdio: 'inherit' });
            console.log(`✓ Built ${destPath}`);
        } catch (error) {
            console.error(`✗ Failed to build ${destPath}:`, error.message);
        }
    }
});

// Clean up temporary concatenated files
['scenes-concatenated.js', 'plugins-concatenated.js', 'libs-concatenated.js'].forEach(file => {
    const tempPath = path.join(__dirname, 'src', 'assets', 'js', file);
    if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
    }
});

console.log('JavaScript build complete!');
console.log('⚠ Image assets are missing. You need to provide the assets/img/ directory with all required images.');
console.log('   Expected structure: dist/assets/img/{logos,thumbs,flipboards,etc.}'); 