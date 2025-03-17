# Webflow API Capabilities Analysis for HTML/CSS to Webflow Converter

## Overview

This document analyzes the Webflow Designer API capabilities specifically for building an application that converts HTML and CSS to native Webflow elements using the style panel rather than embeds or custom elements.

## Key API Capabilities

### 1. Element Creation and Manipulation

The Webflow Designer API provides several methods for creating and manipulating elements:

- **Element Creation**: 
  - `webflow.createElement()` - Creates new elements
  - `element.after()` - Inserts elements after target elements
  - `element.before()` - Inserts elements before target elements
  - `element.appendChild()` - Nests elements as children

- **Element Selection**:
  - `webflow.getSelectedElement()` - Gets the currently selected element
  - `webflow.getAllElements()` - Gets all elements on the current page
  - `webflow.setSelectedElement()` - Sets the selected element

- **Element Types**:
  - The API supports various element types that map to HTML elements (div, span, heading, paragraph, etc.)
  - Each element type has specific properties and methods

### 2. Style Creation and Application

The API provides robust capabilities for creating and applying styles (classes in Webflow):

- **Style Creation**:
  - `webflow.createStyle()` - Creates a new style with a unique name

- **Style Application**:
  - `element.addStyle()` - Adds a style to an element
  - `element.removeStyle()` - Removes a style from an element
  - `element.getStyles()` - Gets all styles applied to an element

- **Style Properties**:
  - `style.setProperty()` - Sets a CSS property on a style
  - `style.getProperty()` - Gets a CSS property value from a style
  - Support for all standard CSS properties (layout, typography, backgrounds, etc.)

### 3. Limitations and Considerations

- **Combo Classes**: The API currently offers read-only access to Combo Classes
- **Element Presets**: Element creation requires selecting an Element Preset first
- **Asynchronous Operations**: Most API methods are asynchronous and return Promises
- **Unique Style Names**: Style names must be unique within a project

## Mapping HTML/CSS to Webflow

### HTML to Webflow Elements

The API provides sufficient capabilities to map HTML elements to native Webflow elements:

1. Parse HTML structure
2. For each HTML element, create corresponding Webflow element
3. Maintain parent-child relationships
4. Set element content and attributes

### CSS to Webflow Styles

The API allows for converting CSS styles to Webflow styles:

1. Parse CSS rules
2. Create Webflow styles for each CSS class
3. Set style properties using `style.setProperty()`
4. Apply styles to elements using `element.addStyle()`

### Class Naming System

To avoid conflicts with existing classes:

1. Create a prefix system for generated classes (e.g., "html2wf-")
2. Maintain a mapping between original CSS classes and generated Webflow classes
3. Handle nested selectors and specificity

## Technical Approach

Based on the API capabilities, our converter application should:

1. Parse HTML using a DOM parser
2. Parse CSS using a CSS parser
3. Create a mapping between HTML elements and Webflow elements
4. Create a mapping between CSS classes and Webflow styles
5. Apply the mappings to create the Webflow structure
6. Set style properties on Webflow styles

## Conclusion

The Webflow Designer API provides comprehensive capabilities for creating and manipulating elements and styles, making it feasible to build an HTML/CSS to Webflow converter that uses native Webflow elements and the style panel. The main challenges will be handling complex CSS selectors, maintaining proper element hierarchy, and creating a robust class naming system to avoid conflicts.
