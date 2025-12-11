const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSC7w4FegViquAyDj0CM1QhYDzArfQ626Fqjl3b3DCTLxYQY2s6GTaW8Lf7SOrDaRXTv5DXYT6SKF-/pub?output=csv';

document.addEventListener('DOMContentLoaded', () => {
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            renderReferences(results.data);
        },
        error: function(error) {
            console.error("Error:", error);
            document.getElementById('references-container').innerHTML = '<p>Error loading links.</p>';
        }
    });
});

function getLinkField(item) {
    if (!item) return '';
    
    const key = Object.keys(item).find(k => {
        const lower = k.toLowerCase().trim();
        return lower === 'links' || lower === 'link' || lower === 'url';
    });
    
    return key ? item[key] : '';
}

function renderReferences(data) {
    const container = document.getElementById('references-container');
    container.innerHTML = ''; 

    // filter out empty rows
    const validItems = data.filter(item => {
        const linkUrl = getLinkField(item);
        return linkUrl && linkUrl.trim() !== '';
    });

    if (validItems.length === 0) {
        container.innerHTML = '<p>No references found.</p>';
        return;
    }

    const htmlContent = validItems.map(item => {
        const url = getLinkField(item);
        
        return `
            <ul style="list-style: none; padding: 0; margin-bottom: 1.5rem;">
                <a href="${url}" target="_blank" style="word-break: break-all; font-weight: bold;">
                    ${url}
                </a>    
            </ul>
        `;
    }).join('');

    container.innerHTML = htmlContent;
}