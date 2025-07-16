#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.blue('🔍 Validating manifest.json...'));

// Read manifest.json
const manifestPath = path.join(__dirname, '..', 'manifest.json');
let manifest;

try {
  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  manifest = JSON.parse(manifestContent);
} catch (error) {
  console.error(chalk.red('❌ Error reading manifest.json:'), error.message);
  process.exit(1);
}

// Validation rules
const validations = [
  {
    name: 'Manifest version',
    test: () => manifest.manifest_version === 3,
    message: 'Manifest version should be 3'
  },
  {
    name: 'Name field',
    test: () => manifest.name && manifest.name.length > 0,
    message: 'Name field is required'
  },
  {
    name: 'Version field',
    test: () => manifest.version && /^\d+\.\d+(\.\d+)?$/.test(manifest.version),
    message: 'Version field should be in format X.Y or X.Y.Z'
  },
  {
    name: 'Description field',
    test: () => manifest.description && manifest.description.length > 0,
    message: 'Description field is required'
  },
  {
    name: 'Background script',
    test: () => manifest.background && manifest.background.service_worker,
    message: 'Background service worker is required'
  },
  {
    name: 'Action popup',
    test: () => manifest.action && manifest.action.default_popup,
    message: 'Action popup is required'
  },
  {
    name: 'Icons',
    test: () => manifest.icons && Object.keys(manifest.icons).length > 0,
    message: 'Icons are required'
  },
  {
    name: 'Permissions',
    test: () => Array.isArray(manifest.permissions) && manifest.permissions.length > 0,
    message: 'Permissions array is required'
  }
];

// Check if required files exist
const requiredFiles = [
  'popup.html',
  'options.html',
  'js/background.js',
  'js/popup.js',
  'js/options.js',
  'js/content.js',
  'css/popup.css',
  'css/options.css',
  'rules.json'
];

const fileChecks = requiredFiles.map(file => ({
  name: `File: ${file}`,
  test: () => fs.existsSync(path.join(__dirname, '..', file)),
  message: `Required file ${file} is missing`
}));

// Run all validations
const allValidations = [...validations, ...fileChecks];
let hasErrors = false;

allValidations.forEach(validation => {
  try {
    if (validation.test()) {
      console.log(chalk.green('✅'), validation.name);
    } else {
      console.log(chalk.red('❌'), validation.name, '-', validation.message);
      hasErrors = true;
    }
  } catch (error) {
    console.log(chalk.red('❌'), validation.name, '-', error.message);
    hasErrors = true;
  }
});

// Check for unused permissions
const usedPermissions = new Set();
const jsFiles = ['js/background.js', 'js/popup.js', 'js/options.js', 'js/content.js'];

jsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for chrome API usage
    if (content.includes('chrome.storage')) usedPermissions.add('storage');
    if (content.includes('chrome.notifications')) usedPermissions.add('notifications');
    if (content.includes('chrome.declarativeNetRequest')) {
      usedPermissions.add('declarativeNetRequest');
      usedPermissions.add('declarativeNetRequestFeedback');
    }
  }
});

// Compare with declared permissions
const declaredPermissions = new Set(manifest.permissions || []);
const unusedPermissions = [...declaredPermissions].filter(p => !usedPermissions.has(p));
const missingPermissions = [...usedPermissions].filter(p => !declaredPermissions.has(p));

if (unusedPermissions.length > 0) {
  console.log(chalk.yellow('⚠️  Unused permissions:'), unusedPermissions.join(', '));
}

if (missingPermissions.length > 0) {
  console.log(chalk.red('❌ Missing permissions:'), missingPermissions.join(', '));
  hasErrors = true;
}

// Summary
if (hasErrors) {
  console.log(chalk.red('\n❌ Validation failed!'));
  process.exit(1);
} else {
  console.log(chalk.green('\n✅ Manifest validation passed!'));
}