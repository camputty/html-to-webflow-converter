/**
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
});