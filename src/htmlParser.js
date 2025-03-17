/**
 * HTML Parser for Webflow HTML/CSS Converter
 * 
 * This module is responsible for parsing HTML input and creating a structured
 * representation that can be used to map to Webflow elements.
 */

const cheerio = require('cheerio');

class HTMLParser {
  /**
   * Constructor for the HTML Parser
   */
  constructor() {
    this.dom = null;
    this.elementMap = new Map(); // Maps element IDs to their parsed representation
    this.idCounter = 0;
  }

  /**
   * Parse HTML string into a structured representation
   * @param {string} htmlString - The HTML string to parse
   * @returns {Object} - The root element of the parsed structure
   */
  parse(htmlString) {
    // Load HTML into cheerio
    this.dom = cheerio.load(htmlString);
    this.elementMap.clear();
    this.idCounter = 0;
    
    // Start parsing from the body element
    const bodyElement = this.dom('body').length > 0 
      ? this.dom('body') 
      : this.dom.root();
    
    // Parse the body and its children
    const parsedStructure = this.parseElement(bodyElement[0]);
    
    return parsedStructure;
  }

  /**
   * Parse a single element and its children
   * @param {Object} element - The cheerio element to parse
   * @returns {Object} - The parsed element structure
   */
  parseElement(element) {
    if (!element) return null;
    
    const $ = this.dom;
    const $element = $(element);
    
    // Generate a unique ID for this element
    const elementId = `el-${this.idCounter++}`;
    
    // Create the basic element structure
    const parsedElement = {
      id: elementId,
      tagName: element.tagName || element.name,
      type: this.mapElementType(element.tagName || element.name),
      attributes: this.parseAttributes($element),
      classes: $element.attr('class') ? $element.attr('class').split(/\s+/).filter(Boolean) : [],
      styles: this.parseInlineStyles($element),
      content: this.getElementContent($element),
      children: []
    };
    
    // Parse children
    $element.children().each((i, child) => {
      const parsedChild = this.parseElement(child);
      if (parsedChild) {
        parsedElement.children.push(parsedChild);
      }
    });
    
    // Store in element map for later reference
    this.elementMap.set(elementId, parsedElement);
    
    return parsedElement;
  }

  /**
   * Map HTML element types to Webflow element types
   * @param {string} tagName - The HTML tag name
   * @returns {string} - The corresponding Webflow element type
   */
  mapElementType(tagName) {
    if (!tagName) return 'div'; // Default to div
    
    const tagMap = {
      'div': 'div',
      'span': 'text',
      'p': 'paragraph',
      'h1': 'heading',
      'h2': 'heading',
      'h3': 'heading',
      'h4': 'heading',
      'h5': 'heading',
      'h6': 'heading',
      'a': 'link',
      'img': 'image',
      'ul': 'list',
      'ol': 'list',
      'li': 'listItem',
      'button': 'button',
      'form': 'form',
      'input': 'input',
      'textarea': 'textarea',
      'select': 'select',
      'option': 'option',
      'video': 'video',
      'audio': 'audio',
      'iframe': 'embed',
      'section': 'section',
      'article': 'div',
      'aside': 'div',
      'footer': 'footer',
      'header': 'header',
      'nav': 'nav',
      'main': 'div',
      'figure': 'div',
      'figcaption': 'div',
      'blockquote': 'blockquote',
      'hr': 'divider',
      'br': 'lineBreak',
      'table': 'table',
      'tr': 'tableRow',
      'td': 'tableCell',
      'th': 'tableCell',
      'thead': 'tableHead',
      'tbody': 'tableBody',
      'tfoot': 'tableFoot',
      // Add more mappings as needed
    };
    
    return tagMap[tagName.toLowerCase()] || 'div'; // Default to div if no mapping exists
  }

  /**
   * Parse element attributes
   * @param {Object} $element - The cheerio element
   * @returns {Object} - Object containing the element's attributes
   */
  parseAttributes($element) {
    const attributes = {};
    const attribs = $element[0].attribs || {};
    
    // Copy all attributes except class and style (handled separately)
    Object.keys(attribs).forEach(key => {
      if (key !== 'class' && key !== 'style') {
        attributes[key] = attribs[key];
      }
    });
    
    return attributes;
  }

  /**
   * Parse inline styles from style attribute
   * @param {Object} $element - The cheerio element
   * @returns {Object} - Object containing parsed styles
   */
  parseInlineStyles($element) {
    const styles = {};
    const styleAttr = $element.attr('style');
    
    if (!styleAttr) return styles;
    
    // Parse inline style attribute
    styleAttr.split(';').forEach(style => {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value) {
        // Convert kebab-case to camelCase for consistency
        const camelProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        styles[camelProperty] = value;
      }
    });
    
    return styles;
  }

  /**
   * Get the text content of an element
   * @param {Object} $element - The cheerio element
   * @returns {string} - The element's text content
   */
  getElementContent($element) {
    // For elements that typically have text content directly
    const textElements = ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'a'];
    const tagName = $element[0].tagName || $element[0].name;
    
    if (textElements.includes(tagName.toLowerCase())) {
      // Get only the direct text content, not including children
      return $element.contents().filter(function() {
        return this.type === 'text';
      }).text().trim();
    }
    
    // For special elements like inputs
    if (tagName.toLowerCase() === 'input') {
      const type = $element.attr('type');
      if (type === 'text' || type === 'email' || type === 'password' || type === 'number') {
        return $element.attr('value') || '';
      } else if (type === 'checkbox' || type === 'radio') {
        return $element.attr('checked') ? 'checked' : '';
      }
    }
    
    // For textarea
    if (tagName.toLowerCase() === 'textarea') {
      return $element.text();
    }
    
    return '';
  }

  /**
   * Get the parsed element by ID
   * @param {string} id - The element ID
   * @returns {Object} - The parsed element
   */
  getElementById(id) {
    return this.elementMap.get(id);
  }

  /**
   * Get all parsed elements
   * @returns {Array} - Array of all parsed elements
   */
  getAllElements() {
    return Array.from(this.elementMap.values());
  }

  /**
   * Find elements by selector
   * @param {string} selector - CSS selector
   * @returns {Array} - Array of matching elements
   */
  findElements(selector) {
    const $ = this.dom;
    const elements = $(selector);
    const result = [];
    
    elements.each((i, el) => {
      // Find the corresponding parsed element
      for (const [id, parsedEl] of this.elementMap.entries()) {
        if (parsedEl.tagName === el.tagName || parsedEl.tagName === el.name) {
          // Check if attributes match
          const attribsMatch = Object.keys(parsedEl.attributes).every(key => {
            return parsedEl.attributes[key] === $(el).attr(key);
          });
          
          if (attribsMatch) {
            result.push(parsedEl);
            break;
          }
        }
      }
    });
    
    return result;
  }
}

module.exports = HTMLParser;
