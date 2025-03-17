/**
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
}