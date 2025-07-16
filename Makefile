# Simple Focus Mode Chrome Extension Makefile
# Usage: make [target]

.PHONY: help install lint lint-fix validate build clean test release dev

# Default target
help:
	@echo "Available targets:"
	@echo "  install    - Install development dependencies"
	@echo "  lint       - Run ESLint to check code quality"
	@echo "  lint-fix   - Run ESLint and fix issues automatically"
	@echo "  validate   - Validate manifest.json and check files"
	@echo "  build      - Create distribution ZIP file"
	@echo "  clean      - Remove build artifacts"
	@echo "  test       - Run tests (placeholder)"
	@echo "  release    - Full release process (lint + validate + build)"
	@echo "  dev        - Development setup (install + lint-fix)"

# Install development dependencies
install:
	@echo "📦 Installing development dependencies..."
	npm install

# Run ESLint to check code quality
lint:
	@echo "🔍 Running ESLint..."
	npm run lint:check

# Run ESLint and fix issues automatically
lint-fix:
	@echo "🔧 Running ESLint with auto-fix..."
	npm run lint

# Validate manifest.json and check required files
validate:
	@echo "✅ Validating manifest and files..."
	npm run validate

# Create distribution ZIP file
build:
	@echo "📦 Building distribution package..."
	npm run build

# Remove build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -rf node_modules/
	rm -f package-lock.json

# Run tests (placeholder for future implementation)
test:
	@echo "🧪 Running tests..."
	npm test

# Full release process
release: install lint validate build
	@echo "🚀 Release process completed!"
	@echo "✅ Extension is ready for Chrome Web Store upload"
	@echo "📁 Distribution file: dist/simple-focus-mode-v$(shell node -p "require('./package.json').version").zip"

# Development setup
dev: install lint-fix
	@echo "🔧 Development setup completed!"
	@echo "💡 Use 'make release' before publishing to Chrome Web Store"

# Check if Node.js and npm are installed
check-deps:
	@which node > /dev/null || (echo "❌ Node.js not found. Please install Node.js" && exit 1)
	@which npm > /dev/null || (echo "❌ npm not found. Please install npm" && exit 1)
	@echo "✅ Node.js and npm are available"

# Pre-release checks
pre-release: check-deps
	@echo "🔍 Running pre-release checks..."
	@if [ ! -f "package.json" ]; then echo "❌ package.json not found"; exit 1; fi
	@if [ ! -f "manifest.json" ]; then echo "❌ manifest.json not found"; exit 1; fi
	@if [ ! -f "js/background.js" ]; then echo "❌ background.js not found"; exit 1; fi
	@if [ ! -f "js/popup.js" ]; then echo "❌ popup.js not found"; exit 1; fi
	@echo "✅ Pre-release checks passed"

# Show current version
version:
	@echo "Current version: $(shell node -p "require('./package.json').version")"

# Bump version (use: make bump-version VERSION=0.3.1)
bump-version:
	@if [ -z "$(VERSION)" ]; then echo "❌ Usage: make bump-version VERSION=0.3.1"; exit 1; fi
	@echo "📝 Updating version to $(VERSION)..."
	@node -e "const pkg = require('./package.json'); pkg.version = '$(VERSION)'; require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));"
	@node -e "const manifest = require('./manifest.json'); manifest.version = '$(VERSION)'; require('fs').writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2));"
	@echo "✅ Version updated to $(VERSION)"

# Show build info
info:
	@echo "📋 Build Information:"
	@echo "  Project: $(shell node -p "require('./package.json').name")"
	@echo "  Version: $(shell node -p "require('./package.json').version")"
	@echo "  Author: $(shell node -p "require('./package.json').author")"
	@echo "  License: $(shell node -p "require('./package.json').license")"
	@if [ -d "dist" ]; then echo "  Dist files: $(shell ls -la dist/ | wc -l | xargs) files"; fi

# Watch for changes during development (requires installation of watch tools)
watch:
	@echo "👀 Watching for changes..."
	@echo "💡 Install 'watch' or 'nodemon' for automatic rebuilds"
	@while true; do \
		make lint-fix; \
		sleep 2; \
	done