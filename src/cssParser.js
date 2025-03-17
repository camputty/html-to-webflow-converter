/**
 * CSS Parser for Webflow HTML/CSS Converter
 * 
 * This module is responsible for parsing CSS input and creating a structured
 * representation that can be used to apply styles to Webflow elements.
 */

const postcss = require('postcss');

class CSSParser {
  /**
   * Constructor for the CSS Parser
   */
  constructor() {
    this.styleRules = [];
    this.mediaQueries = [];
  }

  /**
   * Parse CSS string into a structured representation
   * @param {string} cssString - The CSS string to parse
   * @returns {Object} - The parsed CSS structure
   */
  async parse(cssString) {
    try {
      // Parse CSS using PostCSS
      const result = await postcss().process(cssString, { from: undefined });
      const root = result.root;
      
      // Clear previous parsing results
      this.styleRules = [];
      this.mediaQueries = [];
      
      // Process all CSS rules
      root.walkRules(rule => {
        // Skip rules inside media queries (handled separately)
        if (rule.parent.type === 'atrule' && rule.parent.name === 'media') {
          return;
        }
        
        this.processRule(rule);
      });
      
      // Process media queries
      root.walkAtRules('media', atRule => {
        const mediaQuery = {
          query: atRule.params,
          rules: []
        };
        
        atRule.walkRules(rule => {
          mediaQuery.rules.push(this.processRule(rule, true));
        });
        
        this.mediaQueries.push(mediaQuery);
      });
      
      return {
        styleRules: this.styleRules,
        mediaQueries: this.mediaQueries
      };
    } catch (error) {
      console.error('Error parsing CSS:', error);
      throw error;
    }
  }

  /**
   * Process a CSS rule and extract its properties
   * @param {Object} rule - The PostCSS rule
   * @param {boolean} forMediaQuery - Whether this rule is part of a media query
   * @returns {Object} - The processed rule
   */
  processRule(rule, forMediaQuery = false) {
    const selector = rule.selector;
    const properties = {};
    
    // Extract all declarations (property-value pairs)
    rule.walkDecls(decl => {
      properties[decl.prop] = decl.value;
    });
    
    const processedRule = {
      selector,
      specificity: this.calculateSpecificity(selector),
      properties,
      originalRule: rule.toString()
    };
    
    // Only add to styleRules if not processing for a media query
    if (!forMediaQuery) {
      this.styleRules.push(processedRule);
    }
    
    return processedRule;
  }

