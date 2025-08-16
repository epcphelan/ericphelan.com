# Eric Phelan - Personal Website

A modern, responsive personal website built with Pug templates, SCSS, and vanilla JavaScript.

## 🚀 **Features**

- **Modern Build System**: Pug templates, SCSS compilation, JavaScript minification
- **Responsive Design**: Mobile-first approach with smooth animations
- **Contact Form**: Google Forms integration (no server required)
- **Case Studies**: Portfolio showcase with interactive elements
- **Static Site**: Ready for deployment to S3, CloudFront, or any static hosting

## 🛠 **Tech Stack**

- **Templates**: Pug (formerly Jade)
- **Styles**: SCSS with modern CSS features
- **JavaScript**: Vanilla JS with minification
- **Build Tools**: Pug CLI, Sass, Terser
- **Deployment**: AWS S3 + CloudFront (optional)

## 📦 **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ericphelan.com
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project**
   ```bash
   npm run build
   ```

## 🔧 **Available Scripts**

- **`npm run build`** - Build the complete project
- **`npm run build:watch`** - Watch for changes and rebuild automatically
- **`npm run dev`** - Build and serve locally with Python HTTP server

## 📁 **Project Structure**

```
src/
├── assets/
│   ├── img/          # Images and graphics
│   ├── media/        # Videos and documents
│   ├── js/           # JavaScript source files
│   └── scss/         # SCSS stylesheets
├── cases/            # Case study templates
├── mixins/           # Reusable Pug components
└── index.pug         # Main page template

dist/                 # Built output (generated)
```

## 🌐 **Deployment**

### **Local Development**
```bash
npm run dev
# Opens http://localhost:8000
```

### **AWS S3 Deployment**
1. **Build the project**: `npm run build`
2. **Sync to S3**: `aws s3 sync dist/ s3://your-bucket --delete`
3. **Optional**: Set up CloudFront for HTTPS and custom domain

### **GitHub Actions (Automated)**
- Push to `master` branch triggers automatic build and deployment
- Configure AWS credentials in GitHub Secrets
- See `.github/workflows/deploy.yml` for details

## 📝 **Contact Form**

The contact form submits directly to Google Forms:
- **No server required** - form works without backend
- **Automatic responses** - saves to Google Sheets
- **Free forever** - Google Forms is completely free

## 🔍 **Troubleshooting**

### **Build Issues**
- Ensure Node.js 18+ is installed
- Run `npm install` to install dependencies
- Check that all source files exist in `src/` directory

### **Missing Images**
- Run `npm run build` to copy image assets
- Ensure `src/assets/img/` contains required images
- Check file permissions and paths

### **Deployment Issues**
- Verify AWS credentials and permissions
- Check S3 bucket configuration (static hosting enabled)
- Ensure CloudFront origin points to S3 website endpoint

## 📚 **Documentation**

- **`DEPLOYMENT.md`** - Detailed AWS deployment guide
- **`QUICK_DEPLOY.md`** - Quick deployment checklist
- **`GOOGLE_FORM_SETUP.md`** - Google Forms configuration

## 🤝 **Contributing**

This is a personal website project. For questions or suggestions, please contact Eric Phelan.

## 📄 **License**

ISC License - see LICENSE file for details.
