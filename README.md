# Portfolio Website

A modern, responsive portfolio website built with HTML5, CSS3, and JavaScript. Features smooth scroll animations, dark mode support, and an animated wavy background effect.

## 🚀 Features

- **Full-Page Section Navigation**: Smooth scroll transitions between sections powered by GSAP
- **Dark/Light Mode**: Toggle between themes with preference saved to localStorage
- **Animated Wavy Background**: Canvas-based animation using Simplex Noise algorithm (light mode only)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Performance Optimized**: Page Visibility API, debounced resize handlers, and GPU-accelerated animations
- **Accessible**: ARIA labels, semantic HTML, and keyboard navigation support

## 🛠️ Tech Stack

### Frontend Technologies

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with CSS Custom Properties (CSS Variables) for theming
- **JavaScript (ES6+)**: Vanilla JavaScript with modern features
- **GSAP (GreenSock Animation Platform)**: Version 3.12.5
  - Core library for animations
  - Observer plugin for scroll/touch detection
- **Canvas API**: For wavy background animation
- **Simplex Noise Algorithm**: Custom implementation for organic wave patterns

### External Dependencies

- **Google Fonts**:
  - Inter (300, 400, 500, 600, 700)
  - Plus Jakarta Sans (400, 500, 600, 700, 800)

### CDN Resources

- GSAP Core: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`
- GSAP Observer Plugin: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Observer.min.js`

## 📁 Project Structure

```
personal-portfolio/
├── portfolio.html          # Main HTML file
├── css/
│   └── styles.css         # All stylesheets
├── js/
│   ├── main.js           # Main JavaScript (navigation, theme toggle)
│   └── wavy-background.js # Canvas animation logic
└── README.md             # This file
```

## 🎯 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code, Sublime Text, etc.)
- Git (for version control)
- A GitHub account (for hosting)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/personal-portfolio.git
   cd personal-portfolio
   ```

2. **Open the project**
   - Simply open `portfolio.html` in your web browser
   - Or use a local development server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server -p 8000
     
     # Using VS Code Live Server extension
     # Right-click portfolio.html > Open with Live Server
     ```

3. **Access the website**
   - Open your browser and navigate to `http://localhost:8000/portfolio.html`

## 🌐 Hosting on GitHub Pages

### Method 1: GitHub Pages (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/personal-portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on **Settings** tab
   - Scroll down to **Pages** section (left sidebar)
   - Under **Source**, select `main` branch
   - Select `/ (root)` folder
   - Click **Save**

3. **Access your website**
   - Your site will be available at: `https://yourusername.github.io/personal-portfolio/portfolio.html`
   - For a cleaner URL, rename `portfolio.html` to `index.html` (it will be accessible at `https://yourusername.github.io/personal-portfolio/`)

### Method 2: Custom Domain (Optional)

1. **Configure custom domain in GitHub Pages**
   - In repository Settings > Pages
   - Enter your custom domain (e.g., `www.yourname.com`)
   - GitHub will provide DNS instructions

2. **Update DNS records**
   - Add CNAME record pointing to `yourusername.github.io`
   - Or add A records for GitHub Pages IPs

3. **Enable HTTPS**
   - GitHub Pages automatically provides HTTPS for custom domains

## ✏️ Customization Guide

### 1. Personal Information

#### Update Profile Details (`portfolio.html`)

```html
<!-- Hero Section -->
<h2>Your Name</h2>
<p class="tagline">Your tagline here</p>

<!-- About Section -->
<p>Your about text here</p>

<!-- Contact Email -->
<a href="mailto:your.email@example.com">your.email@example.com</a>
```

#### Update Social Media Links (`portfolio.html`)

Replace placeholder URLs with your actual social media profiles:

```html
<!-- Hero Section Social Icons -->
<a href="https://github.com/yourusername" ...>
<a href="https://twitter.com/yourusername" ...>
<a href="https://instagram.com/yourusername" ...>
<a href="https://youtube.com/@yourusername" ...>

<!-- Contact Section Social Icons -->
<a href="https://github.com/yourusername" ...>
<a href="https://linkedin.com/in/yourusername" ...>
<a href="https://twitter.com/yourusername" ...>
```

### 2. Update Experience Section (`portfolio.html`)

```html
<div class="timeline-item">
    <div class="timeline-date">YYYY - Present</div>
    <h3 class="timeline-title">Your Job Title</h3>
    <p class="timeline-company">Company Name</p>
    <p class="timeline-description">Your job description here.</p>
</div>
```

### 3. Update Projects Section (`portfolio.html`)

```html
<div class="project-card">
    <div class="project-image"></div>
    <div class="project-content">
        <div class="project-tags">
            <span class="project-tag">Technology 1</span>
            <span class="project-tag">Technology 2</span>
        </div>
        <h3 class="project-title">Project Name</h3>
        <p class="project-description">Project description here.</p>
    </div>
</div>
```

