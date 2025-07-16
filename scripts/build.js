#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');

console.log(chalk.blue('📦 Building Chrome extension...'));

// Read package.json for version
const packagePath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

// Create dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Create output filename
const outputFilename = `simple-focus-mode-v${version}.zip`;
const outputPath = path.join(distDir, outputFilename);

// Remove existing zip if it exists
if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

// Create archive
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression
});

// Handle archive events
output.on('close', () => {
  const sizeInMB = (archive.pointer() / (1024 * 1024)).toFixed(2);
  console.log(chalk.green('✅ Build completed!'));
  console.log(chalk.blue(`📁 Output: ${outputFilename}`));
  console.log(chalk.blue(`📊 Size: ${sizeInMB} MB`));
});

archive.on('error', (err) => {
  console.error(chalk.red('❌ Build failed:'), err);
  process.exit(1);
});

// Pipe archive data to the file
archive.pipe(output);

// Files and directories to include
const filesToInclude = [
  'manifest.json',
  'popup.html',
  'options.html',
  'rules.json',
  'clock_alarm.mp3',
  'LICENSE'
];

const directoriesToInclude = [
  'js',
  'css',
  'icons'
];

// Add files
filesToInclude.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    archive.file(filePath, { name: file });
    console.log(chalk.green('✅'), `Added file: ${file}`);
  } else {
    console.log(chalk.yellow('⚠️'), `File not found: ${file}`);
  }
});

// Add directories
directoriesToInclude.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    archive.directory(dirPath, dir);
    console.log(chalk.green('✅'), `Added directory: ${dir}`);
  } else {
    console.log(chalk.yellow('⚠️'), `Directory not found: ${dir}`);
  }
});

// Files to exclude
const excludePatterns = [
  'node_modules/**',
  'dist/**',
  'scripts/**',
  'Doc/**',
  '.git/**',
  '.gitignore',
  'package.json',
  'package-lock.json',
  '.eslintrc.json',
  'Makefile',
  '*.log',
  '.DS_Store',
  'Thumbs.db'
];

console.log(chalk.blue('🚫 Excluding:'), excludePatterns.join(', '));

// Finalize the archive
archive.finalize();