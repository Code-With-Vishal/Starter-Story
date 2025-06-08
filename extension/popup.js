document.addEventListener('DOMContentLoaded', async () => {
    const contentDiv = document.getElementById('content');
    const hoverToggle = document.getElementById('hoverToggle');
    
    // Handle hover mode toggle
    hoverToggle.addEventListener('change', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, { 
            action: 'toggleHover',
            enable: hoverToggle.checked
        });
    });
    
    try {
        // Get the current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Send message to content script
        const analysis = await chrome.tabs.sendMessage(tab.id, { action: 'analyze' });
        
        // Update UI with results
        contentDiv.innerHTML = `
            <div class="section">
                <h2>Colors</h2>
                <div class="colors-grid">
                    ${analysis.colors.map(color => `
                        <div class="color-item" data-color="${color}">
                            <div class="color-swatch" style="background-color: ${color}"></div>
                            <span class="color-value">${color}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="section">
                <h2>Typography</h2>
                ${analysis.fonts.map(font => `
                    <div class="font-item">
                        <div class="font-name">${font.family}</div>
                        <div class="font-details">
                            <span>Size: ${font.size}</span>
                            <span>Weight: ${font.weight}</span>
                            <span>Line Height: ${font.lineHeight}</span>
                            <span>Letter Spacing: ${font.letterSpacing}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="button-container">
                <button id="copyButton">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 0H6C4.89543 0 4 0.89543 4 2V4H2C0.89543 4 0 4.89543 0 6V14C0 15.1046 0.89543 16 2 16H9C10.1046 16 11 15.1046 11 14V12H13C14.1046 12 15 11.1046 15 10V2C15 0.89543 14.1046 0 13 0Z" fill="currentColor"/>
                    </svg>
                    Copy to Clipboard
                </button>
                <button id="saveButton">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14 0H2C0.89543 0 0 0.89543 0 2V14C0 15.1046 0.89543 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.89543 15.1046 0 14 0Z" fill="currentColor"/>
                        <path d="M4 8L7 11L12 5" stroke="white" stroke-width="2"/>
                    </svg>
                    Save to Library
                </button>
            </div>
        `;
        
        // Add color copy functionality
        document.querySelectorAll('.color-item').forEach(item => {
            item.addEventListener('click', () => {
                const color = item.dataset.color;
                navigator.clipboard.writeText(color);
                
                // Show tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = 'Copied!';
                tooltip.style.left = `${item.offsetLeft}px`;
                tooltip.style.top = `${item.offsetTop - 30}px`;
                item.parentElement.appendChild(tooltip);
                
                setTimeout(() => tooltip.remove(), 1500);
            });
        });
        
        // Add copy all functionality
        document.getElementById('copyButton').addEventListener('click', () => {
            const text = `
Colors:
${analysis.colors.join('\n')}

Typography:
${analysis.fonts.map(font => `
${font.family}
- Size: ${font.size}
- Weight: ${font.weight}
- Line Height: ${font.lineHeight}
- Letter Spacing: ${font.letterSpacing}
`).join('\n')}
            `;
            
            navigator.clipboard.writeText(text);
            const button = document.getElementById('copyButton');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8L8 10L14 4" stroke="currentColor" stroke-width="2"/>
                </svg>
                Copied!
            `;
            setTimeout(() => {
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 0H6C4.89543 0 4 0.89543 4 2V4H2C0.89543 4 0 4.89543 0 6V14C0 15.1046 0.89543 16 2 16H9C10.1046 16 11 15.1046 11 14V12H13C14.1046 12 15 11.1046 15 10V2C15 0.89543 14.1046 0 13 0Z" fill="currentColor"/>
                    </svg>
                    Copy to Clipboard
                `;
            }, 2000);
        });
        
        // Add save functionality (using chrome.storage)
        document.getElementById('saveButton').addEventListener('click', async () => {
            const button = document.getElementById('saveButton');
            try {
                const data = {
                    url: tab.url,
                    timestamp: new Date().toISOString(),
                    colors: analysis.colors,
                    fonts: analysis.fonts
                };
                
                // Get existing saved data
                const result = await chrome.storage.local.get('savedStyles');
                const savedStyles = result.savedStyles || [];
                savedStyles.push(data);
                
                // Save updated data
                await chrome.storage.local.set({ savedStyles });
                
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 8L8 10L14 4" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Saved!
                `;
                setTimeout(() => {
                    button.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14 0H2C0.89543 0 0 0.89543 0 2V14C0 15.1046 0.89543 16 2 16H14C15.1046 16 16 15.1046 16 14V2C16 0.89543 15.1046 0 14 0Z" fill="currentColor"/>
                            <path d="M4 8L7 11L12 5" stroke="white" stroke-width="2"/>
                        </svg>
                        Save to Library
                    `;
                }, 2000);
            } catch (error) {
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM9 12H7V10H9V12ZM9 9H7V4H9V9Z" fill="currentColor"/>
                    </svg>
                    Error
                `;
            }
        });
        
    } catch (error) {
        contentDiv.innerHTML = `
            <div style="color: #d32f2f; padding: 16px; text-align: center;">
                Error analyzing page. Please refresh and try again.
            </div>
        `;
        console.error('Error:', error);
    }
}); 