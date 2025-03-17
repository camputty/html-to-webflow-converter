/**
 * Test Suite for HTML/CSS to Webflow Converter
 * 
 * This module contains test cases for the HTML/CSS to Webflow converter application.
 */

const HTMLParser = require('./htmlParser');
const CSSParser = require('./cssParser');
const WebflowElementMapper = require('./webflowElementMapper');
const ClassNamingSystem = require('./classNamingSystem');
const ConversionManager = require('./conversionManager');

// Mock Webflow API for testing
const mockWebflow = {
  // Add mock methods as needed
};

/**
 * Run all tests
 */
async function runTests() {
  console.log('Running tests for HTML/CSS to Webflow Converter...');
  
  try {
    await testHTMLParser();
    await testCSSParser();
    await testClassNamingSystem();
    await testWebflowElementMapper();
    await testConversionManager();
    await testIntegration();
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

/**
 * Test the HTML Parser
 */
async function testHTMLParser() {
  console.log('Testing HTML Parser...');
  
  const htmlParser = new HTMLParser();
  
  // Test basic HTML parsing
  const basicHTML = '<div class="container"><p>Hello World</p></div>';
  const parsedBasic = htmlParser.parse(basicHTML);
  
  console.assert(parsedBasic.tagName === 'body' || parsedBasic.tagName === 'html', 'Root element should be body or html');
  console.assert(parsedBasic.children.length > 0, 'Root should have children');
  
  // Test nested elements
  const nestedHTML = '<div class="outer"><div class="inner"><p>Nested content</p></div></div>';
  const parsedNested = htmlParser.parse(nestedHTML);
  
  // Find the outer div
  const outerDiv = findElementByClass(parsedNested, 'outer');
  console.assert(outerDiv !== null, 'Should find outer div');
  console.assert(outerDiv.children.length > 0, 'Outer div should have children');
  
  // Find the inner div
  const innerDiv = findElementByClass(outerDiv, 'inner');
  console.assert(innerDiv !== null, 'Should find inner div');
  console.assert(innerDiv.children.length > 0, 'Inner div should have children');
  
  // Test attributes
  const attributesHTML = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>';
  const parsedAttributes = htmlParser.parse(attributesHTML);
  
  // Find the link
  const link = findElementByTagName(parsedAttributes, 'a');
  console.assert(link !== null, 'Should find link element');
  console.assert(link.attributes.href === 'https://example.com', 'Link should have correct href');
  console.assert(link.attributes.target === '_blank', 'Link should have correct target');
  console.assert(link.attributes.rel === 'noopener', 'Link should have correct rel');
  
  console.log('HTML Parser tests passed!');
}

/**
 * Test the CSS Parser
 */
async function testCSSParser() {
  console.log('Testing CSS Parser...');
  
  const cssParser = new CSSParser();
  
  // Test basic CSS parsing
  const basicCSS = '.container { width: 100%; } p { color: red; }';
  const parsedBasic = await cssParser.parse(basicCSS);
  
  console.assert(parsedBasic.styleRules.length === 2, 'Should parse two style rules');
  
  // Find container rule
  const containerRule = parsedBasic.styleRules.find(rule => rule.selector === '.container');
  console.assert(containerRule !== undefined, 'Should find container rule');
  console.assert(containerRule.properties.width === '100%', 'Container should have correct width');
  
  // Find p rule
  const pRule = parsedBasic.styleRules.find(rule => rule.selector === 'p');
  console.assert(pRule !== undefined, 'Should find p rule');
  console.assert(pRule.properties.color === 'red', 'P should have correct color');
  
  // Test media queries
  const mediaCSS = '@media (max-width: 768px) { .container { width: 90%; } }';
  const parsedMedia = await cssParser.parse(mediaCSS);
  
  console.assert(parsedMedia.mediaQueries.length === 1, 'Should parse one media query');
  console.assert(parsedMedia.mediaQueries[0].query === '(max-width: 768px)', 'Media query should have correct condition');
  console.assert(parsedMedia.mediaQueries[0].rules.length === 1, 'Media query should have one rule');
  
  console.log('CSS Parser tests passed!');
}

/**
 * Test the Class Naming System
 */
async function testClassNamingSystem() {
  console.log('Testing Class Naming System...');
  
  const classNamingSystem = new ClassNamingSystem('test-');
  
  // Test class name generation
  const className1 = classNamingSystem.generateClassName('container');
  console.assert(className1 === 'test-container', 'Should generate correct class name');
  
  // Test class name retrieval
  const retrievedName = classNamingSystem.getGeneratedClassName('container');
  console.assert(retrievedName === 'test-container', 'Should retrieve correct class name');
  
  // Test original name retrieval
  const originalName = classNamingSystem.getOriginalClassName('test-container');
  console.assert(originalName === 'container', 'Should retrieve correct original name');
  
  // Test selector transformation
  const transformedSelector = classNamingSystem.transformSelector('.container .inner');
  console.assert(transformedSelector === '.test-container .test-inner', 'Should transform selector correctly');
  
  console.log('Class Naming System tests passed!');
}

/**
 * Test the Webflow Element Mapper
 */
async function testWebflowElementMapper() {
  console.log('Testing Webflow Element Mapper...');
  
  const elementMapper = new WebflowElementMapper(mockWebflow);
  await elementMapper.initialize();
  
  // Create a simple parsed structure
  const parsedStructure = {
    id: 'el-0',
    tagName: 'div',
    type: 'div',
    attributes: { id: 'root' },
    classes: ['container'],
    styles: {},
    content: '',
    children: [
      {
        id: 'el-1',
        tagName: 'p',
        type: 'paragraph',
        attributes: {},
        classes: ['text'],
        styles: {},
        content: 'Hello World',
        children: []
      }
    ]
  };
  
  // Map to Webflow elements
  const webflowElements = await elementMapper.mapToWebflow(parsedStructure);
  
  console.assert(webflowElements.id === 'webflow-el-0', 'Root element should have correct ID');
  console.assert(webflowElements.type === 'div', 'Root element should have correct type');
  console.assert(webflowElements.children.length === 1, 'Root element should have one child');
  
  // Get the paragraph element
  const paragraphElement = elementMapper.getWebflowElement('el-1');
  console.assert(paragraphElement !== undefined, 'Should find paragraph element');
  console.assert(paragraphElement.type === 'paragraph', 'Paragraph should have correct type');
  console.assert(paragraphElement.content === 'Hello World', 'Paragraph should have correct content');
  
  console.log('Webflow Element Mapper tests passed!');
}

/**
 * Test the Conversion Manager
 */
async function testConversionManager() {
  console.log('Testing Conversion Manager...');
  
  const conversionManager = new ConversionManager(mockWebflow);
  
  // Set up a progress callback
  let lastStatus = '';
  let lastProgress = 0;
  conversionManager.setProgressCallback((status, progress) => {
    lastStatus = status;
    lastProgress = progress;
  });
  
  // Test simple conversion
  const htmlCode = '<div class="container"><p class="text">Hello World</p></div>';
  const cssCode = '.container { width: 100%; } .text { color: red; }';
  
  const result = await conversionManager.convert(htmlCode, cssCode);
  
  console.assert(result.webflowElements !== undefined, 'Should return Webflow elements');
  console.assert(result.classMap !== undefined, 'Should return class map');
  console.assert(lastStatus === 'Conversion complete', 'Should complete conversion');
  console.assert(lastProgress === 100, 'Should reach 100% progress');
  
  console.log('Conversion Manager tests passed!');
}

/**
 * Test integration of all components
 */
async function testIntegration() {
  console.log('Testing integration of all components...');
  
  const htmlParser = new HTMLParser();
  const cssParser = new CSSParser();
  const elementMapper = new WebflowElementMapper(mockWebflow);
  const classNamingSystem = new ClassNamingSystem();
  const conversionManager = new ConversionManager(mockWebflow);
  
  // Test the full conversion process with a complex example
  const htmlCode = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Test Page</title>
    </head>
    <body>
      <header class="header">
        <nav class="nav">
          <ul class="menu">
            <li class="menu-item"><a href="#" class="menu-link">Home</a></li>
            <li class="menu-item"><a href="#" class="menu-link">About</a></li>
            <li class="menu-item"><a href="#" class="menu-link">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main class="main">
        <section class="hero">
          <h1 class="title">Welcome to our site</h1>
          <p class="subtitle">This is a test page</p>
          <button class="cta-button">Learn More</button>
        </section>
        <section class="features">
          <div class="feature">
            <h2 class="feature-title">Feature 1</h2>
            <p class="feature-text">Description of feature 1</p>
          </div>
          <div class="feature">
            <h2 class="feature-title">Feature 2</h2>
            <p class="feature-text">Description of feature 2</p>
          </div>
          <div class="feature">
            <h2 class="feature-title">Feature 3</h2>
            <p class="feature-text">Description of feature 3</p>
          </div>
        </section>
      </main>
      <footer class="footer">
        <p class="copyright">© 2025 Test Company</p>
      </footer>
    </body>
    </html>
  `;
  
  const cssCode = `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    
    .header {
      background-color: #333;
      color: white;
      padding: 1rem;
    }
    
    .nav {
      display: flex;
      justify-content: center;
    }
    
    .menu {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .menu-item {
      margin: 0 1rem;
    }
    
    .menu-link {
      color: white;
      text-decoration: none;
    }
    
    .menu-link:hover {
      text-decoration: underline;
    }
    
    .main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }
    
    .hero {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 2rem;
    }
    
    .cta-button {
      background-color: #007bff;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 4px;
    }
    
    .features {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    
    .feature {
      flex-basis: calc(33.333% - 2rem);
      margin-bottom: 2rem;
      padding: 1.5rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .feature-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .feature-text {
      color: #666;
    }
    
    .footer {
      background-color: #333;
      color: white;
      text-align: center;
      padding: 1rem;
    }
    
    @media (max-width: 768px) {
      .features {
        flex-direction: column;
      }
      
      .feature {
        flex-basis: 100%;
      }
    }
  `;
  
  const result = await conversionManager.convert(htmlCode, cssCode);
  
  console.assert(result.webflowElements !== undefined, 'Should return Webflow elements');
  console.assert(result.classMap !== undefined, 'Should return class map');
  
  // Check that all expected classes were generated
  const expectedClasses = [
    'header', 'nav', 'menu', 'menu-item', 'menu-link', 'main', 'hero',
    'title', 'subtitle', 'cta-button', 'features', 'feature',
    'feature-title', 'feature-text', 'footer', 'copyright'
  ];
  
  for (const className of expectedClasses) {
    console.assert(
      result.classMap[className] !== undefined,
      `Should generate class name for ${className}`
    );
  }
  
  console.log('Integration tests passed!');
}

/**
 * Helper function to find an element by class name
 * @param {Object} element - The element to search in
 * @param {string} className - The class name to find
 * @returns {Object|null} - The found element or null
 */
function findElementByClass(element, className) {
  if (element.classes && element.classes.includes(className)) {
    return element;
  }
  
  if (element.children) {
    for (const child of element.children) {
      const found = findElementByClass(child, className);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
}

/**
 * Helper function to find an element by tag name
 * @param {Object} element - The element to search in
 * @param {string} tagName - The tag name to find
 * @returns {Object|null} - The found element or null
 */
function findElementByTagName(element, tagName) {
  if (element.tagName === tagName) {
    return element;
  }
  
  if (element.children) {
    for (const child of element.children) {
      const found = findElementByTagName(child, tagName);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  runTests
};