  /**
   * Calculate the specificity of a CSS selector
   * @param {string} selector - The CSS selector
   * @returns {number} - The specificity value
   */
  calculateSpecificity(selector) {
    // Simple specificity calculation
    // This is a simplified version - a real implementation would be more complex
    let specificity = 0;
    
    // Count IDs
    const idCount = (selector.match(/#[a-zA-Z0-9_-]+/g) || []).length;
    specificity += idCount * 100;
    
    // Count classes, attributes, and pseudo-classes
    const classCount = (selector.match(/\.[a-zA-Z0-9_-]+|\[.+?\]|:[a-zA-Z0-9_-]+/g) || []).length;
    specificity += classCount * 10;
    
    // Count elements and pseudo-elements
    const elementCount = (selector.match(/[a-zA-Z0-9_-]+|::[a-zA-Z0-9_-]+/g) || []).length;
    specificity += elementCount;
    
    return specificity;
  }

  /**
   * Get all style rules
   * @returns {Array} - Array of all style rules
   */
  getAllStyleRules() {
    return this.styleRules;
  }

  /**
   * Get all media queries
   * @returns {Array} - Array of all media queries
   */
  getAllMediaQueries() {
    return this.mediaQueries;
  }

  /**
   * Find style rules that match a given selector
   * @param {string} elementSelector - The element selector to match against
   * @returns {Array} - Array of matching style rules
   */
  findMatchingRules(elementSelector) {
    // This is a simplified matching algorithm
    // A real implementation would use a proper CSS selector matching algorithm
    return this.styleRules.filter(rule => {
      // Split compound selectors
      const selectors = rule.selector.split(',').map(s => s.trim());
      
      // Check if any selector matches
      return selectors.some(selector => {
        // Simple exact match for now
        return selector === elementSelector;
      });
    });
  }

  /**
   * Group style rules by selector
   * @returns {Object} - Object with selectors as keys and arrays of rules as values
   */
  groupRulesBySelector() {
    const groups = {};
    
    this.styleRules.forEach(rule => {
      // Split compound selectors
      const selectors = rule.selector.split(',').map(s => s.trim());
      
      selectors.forEach(selector => {
        if (!groups[selector]) {
          groups[selector] = [];
        }
        
        groups[selector].push(rule);
      });
    });
    
    // Sort rules in each group by specificity
    Object.keys(groups).forEach(selector => {
      groups[selector].sort((a, b) => a.specificity - b.specificity);
    });
    
    return groups;
  }

  /**
   * Convert CSS property names to Webflow style property names
   * @param {string} cssProperty - The CSS property name
   * @returns {string} - The corresponding Webflow style property name
   */
  mapToWebflowProperty(cssProperty) {
    // Map of CSS properties to Webflow style properties
    const propertyMap = {
      // Typography
      'font-family': 'fontFamily',
      'font-size': 'fontSize',
      'font-weight': 'fontWeight',
      'line-height': 'lineHeight',
      'letter-spacing': 'letterSpacing',
      'text-align': 'textAlign',
      'text-decoration': 'textDecoration',
      'text-transform': 'textTransform',
      
      // Colors
      'color': 'color',
      'background-color': 'backgroundColor',
      'border-color': 'borderColor',
      
      // Layout
      'display': 'display',
      'position': 'position',
      'top': 'top',
      'right': 'right',
      'bottom': 'bottom',
      'left': 'left',
      'z-index': 'zIndex',
      'float': 'float',
      'clear': 'clear',
      
      // Dimensions
      'width': 'width',
      'height': 'height',
      'max-width': 'maxWidth',
      'max-height': 'maxHeight',
      'min-width': 'minWidth',
      'min-height': 'minHeight',
      
      // Margin & Padding
      'margin': 'margin',
      'margin-top': 'marginTop',
      'margin-right': 'marginRight',
      'margin-bottom': 'marginBottom',
      'margin-left': 'marginLeft',
      'padding': 'padding',
      'padding-top': 'paddingTop',
      'padding-right': 'paddingRight',
      'padding-bottom': 'paddingBottom',
      'padding-left': 'paddingLeft',
      
      // Border
      'border': 'border',
      'border-top': 'borderTop',
      'border-right': 'borderRight',
      'border-bottom': 'borderBottom',
      'border-left': 'borderLeft',
      'border-width': 'borderWidth',
      'border-style': 'borderStyle',
      'border-radius': 'borderRadius',
      
      // Background
      'background': 'background',
      'background-image': 'backgroundImage',
      'background-size': 'backgroundSize',
      'background-position': 'backgroundPosition',
      'background-repeat': 'backgroundRepeat',
      
      // Flexbox
      'flex': 'flex',
      'flex-direction': 'flexDirection',
      'flex-wrap': 'flexWrap',
      'justify-content': 'justifyContent',
      'align-items': 'alignItems',
      'align-content': 'alignContent',
      'align-self': 'alignSelf',
      'flex-grow': 'flexGrow',
      'flex-shrink': 'flexShrink',
      'flex-basis': 'flexBasis',
      'order': 'order',
      
      // Grid
      'grid-template-columns': 'gridTemplateColumns',
      'grid-template-rows': 'gridTemplateRows',
      'grid-column-gap': 'gridColumnGap',
      'grid-row-gap': 'gridRowGap',
      'grid-column': 'gridColumn',
      'grid-row': 'gridRow',
      
      // Other
      'opacity': 'opacity',
      'box-shadow': 'boxShadow',
      'transition': 'transition',
      'transform': 'transform',
      'cursor': 'cursor',
      'overflow': 'overflow',
      'visibility': 'visibility',
      
      // Add more mappings as needed
    };
    
    return propertyMap[cssProperty] || cssProperty;
  }
}

module.exports = CSSParser;
