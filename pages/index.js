import { useState, useEffect } from 'react';

export default function Popup() {
    const [analysis, setAnalysis] = useState({
        colors: [],
        fonts: []
    });
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        analyzeCurrentPage();
    }, []);

    const analyzeCurrentPage = async () => {
        setLoading(true);
        try {
            // Get the current active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            // Send message to content script
            const result = await chrome.tabs.sendMessage(tab.id, { action: 'analyze' });
            setAnalysis(result);
        } catch (error) {
            console.error('Error analyzing page:', error);
        }
        setLoading(false);
    };

    const copyToClipboard = () => {
        const text = `
Colors:
${analysis.colors.join('\n')}

Fonts:
${analysis.fonts.join('\n')}
        `;
        
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 w-80">
            <h1 className="text-2xl font-bold mb-4">StyleSpotter</h1>
            
            {loading ? (
                <div className="text-center py-4">Analyzing page...</div>
            ) : (
                <>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Colors</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {analysis.colors.map((color, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div 
                                        className="w-8 h-8 rounded border"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-sm mt-1">{color}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold mb-2">Fonts</h2>
                        <ul className="list-disc pl-4">
                            {analysis.fonts.map((font, index) => (
                                <li key={index} className="text-sm">{font}</li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={copyToClipboard}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                    >
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </>
            )}
        </div>
    );
} 