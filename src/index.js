/**
 * Main Application Entry Point for HTML/CSS to Webflow Converter
 * 
 * This module initializes and connects all components of the application.
 */

const HTMLParser = require('./htmlParser');
const CSSParser = require('./cssParser');
const WebflowElementMapper = require('./webflowElementMapper');
const ClassNamingSystem = require('./classNamingSystem');
const ConversionManager = require('./conversionManager');
const UserInterface = require('./userInterface');

/**
 * Initialize the HTML/CSS to Webflow Converter application
 * @param {Object} webflow - The Webflow API instance
 * @returns {Promise<Object>} - The initialized application
 */
async function initializeApp(webflow) {
  try {
    // Create the conversion manager
    const conversionManager = new ConversionManager(webflow);
    
    // Create the user interface
    const ui = new UserInterface(conversionManager);
    
    // Set up progress callback
    conversionManager.setProgressCallback((status, progress) => {
      ui.updateStatus(`${status} (${progress}%)`);
    });
    
    // Initialize the UI
    const uiContainer = await ui.initialize(webflow);
    
    return {
      conversionManager,
      ui,
      uiContainer
    };
  } catch (error) {
    console.error('Error initializing application:', error);
    throw error;
  }
}

module.exports = {
  initializeApp
};
