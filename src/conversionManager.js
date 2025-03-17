/**
 * Conversion Manager for HTML/CSS to Webflow Converter
 * 
 * This module orchestrates the conversion process between HTML/CSS and native Webflow elements.
 * It coordinates the flow between the HTML parser, CSS parser, element mapper, and class naming system.
 */

const HTMLParser = require('./htmlParser');
const CSSParser = require('./cssParser');
const WebflowElementMapper = require('./webflowElementMapper');
const ClassNamingSystem = require('./classNamingSystem');

class ConversionManager {
  /**
   * Constructor for the Conversion Manager
   * @param {Object} webflow - The Webflow API instance
   */
  constructor(webflow) {
    this.webflow = webflow;
    this.htmlParser = new HTMLParser();
    this.cssParser = new CSSParser();
    this.elementMapper = new WebflowElementMapper(webflow);
    this.classNamingSystem = new ClassNamingSystem();
    this.conversionStatus = 'idle';
    this.progressCallback = null;
  }

  /**
   * Set a callback function for progress updates
   * @param {Function} callback - The callback function
   */
  setProgressCallback(callback) {
    this.progressCallback = callback;
  }

  /**
   * Update the conversion progress
   * @param {string} status - The status message
   * @param {number} progress - The progress percentage (0-100)
   */
  updateProgress(status, progress) {
    this.conversionStatus = status;
    if (this.progressCallback) {
      this.progressCallback(status, progress);
    }
  }

  /**
   * Convert HTML and CSS to Webflow elements
   * @param {string} htmlCode - The HTML code to convert
   * @param {string} cssCode - The CSS code to convert
   * @param {Object} options - Conversion options
   * @returns {Promise<Object>} - The conversion result
   */
  async convert(htmlCode, cssCode, options = {}) {
    try {
      // Initialize
      this.updateProgress('Initializing conversion', 0);
      await this.elementMapper.initialize();
      
      // Configure class naming system
      if (options.prefix) {
        this.classNamingSystem = new ClassNamingSystem(options.prefix);
      } else {
        this.classNamingSystem = new ClassNamingSystem();
      }
      
      // Parse HTML
      this.updateProgress('Parsing HTML', 10);
      const parsedHtml = this.htmlParser.parse(htmlCode);
      
      // Parse CSS
      this.updateProgress('Parsing CSS', 30);
      const parsedCss = await this.cssParser.parse(cssCode);
      
      // Pre-generate class names for all classes found in HTML
      this.updateProgress('Processing HTML classes', 40);
      this.preGenerateClassNames(parsedHtml);
      
      // Process CSS classes
      this.updateProgress('Processing CSS classes', 50);
      const processedCss = this.processCssClasses(parsedCss);
      
      // Map HTML to Webflow elements
      this.updateProgress('Creating Webflow elements', 70);
      const webflowElements = await this.elementMapper.mapToWebflow(parsedHtml);
      
      // Apply styles to elements
      this.updateProgress('Applying styles', 90);
      await this.applyStylesToElements(webflowElements, processedCss);
      
      // Complete
      this.updateProgress('Conversion complete', 100);
      
      return {
        webflowElements,
        classMap: this.classNamingSystem.getAllClassMappings()
      };
    } catch (error) {
      this.updateProgress(`Error: ${error.message}`, 0);
      throw error;
    }
  }

  /**
   * Pre-generate class names for all classes found in HTML
   * @param {Object} parsedHtml - The parsed HTML structure
   */
  preGenerateClassNames(parsedHtml) {
    // Process the current element
    if (parsedHtml.classes && parsedHtml.classes.length > 0) {
      parsedHtml.classes.forEach(className => {
        this.classNamingSystem.generateClassName(className);
      });
    }
    
    // Process children recursively
    if (parsedHtml.children && parsedHtml.children.length > 0) {
      parsedHtml.children.forEach(child => {
        this.preGenerateClassNames(child);
      });
    }
  }

  /**
   * Process CSS classes to generate unique Webflow class names
   * @param {Object} parsedCss - The parsed CSS
   * @returns {Object} - The processed CSS with updated class names
   */
  processCssClasses(parsedCss) {
    const processedCss = {
      styleRules: [],
      mediaQueries: []
    };
    
    // Process style rules
    parsedCss.styleRules.forEach(rule => {
      const transformedSelector = this.classNamingSystem.transformSelector(rule.selector);
      processedCss.styleRules.push({
        ...rule,
        selector: transformedSelector,
        originalSelector: rule.selector
      });
    });
    
    // Process media queries
    parsedCss.mediaQueries.forEach(mediaQuery => {
      const processedMediaQuery = {
        query: mediaQuery.query,
        rules: []
      };
      
      mediaQuery.rules.forEach(rule => {
        const transformedSelector = this.classNamingSystem.transformSelector(rule.selector);
        processedMediaQuery.rules.push({
          ...rule,
          selector: transformedSelector,
          originalSelector: rule.selector
        });
      });
      
      processedCss.mediaQueries.push(processedMediaQuery);
    });
    
    return processedCss;
  }

  /**
   * Apply styles to Webflow elements
   * @param {Object} webflowElements - The Webflow elements
   * @param {Object} processedCss - The processed CSS
   * @returns {Promise<void>}
   */
  async applyStylesToElements(webflowElements, processedCss) {
    // Group style rules by selector for easier lookup
    const stylesBySelector = {};
    processedCss.styleRules.forEach(rule => {
      if (!stylesBySelector[rule.selector]) {
        stylesBySelector[rule.selector] = [];
      }
      stylesBySelector[rule.selector].push(rule);
    });
    
    // Apply styles to each element
    for (const element of this.elementMapper.getAllWebflowElements()) {
      // Find matching style rules for this element
      const matchingRules = this.findMatchingRules(element, stylesBySelector);
      
      // Apply styles from matching rules
      if (matchingRules.length > 0) {
        await this.applyStylesToElement(element, matchingRules);
      }
    }
  }

  /**
   * Find style rules that match a given element
   * @param {Object} element - The Webflow element
   * @param {Object} stylesBySelector - Style rules grouped by selector
   * @returns {Array} - Array of matching style rules
   */
  findMatchingRules(element, stylesBySelector) {
    // This is a simplified matching algorithm
    // A real implementation would use a proper CSS selector matching algorithm
    const matchingRules = [];
    
    // Check element classes
    if (element.classes) {
      element.classes.forEach(className => {
        const classSelector = `.${className}`;
        if (stylesBySelector[classSelector]) {
          matchingRules.push(...stylesBySelector[classSelector]);
        }
      });
    }
    
    // Check element type
    const typeSelector = element.type.toLowerCase();
    if (stylesBySelector[typeSelector]) {
      matchingRules.push(...stylesBySelector[typeSelector]);
    }
    
    // Sort by specificity
    matchingRules.sort((a, b) => a.specificity - b.specificity);
    
    return matchingRules;
  }

  /**
   * Apply styles to a single Webflow element
   * @param {Object} element - The Webflow element
   * @param {Array} rules - The style rules to apply
   * @returns {Promise<void>}
   */
  async applyStylesToElement(element, rules) {
    // Merge properties from all matching rules
    const mergedProperties = {};
    
    rules.forEach(rule => {
      Object.entries(rule.properties).forEach(([prop, value]) => {
        // Later rules override earlier ones
        mergedProperties[prop] = value;
      });
    });
    
    // Apply merged properties to the element
    await this.elementMapper.applyStyles(element, mergedProperties);
  }
}

module.exports = ConversionManager;
