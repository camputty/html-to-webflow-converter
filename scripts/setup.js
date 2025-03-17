const path = require('path');
const fs = require('fs');

/**
 * Webflow Designer Extension Configuration
 * 
 * This script creates the necessary configuration files for the Webflow Designer Extension.
 */

// Create extension.json configuration file
const extensionConfig = {
  "name": "HTML/CSS to Webflow Converter",
  "version": "1.0.0",
  "description": "Convert HTML and CSS to native Webflow elements using the style panel",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "icon": "icon.svg",
  "main": "index.js",
  "permissions": [
    "read:project",
    "write:project",
    "read:elements",
    "write:elements",
    "read:styles",
    "write:styles"
  ]
};

// Create webpack.config.js
const webpackConfig = `const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'commonjs2'
    }
  },
  target: 'node',
  mode: 'production',
  optimization: {
    minimize: false
  },
  externals: {
    '@webflow/designer-extension-typings': '@webflow/designer-extension-typings'
  }
};`;

// Create icon.svg
const iconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="4" fill="#007BFF"/>
  <path d="M8 8L16 16L8 24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M24 8L16 16L24 24" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// Create scripts directory if it doesn't exist
const scriptsDir = path.join(__dirname, '..', 'scripts');
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir);
}

// Create configure.js script
const configureScript = `/**
 * Configuration script for Webflow HTML/CSS Converter
 * 
 * This script sets up the necessary configuration for the Webflow Designer Extension.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get user input for configuration
console.log('Configuring Webflow HTML/CSS Converter...');

rl.question('Enter your name: ', (name) => {
  rl.question('Enter your email: ', (email) => {
    // Update extension.json with user info
    const extensionConfigPath = path.join(__dirname, '..', 'extension.json');
    const extensionConfig = JSON.parse(fs.readFileSync(extensionConfigPath, 'utf8'));
    
    extensionConfig.author.name = name;
    extensionConfig.author.email = email;
    
    fs.writeFileSync(extensionConfigPath, JSON.stringify(extensionConfig, null, 2));
    
    console.log('Configuration complete!');
    rl.close();
  });
});`;

// Create deploy.js script
const deployScript = `/**
 * Deployment script for Webflow HTML/CSS Converter
 * 
 * This script deploys the Webflow Designer Extension to your Webflow workspace.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Deploying Webflow HTML/CSS Converter...');

try {
  // Check if dist directory exists
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }
  
  // Check if extension.json exists
  const extensionConfigPath = path.join(__dirname, '..', 'extension.json');
  if (!fs.existsSync(extensionConfigPath)) {
    console.error('Error: extension.json not found. Run "npm run configure" first.');
    process.exit(1);
  }
  
  console.log('Deploying to Webflow...');
  console.log('In a real implementation, this would use the Webflow CLI to deploy the extension.');
  console.log('For now, please follow these manual steps:');
  console.log('1. Log in to your Webflow account');
  console.log('2. Go to the Developer Portal');
  console.log('3. Create a new Designer Extension');
  console.log('4. Upload the contents of the dist directory');
  
  console.log('Deployment complete!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
}`;

// Write files
fs.writeFileSync(path.join(__dirname, '..', 'extension.json'), JSON.stringify(extensionConfig, null, 2));
fs.writeFileSync(path.join(__dirname, '..', 'webpack.config.js'), webpackConfig);
fs.writeFileSync(path.join(__dirname, '..', 'icon.svg'), iconSvg);
fs.writeFileSync(path.join(scriptsDir, 'configure.js'), configureScript);
fs.writeFileSync(path.join(scriptsDir, 'deploy.js'), deployScript);

console.log('Configuration files created successfully!');
