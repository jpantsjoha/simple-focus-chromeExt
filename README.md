# Simple Focus Mode

This is my take on the **Simple Focus Mode** Extension which I have created for Chrome.

> I just published Simple Focus Mode: Boost Your Productivity with My Chrome Extension https://link.medium.com/iGcsnNTTezb 

This is a minimalist Pomodoro Timer extension for Google Chrome called **Simple Focus Mode**. It helps users improve productivity by breaking their work into focused intervals, separated by short breaks. The extension features an elegant monochromatic design that reduces visual distractions while providing powerful time management tools.

[![Short Walk-through Demo Video](https://img.youtube.com/vi/mbE6vxXMFlw/0.jpg)](https://www.youtube.com/watch?v=mbE6vxXMFlw)

<img src="./screenshot.png" alt="Simple Focus Mode" width="400px"/>

## Features

- **Complete Pomodoro Cycle**: Full 25-5-25-5-25-5-25-15 minute cycles with automatic transitions
- **Intelligent Website Blocking**: Dynamic blocking during focus sessions only (Facebook, Twitter, Instagram, YouTube, Reddit, TikTok)
- **Elegant Minimal Design**: Monochromatic interface that reduces visual noise
- **Session Tracking**: Visual progress indicators and cycle completion tracking
- **Dark Mode Support**: Seamless theme switching for different working environments
- **Pause/Resume Functionality**: Full timer control with accurate time tracking
- **Keyboard Shortcuts**: Efficient control without mouse interaction
- **Custom Timer Options**: Flexible timing for different work styles (1-120 minutes)
- **Browser Tab Updates**: Real-time remaining time in tab title

## Installation

1. Download or clone the repository.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click on the "Load unpacked" button and select the downloaded repository folder.
5. The Simple Focus Mode extension should now be installed and visible in your extensions list.

## Usage

### Basic Pomodoro Cycle
1. Click on the Simple Focus Mode icon in the Chrome toolbar.
2. Click "Start" to begin a complete Pomodoro cycle.
3. The extension will automatically cycle through focus sessions and breaks.
4. Use the pause/resume controls as needed.

### Custom Timer
1. Click "Custom" to reveal timer options.
2. Adjust the duration using the slider (1-120 minutes).
3. Click "Start Custom Timer" to begin.

### Keyboard Shortcuts
- **Spacebar**: Start/Pause/Resume timer
- **Escape**: Stop timer
- **C**: Toggle custom timer
- **D**: Toggle dark mode

## Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup
```bash
# Install dependencies
make install

# or manually
npm install
```

### Development Commands
```bash
# Run linter with auto-fix
make lint-fix

# Validate manifest and files
make validate

# Build distribution package
make build

# Complete release process
make release

# Development setup
make dev
```

### Available Make Targets
- `make install` - Install development dependencies
- `make lint` - Run ESLint to check code quality
- `make lint-fix` - Run ESLint and fix issues automatically
- `make validate` - Validate manifest.json and check files
- `make build` - Create distribution ZIP file
- `make clean` - Remove build artifacts
- `make release` - Full release process (lint + validate + build)
- `make dev` - Development setup (install + lint-fix)

### Release Process
Before publishing to Chrome Web Store:
```bash
make release
```

This will:
1. Install dependencies
2. Run ESLint and fix code issues
3. Validate manifest.json and required files
4. Create a distribution ZIP file in `dist/`

## Project Structure
```
simple-focus-chromeExt/
├── manifest.json          # Extension manifest
├── popup.html            # Main popup interface
├── options.html          # Options page
├── rules.json           # Website blocking rules
├── clock_alarm.mp3      # Notification sound
├── js/
│   ├── background.js    # Background service worker
│   ├── popup.js        # Popup interface logic
│   ├── options.js      # Options page logic
│   └── content.js      # Content script
├── css/
│   ├── popup.css       # Popup styling
│   └── options.css     # Options page styling
├── icons/              # Extension icons
├── scripts/            # Build and validation scripts
├── Doc/               # Documentation
└── dist/              # Distribution files (generated)
```

## Design Philosophy

Simple Focus Mode embraces the principle that **less is more**. The extension features:

- **Monochromatic Color Palette**: Clean whites, subtle grays, and deep blacks
- **Typography-First Design**: Clear, readable fonts with optimal spacing
- **Minimal Visual Elements**: Essential components only, no unnecessary decorations
- **Intuitive Interface**: Natural workflow that doesn't interrupt your focus
- **Distraction-Free Experience**: Every element serves a purpose

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests for improvements or bug fixes.

### Code Style
- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Maintain consistent formatting

### Testing
Run the full test suite before submitting:
```bash
make release
```

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT).

## Changelog

See [Doc/Marketing.md](Doc/Marketing.md) for detailed changelog and version history.

## Support

If you encounter any issues or have suggestions, please open an issue on the GitHub repository.