// google sheet link
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRSC7w4FegViquAyDj0CM1QhYDzArfQ626Fqjl3b3DCTLxYQY2s6GTaW8Lf7SOrDaRXTv5DXYT6SKF-/pub?output=csv';

let allData = [];

document.addEventListener('DOMContentLoaded', () => {

    // fetch data
    Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            allData = results.data;
            console.log("Data loaded:", allData); 

            renderSpotlight(allData);
            renderList(allData);
        },
        error: function(error) {
            console.error("Error:", error);
            document.getElementById('resource-list').innerHTML = '<p>Error loading archives.</p>';
        }
    });

    // event listeners
    document.getElementById('search-btn').addEventListener('click', performSearch);
    
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') performSearch();
    });

    document.getElementById('clear-filters-btn').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-date-start').value = '';
        document.getElementById('filter-date-end').value = '';
        performSearch(); 
    });
});

// handle case sensitive
function getField(item, fieldName) {
    if (!item) return '';
    const key = Object.keys(item).find(k => k.toLowerCase() === fieldName.toLowerCase());
    return key ? item[key] : '';
}

// spotlight
function renderSpotlight(data) {
    const container = document.getElementById('spotlight-container');
    const list = document.getElementById('spotlight-list');

    const spotlightItems = data.filter(item => {
        const val = getField(item, 'spotlight');
        return val && val.toLowerCase() === 'true';
    }).slice(0, 3);

    if (spotlightItems.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    list.innerHTML = spotlightItems.map(item => {
        const location = getField(item, 'location'); 
        return `
        <div class="event-clipping">
            <h3>${getField(item, 'name') || 'Untitled'}</h3>
            <div class="event-date">
                ${getField(item, 'start date')}
                ${location ? `<br><span>@ ${location}</span>` : ''}
            </div>
            <p>${getField(item, 'description')}</p>
            <br>
            <a href="${getField(item, 'links') || '#'}" target="_blank" class="vintage-btn">View Details</a>
        </div>
        `;
    }).join('');
}

// events listeners
function renderList(data) {
    const list = document.getElementById('resource-list');

    if (data.length === 0) {
        list.innerHTML = '<div class="burnt-paper-card"><p align="center">No matching records found in the archives.</p></div>';
        return;
    }

    list.innerHTML = data.map(item => {
        const name = getField(item, 'name');
        if (!name) return ''; 

        const type = getField(item, 'type');
        const category = getField(item, 'category');
        const startDate = getField(item, 'start date');
        const endDate = getField(item, 'end date');
        const location = getField(item, 'location'); 

        return `
        <div class="burnt-paper-card">
            <div style="float: right; font-size: 0.8rem; text-transform: uppercase; border-bottom: 1px solid;">
                ${type} / ${category}
            </div>
            <h3>${name}</h3>
            
            <p style="font-style: italic; color: var(--highlight-color);">
                ${startDate} ${getField(item, 'start time')}
                ${endDate ? ' - ' + endDate : ''}
                ${location ? ` &nbsp;|&nbsp; <span>@ ${location}</span>` : ''}
            </p>

            <p>${getField(item, 'description')}</p>
            <p style="text-align: right;">
                 <a href="${getField(item, 'links') || '#'}" target="_blank" class="vintage-btn">View Details</a>
            </p>
        </div>
        `;
    }).join('');
}

// search/filter
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const typeFilter = document.getElementById('filter-type').value.toLowerCase();
    const catFilter = document.getElementById('filter-category').value.toLowerCase();
    
    const startInput = document.getElementById('filter-date-start').value ? new Date(document.getElementById('filter-date-start').value) : null;
    const endInput = document.getElementById('filter-date-end').value ? new Date(document.getElementById('filter-date-end').value) : null;

    if(startInput) startInput.setHours(0,0,0,0);
    if(endInput) endInput.setHours(23,59,59,999);

    const spotlightContainer = document.getElementById('spotlight-container');
    const isFiltering = searchTerm !== '' || typeFilter !== '' || catFilter !== '' || startInput || endInput;
    
    if (isFiltering) {
        spotlightContainer.style.display = 'none';
    } else {
        const hasSpotlight = allData.some(i => getField(i, 'spotlight')?.toLowerCase() === 'true');
        if (hasSpotlight) spotlightContainer.style.display = 'block';
    }

    const filtered = allData.filter(item => {
        const name = getField(item, 'name').toLowerCase();
        const desc = getField(item, 'description').toLowerCase();
        const loc = getField(item, 'location').toLowerCase();
        const matchesText = name.includes(searchTerm) || desc.includes(searchTerm) || loc.includes(searchTerm);

        const itemType = getField(item, 'type').toLowerCase();
        const itemCat = getField(item, 'category').toLowerCase();
        
        // Check if the selected filter value is contained within the item's type/category string
        const matchesType = typeFilter === '' || itemType.includes(typeFilter);
        const matchesCat = catFilter === '' || itemCat.includes(catFilter);

        let matchesDate = true;
        const itemDateStr = getField(item, 'start date');
        
        if (itemDateStr) {
            const itemDate = new Date(itemDateStr);
            itemDate.setHours(0,0,0,0); 

            if (startInput && itemDate < startInput) {
                matchesDate = false;
            }
            if (endInput && itemDate > endInput) {
                matchesDate = false;
            }
        }

        return matchesText && matchesType && matchesCat && matchesDate;
    });

    renderList(filtered);
}