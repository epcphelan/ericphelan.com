# ericphelan.com

Personal Website for Eric Phelan - Full-Stack Developer, Problem Solver and Entrepreneur

## Local Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Quick Start
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:80` (or the port specified in `config.json`)

### Development Commands
- `npm run build` - Build the project once (compiles Pug, SCSS, and minifies JavaScript)
- `npm run build:js` - Build only JavaScript files (minification and concatenation)
- `npm run build:watch` - Build and watch for changes
- `npm start` - Start the Express server
- `npm run dev` - Build and start the server

### Project Structure
```
├── src/                    # Source files
│   ├── assets/            # Assets (SCSS, JS, images)
│   ├── cases/             # Case study templates
│   ├── mixins/            # Reusable template components
│   └── *.pug              # Main page templates (converted from .jade)
├── dist/                   # Compiled output (created by build)
├── app.js                  # Express server
├── config.json            # Configuration
├── build-js.js            # JavaScript build script
└── package.json           # Dependencies and scripts
```

## Build Process

### What Gets Built
1. **Pug Templates** → HTML files
2. **SCSS Files** → Minified CSS
3. **JavaScript Files** → Minified and concatenated JS files
4. **jQuery** → Automatically downloaded and included

### JavaScript Build Details
The build process handles CodeKit-style concatenation directives:
- `scenes.js` → `scenes-min.js` (concatenates all scene files)
- `plugins.js` → `plugins-min.js` (concatenates jQuery plugins)
- `libs.js` → `libs-min.js` (concatenates library files)
- Individual lib files → `*-min.js` versions

### Build Output
```
dist/
├── assets/
│   ├── css/               # Compiled SCSS
│   └── js/
│       ├── lib/           # Minified library files
│       │   ├── jquery-3.2.1.min.js
│       │   ├── caseStudy-min.js
│       │   └── ...
│       ├── pageLoad-min.js
│       ├── eric-min.js
│       ├── libs-min.js
│       ├── plugins-min.js
│       └── scenes-min.js
└── *.html                 # Compiled Pug templates
```

## Deployment to AWS S3

### Asset Path Fixes ✅
The project has been successfully updated to use relative paths instead of hardcoded `http://assets.ericphelan.com` URLs. This ensures compatibility with S3 deployment.

**What was fixed:**
- All hardcoded asset URLs in Jade/Pug templates
- All hardcoded asset URLs in SCSS files
- All hardcoded asset URLs in JavaScript files
- Include statements for proper template compilation
- JavaScript minification and concatenation build process

### S3 Deployment Steps
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload to S3:**
   - Upload the entire `dist/` folder contents to your S3 bucket
   - Ensure the bucket is configured for static website hosting
   - Set the index document to `index.html`

3. **Configure CloudFront (recommended for HTTPS):**
   - Create a CloudFront distribution pointing to your S3 bucket
   - Configure the default root object as `index.html`
   - Set up error pages (404.html for 404 errors)

### Important Notes
- All asset paths are now relative (e.g., `assets/css/styles.css` instead of `http://assets.ericphelan.com/css/styles.css`)
- The build process compiles Pug templates to HTML and SCSS to CSS
- JavaScript files are minified, concatenated, and optimized for production
- All templates have been converted from `.jade` to `.pug` format for modern compatibility
- jQuery is automatically downloaded during the build process

## Troubleshooting

### Port Issues
If you get permission errors on port 80, change the port in `config.json`:
```json
{
  "http_port": 3000
}
```

### Build Issues
- Ensure you have the latest Node.js version
- Clear `node_modules` and run `npm install` again
- Check that `pug-cli`, `sass`, and `terser` are installed

### Asset Loading Issues
- Verify the `dist/` folder contains all compiled files
- Check that asset paths are relative (not absolute URLs)
- Ensure all required images and files are present in the `dist/assets/` folder
- Run `npm run build:js` to rebuild JavaScript files if needed

### JavaScript Build Issues
- If minified files are empty, check the source files for CodeKit directives
- Ensure all referenced files in concatenation directives exist
- Check the build-js.js script for any errors

## Original Build Tools
This project was originally built with CodeKit 3. The current setup provides equivalent functionality using:
- **Pug CLI** (replaces Jade compilation)
- **Sass** (replaces SCSS compilation)
- **Terser** (replaces JavaScript minification)
- **Node.js scripts** (replaces CodeKit build process and concatenation)

## Current Status ✅
- **Local Development**: Working
- **Asset Paths**: Fixed for S3 compatibility
- **Build Process**: Automated with npm scripts
- **Template Compilation**: Successfully converts Pug to HTML
- **SCSS Compilation**: Successfully converts SCSS to CSS
- **JavaScript Build**: Minification, concatenation, and optimization working
- **Server**: Express server running and serving content
- **jQuery**: Automatically downloaded and included