### 4. Update Statistics (`portfolio.html`)

```html
<div class="stat">
    <div class="stat-number">50+</div>
    <div class="stat-label">Projects</div>
</div>
```

### 5. Change Colors and Theme (`css/styles.css`)

Modify CSS Custom Properties in the `:root` selector:

```css
:root {
    --bg-primary: #F3F3F3;        /* Light background */
    --bg-secondary: #FFFFFF;      /* Secondary background */
    --accent: #111111;            /* Primary accent color */
    --text-primary: #111111;      /* Primary text color */
    --text-secondary: #888888;    /* Secondary text color */
    /* ... more variables */
}

[data-theme="dark"] {
    --bg-primary: #0a0a0a;        /* Dark background */
    --bg-secondary: #111111;      /* Dark secondary background */
    --accent: #FFFFFF;            /* Light accent for dark mode */
    /* ... more variables */
}
```

### 6. Adjust Animation Speed (`js/wavy-background.js`)

```javascript
const speed = 0.0015;  // Increase for faster animation
const blur = 12;       // Adjust blur for different effect
const waveWidth = 80;  // Adjust wave thickness
```

### 7. Modify Section Navigation (`js/main.js`)

To change animation duration:

```javascript
defaults: { 
    duration: 1.25,  // Change duration (in seconds)
    ease: 'power1.inOut'  // Change easing function
}
```

## 🎨 Design Customization

### Typography

Font families are loaded from Google Fonts. To change fonts:

1. **Update Google Fonts URL** in `portfolio.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
   ```

2. **Update font-family** in `css/styles.css`:
   ```css
   body { 
       font-family: 'YourFont', sans-serif; 
   }
   ```

### Layout Adjustments

All spacing and layout can be customized in `css/styles.css`:

- Section padding: `.section-container { max-width: 1200px; }`
- Navigation padding: `nav { padding: 1rem 4rem; }`
- Card sizes: `.profile-card { width: 260px; }`

## 🐛 Troubleshooting

### Issue: Animations not working

**Solution**: Check browser console for GSAP errors. Ensure CDN links are accessible.

### Issue: Wavy background not appearing

**Solution**: 
- Check if you're in light mode (wavy background only appears in light theme)
- Verify `js/wavy-background.js` is loaded
- Check browser console for canvas errors

### Issue: Theme toggle not working

**Solution**:
- Verify `js/main.js` is loaded
- Check browser console for JavaScript errors
- Ensure localStorage is enabled in browser settings

### Issue: Navigation not responding

**Solution**:
- Verify GSAP Observer plugin is loaded
- Check browser console for errors
- Ensure all JavaScript files are in correct paths

### Issue: Styles not applying

**Solution**:
- Verify `css/styles.css` path is correct
- Check browser DevTools for CSS loading errors
- Ensure file paths are relative (not absolute)

## 🔧 Advanced Configuration

### Adding New Sections

1. **Add HTML structure** in `portfolio.html`:
   ```html
   <section class="new-section" role="region" aria-label="New section">
       <div class="outer"><div class="inner"><div class="bg">
           <!-- Your content here -->
       </div></div></div>
   </section>
   ```

2. **Add navigation dot**:
   ```html
   <div class="section-dot" data-section="6" ...></div>
   ```

3. **Update section count** in `js/main.js` (if using keyboard navigation):
   ```javascript
   const prevIndex = currentIndex === 0 ? 6 : currentIndex - 1; // Update max index
   ```

### Disabling Wavy Background

Comment out or remove the canvas element in `portfolio.html`:
```html
<!-- <div class="wavy-background" aria-hidden="true">
    <canvas id="wavyCanvas"></canvas>
</div> -->
```

### Performance Tuning

For better performance on low-end devices:

1. **Reduce animation complexity** (`js/wavy-background.js`):
   ```javascript
   const numWaves = 3;  // Reduce from 5
   ```

2. **Disable blur effect**:
   ```javascript
   const blur = 0;  // Remove blur
   ```

3. **Increase debounce time**:
   ```javascript
   resizeTimeout = setTimeout(() => {
       resize();
   }, 500);  // Increase from 300ms
   ```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

**Note**: GSAP requires modern browser support. For older browsers, consider polyfills.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: your.email@example.com

## 🎓 Learning Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## ⚡ Performance Tips

1. **Optimize Images**: If adding real images, compress them before use
2. **Minify Files**: Minify CSS and JS for production
3. **CDN Usage**: External libraries are already loaded from CDN
4. **Lazy Loading**: Consider lazy loading for heavy content
5. **Caching**: Set appropriate cache headers for static assets

---

**Built with ❤️ using modern web technologies**# 
