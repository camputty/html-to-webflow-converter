/**
 * Class Naming System for HTML/CSS to Webflow Converter
 * 
 * This module is responsible for generating unique class names for Webflow styles
 * to avoid conflicts with existing classes in the project.
 */

class ClassNamingSystem {
  /**
   * Constructor for the Class Naming System
   * @param {string} prefix - Prefix for generated class names (default: 'html2wf-')
   */
  constructor(prefix = 'html2wf-') {
    this.prefix = prefix;
    this.classMap = new Map(); // Maps original class names to generated Webflow class names
    this.reverseMap = new Map(); // Maps generated Webflow class names to original class names
    this.counter = 0; // Counter for generating unique names
  }

  /**
   * Generate a unique class name for a given original class name
   * @param {string} originalClassName - The original CSS class name
   * @returns {string} - The generated Webflow class name
   */
  generateClassName(originalClassName) {
    // Check if we've already generated a name for this class
    if (this.classMap.has(originalClassName)) {
      return this.classMap.get(originalClassName);
    }

    // Generate a new unique class name
    let generatedName;
    
    // If the original name is valid and doesn't start with a number, use it with prefix
    if (originalClassName && /^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(originalClassName)) {
      generatedName = `${this.prefix}${originalClassName}`;
    } else {
      // Otherwise, generate a name based on counter
      generatedName = `${this.prefix}class-${this.counter}`;
    }
    
    // Ensure uniqueness by adding a counter if needed
    let uniqueName = generatedName;
    let suffix = 0;
    
    while (this.reverseMap.has(uniqueName)) {
      suffix++;
      uniqueName = `${generatedName}-${suffix}`;
    }
    
    // Store the mapping
    this.classMap.set(originalClassName, uniqueName);
    this.reverseMap.set(uniqueName, originalClassName);
    
    // Increment counter for next generation
    this.counter++;
    
    return uniqueName;
  }

  /**
   * Generate class names for a list of original class names
   * @param {Array<string>} originalClassNames - List of original CSS class names
   * @returns {Array<string>} - List of generated Webflow class names
   */
  generateClassNames(originalClassNames) {
    return originalClassNames.map(className => this.generateClassName(className));
  }

  /**
   * Get the generated Webflow class name for an original class name
   * @param {string} originalClassName - The original CSS class name
   * @returns {string|null} - The generated Webflow class name, or null if not found
   */
  getGeneratedClassName(originalClassName) {
    return this.classMap.get(originalClassName) || null;
  }

  /**
   * Get the original class name for a generated Webflow class name
   * @param {string} generatedClassName - The generated Webflow class name
   * @returns {string|null} - The original CSS class name, or null if not found
   */
  getOriginalClassName(generatedClassName) {
    return this.reverseMap.get(generatedClassName) || null;
  }

  /**
   * Check if a class name has been generated
   * @param {string} originalClassName - The original CSS class name
   * @returns {boolean} - True if a generated name exists, false otherwise
   */
  hasGeneratedClassName(originalClassName) {
    return this.classMap.has(originalClassName);
  }

  /**
   * Transform CSS selectors by replacing class names with generated Webflow class names
   * @param {string} selector - The CSS selector
   * @returns {string} - The transformed selector
   */
  transformSelector(selector) {
    // Replace class selectors (.class) with generated names
    return selector.replace(/\.([\w-]+)/g, (match, className) => {
      // Generate a class name if it doesn't exist yet
      if (!this.hasGeneratedClassName(className)) {
        this.generateClassName(className);
      }
      const generatedName = this.getGeneratedClassName(className);
      return generatedName ? `.${generatedName}` : match;
    });
  }

  /**
   * Get all class mappings
   * @returns {Object} - Object with original class names as keys and generated names as values
   */
  getAllClassMappings() {
    const mappings = {};
    for (const [original, generated] of this.classMap.entries()) {
      mappings[original] = generated;
    }
    return mappings;
  }

  /**
   * Reset the class naming system
   */
  reset() {
    this.classMap.clear();
    this.reverseMap.clear();
    this.counter = 0;
  }
}

module.exports = ClassNamingSystem;
