// Function to extract colors from webpage
function extractColors() {
    const elements = document.querySelectorAll('*');
    const colors = new Set();
    
    elements.forEach(element => {
        const styles = window.getComputedStyle(element);
        const backgroundColor = styles.backgroundColor;
        const color = styles.color;
        
        if (backgroundColor !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'transparent') {
            colors.add(rgbToHex(backgroundColor));
        }
        if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
            colors.add(rgbToHex(color));
        }
    });
    
    return Array.from(colors);
}

// Function to extract fonts from webpage
function extractFonts() {
    const elements = document.querySelectorAll('*');
    const fonts = new Set();
    
    elements.forEach(element => {
        const fontFamily = window.getComputedStyle(element).fontFamily;
        if (fontFamily) {
            fonts.add(fontFamily.split(',')[0].replace(/['"]/g, ''));
        }
    });
    
    return Array.from(fonts);
}

// Helper function to convert RGB to HEX
function rgbToHex(rgb) {
    if (rgb.startsWith('#')) return rgb;
    
    const rgbArray = rgb.match(/\d+/g);
    if (!rgbArray) return '';
    
    const r = parseInt(rgbArray[0]);
    const g = parseInt(rgbArray[1]);
    const b = parseInt(rgbArray[2]);
    
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze') {
        const analysis = {
            colors: extractColors(),
            fonts: extractFonts()
        };
        sendResponse(analysis);
    }
}); 