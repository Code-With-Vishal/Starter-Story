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
        const styles = window.getComputedStyle(element);
        const fontFamily = styles.fontFamily;
        const fontSize = styles.fontSize;
        const fontWeight = styles.fontWeight;
        const lineHeight = styles.lineHeight;
        const letterSpacing = styles.letterSpacing;
        
        if (fontFamily) {
            const fontInfo = {
                family: fontFamily.split(',')[0].replace(/['"]/g, ''),
                size: fontSize,
                weight: fontWeight,
                lineHeight: lineHeight,
                letterSpacing: letterSpacing
            };
            fonts.add(JSON.stringify(fontInfo));
        }
    });
    
    return Array.from(fonts).map(f => JSON.parse(f));
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

// Create and manage tooltip
function createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.id = 'stylespotter-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 4px;
        font-size: 12px;
        z-index: 999999;
        pointer-events: none;
        display: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(tooltip);
    return tooltip;
}

// Show tooltip with style information
function showTooltip(e) {
    const tooltip = document.getElementById('stylespotter-tooltip') || createTooltip();
    const styles = window.getComputedStyle(e.target);
    
    const color = styles.color;
    const bgColor = styles.backgroundColor;
    const fontFamily = styles.fontFamily.split(',')[0].replace(/['"]/g, '');
    const fontSize = styles.fontSize;
    const fontWeight = styles.fontWeight;
    const lineHeight = styles.lineHeight;
    const letterSpacing = styles.letterSpacing;
    
    let tooltipContent = '';
    
    // Only show colors if they're not transparent
    if (color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
        tooltipContent += `Color: ${rgbToHex(color)}<br>`;
    }
    if (bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
        tooltipContent += `Background: ${rgbToHex(bgColor)}<br>`;
    }
    
    tooltipContent += `
        Font: ${fontFamily}<br>
        Size: ${fontSize}<br>
        Weight: ${fontWeight}<br>
        Line Height: ${lineHeight}<br>
        Letter Spacing: ${letterSpacing}
    `;
    
    tooltip.innerHTML = tooltipContent;
    tooltip.style.display = 'block';
    
    // Position tooltip near cursor
    const x = e.pageX + 15;
    const y = e.pageY + 15;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.getElementById('stylespotter-tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Initialize hover functionality
function initializeHover() {
    document.addEventListener('mousemove', showTooltip);
    document.addEventListener('mouseout', hideTooltip);
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyze') {
        const analysis = {
            colors: extractColors(),
            fonts: extractFonts()
        };
        sendResponse(analysis);
    } else if (request.action === 'toggleHover') {
        if (request.enable) {
            initializeHover();
        } else {
            document.removeEventListener('mousemove', showTooltip);
            document.removeEventListener('mouseout', hideTooltip);
            hideTooltip();
        }
        sendResponse({ success: true });
    }
    return true; // Required for async response
}); 