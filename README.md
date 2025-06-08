# StyleSpotter Chrome Extension

A Chrome extension that helps designers instantly detect and capture visual design trends (colors, typography, and layout styles) from any webpage.

## Features

- Extracts primary color palette from the current webpage
- Identifies fonts used on the page
- Simple, clean popup interface
- Easy copy-to-clipboard functionality

## Installation & Development

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `out` directory from your project folder

## Usage

1. Click the StyleSpotter icon in your Chrome toolbar while viewing any webpage
2. The extension will automatically analyze the page and display:
   - Color palette with hex codes
   - Font families used
3. Click "Copy to Clipboard" to save the information

## Development Notes

- Built with Next.js and React
- Uses Chrome Extension Manifest V3
- Implements content scripts for page analysis
- Styled with Tailwind CSS

## Future Enhancements

- Save color palettes and fonts to local storage
- Export styles to design tools
- AI-powered design trend analysis
- Layout pattern detection
- Custom color organization and tagging