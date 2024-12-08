import * as fs from 'fs';
import * as path from 'path';
import Parser = require('tree-sitter');
import Cpp = require('tree-sitter-cpp');
import {parse} from '../cpp_better_parser';

  
function printNode(node: Parser.SyntaxNode, indent: string = '') {
  const nodeType = node.type;
  const startPosition = node.startPosition;
  const endPosition = node.endPosition;
  const isNamed = node.isNamed;

  const nodeInfo = `${indent}${nodeType} [${startPosition.row}:${startPosition.column}-${endPosition.row}:${endPosition.column}]${isNamed ? ' (named)' : ''}`;
  
  // Print node text if it's a leaf node
  if (node.childCount === 0) {
    const nodeText = node.text.trim();
    console.log(`${nodeInfo} text: "${nodeText}"`);
  } else {
    console.log(`${nodeInfo} -> child count: ${node.childCount}`);
    // Recursively print child nodes with increased indentation
    for (const child of node.children) {
      printNode(child, indent + '\t');
    }
  }
}

// Initialize Tree-sitter and set the language
const parser = new Parser();
parser.setLanguage(Cpp);

// Read the C++ file
//const filePath = path.resolve(__dirname, 'example.cpp');
const filePath = path.resolve(__dirname, "data", "src", 'templated.h');
const cppCode = fs.readFileSync(filePath, 'utf8');

// Parse the file content
const tree = parser.parse(cppCode);

//printNode(tree.rootNode);

// Extract details from the root node
const classDetails = parse(tree.rootNode);

// // Output the results
console.log('Classes and their details (including nested classes and templates):');
console.log(JSON.stringify(classDetails, null, 2));