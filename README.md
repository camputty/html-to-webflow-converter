# HTML/CSS to Webflow Converter - README

## Overview

This application converts HTML and CSS code to native Webflow elements using the Webflow Designer API. Unlike similar tools that use embeds or custom elements, this converter creates true native Webflow elements and applies styles through the Webflow style panel.

## Features

- Parses HTML structure and maps to native Webflow elements
- Processes CSS rules and applies them as Webflow styles
- Uses a unique class naming system to avoid conflicts with existing classes
- Provides a user-friendly interface for pasting HTML/CSS and configuring options
- Preserves element hierarchy, attributes, and content
- Handles complex CSS selectors and media queries

## Installation

### Prerequisites

- Node.js 14.x or higher
- Webflow account with Designer API access
- Webflow Designer Extension development environment

### Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/html-to-webflow-converter.git
cd html-to-webflow-converter
```

2. Install dependencies:
```
npm install
```

3. Configure the Webflow Designer Extension:
```
npm run configure
```

4. Build the extension:
```
npm run build
```

5. Deploy to your Webflow workspace:
```
npm run deploy
```

## Usage

1. Open your Webflow project in the Designer
2. Click on the HTML/CSS Converter extension icon in the toolbar
3. Paste your HTML code in the HTML input panel
4. Paste your CSS code in the CSS input panel
5. Configure options if needed:
   - Class Prefix: Prefix for generated class names (default: 'html2wf-')
   - Use Native Elements Only: Force use of only native Webflow elements
   - Preserve Original Classes: Keep original class names in addition to generated ones
6. Click "Convert to Webflow" button
7. The converter will process your code and create native Webflow elements with appropriate styles

## Architecture

The application consists of several key components:

1. **HTML Parser**: Parses HTML structure using Cheerio
2. **CSS Parser**: Processes CSS rules using PostCSS
3. **Webflow Element Mapper**: Maps HTML elements to native Webflow elements
4. **Class Naming System**: Generates unique class names to avoid conflicts
5. **Conversion Manager**: Orchestrates the conversion process
6. **User Interface**: Provides input panels and controls

## Development

### Project Structure

```
/src
  /htmlParser.js       - HTML parsing and structure creation
  /cssParser.js        - CSS parsing and rule extraction
  /webflowElementMapper.js - Mapping to Webflow elements
  /classNamingSystem.js - Class name generation and management
  /conversionManager.js - Orchestration of conversion process
  /userInterface.js    - User interface components
  /index.js            - Main application entry point
  /test.js             - Test suite
/dist                  - Built extension files
/docs                  - Documentation
```

### Running Tests

```
npm test
```

### Building for Production

```
npm run build
```

## Limitations

- Some complex CSS features may not be fully supported
- JavaScript is not converted (only HTML and CSS)
- Some Webflow-specific features may require manual adjustment after conversion

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Webflow team for providing the Designer API
- Cheerio and PostCSS for excellent parsing capabilities
- The open source community for inspiration and support
