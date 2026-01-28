const SHEET_URLS = [
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSC7w4FegViquAyDj0CM1QhYDzArfQ626Fqjl3b3DCTLxYQY2s6GTaW8Lf7SOrDaRXTv5DXYT6SKF-/pub?output=csv',
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vROBQDswPvgzgIDM2avaO496XYU308PU6-dFXrbN9yaWsKbWnVvNDpLfpgH1BVNAfPCxhtF6CQ_wlkV/pub?output=csv'
];

document.addEventListener('DOMContentLoaded', () => {
    let allData = [];
    let loaded = 0;

    SHEET_URLS.forEach(url => {
        Papa.parse(url, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                allData = allData.concat(results.data);
                loaded++;
                if (loaded === SHEET_URLS.length) {
                    renderReferences(allData);
                }
            },
            error: function(error) {
                console.error("Error:", error);
                document.getElementById('references-container').innerHTML = '<p>Error loading links.</p>';
            }
        });
    });
});

function getLinkField(item) {
    if (!item) return '';
    
    const key = Object.keys(item).find(k => {
        const lower = k.toLowerCase().trim();
        return lower === 'References' || lower === 'reference' || lower === 'references';
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

    validItems.sort((a, b) => {
        const urlA = getLinkField(a);
        const urlB = getLinkField(b);        
        if (!urlA || !urlB) return 0;
        return urlA.toLowerCase().localeCompare(urlB.toLowerCase());
    });

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