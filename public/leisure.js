const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vROBQDswPvgzgIDM2avaO496XYU308PU6-dFXrbN9yaWsKbWnVvNDpLfpgH1BVNAfPCxhtF6CQ_wlkV/pub?output=csv';

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
        document.querySelectorAll('.multiselect-menu input[type="checkbox"]').forEach(cb => cb.checked = false);
        document.getElementById('filter-type-tags').innerHTML = '';
        document.getElementById('filter-category-tags').innerHTML = '';
        document.getElementById('filter-date-start').value = '';
        document.getElementById('filter-date-end').value = '';
        performSearch(); 
    });

    // Multi-select dropdown handlers
    setupMultiSelect('filter-type');
    setupMultiSelect('filter-category');
});

function setupMultiSelect(filterId) {
    const btn = document.getElementById(filterId + '-btn');
    const menu = document.getElementById(filterId + '-menu');
    const tagsContainer = document.getElementById(filterId + '-tags');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
    });

    menu.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateTags(filterId, tagsContainer, menu);
            performSearch();
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.multiselect-dropdown')) {
            menu.classList.remove('active');
        }
    });
}

function updateTags(filterId, tagsContainer, menu) {
    const checked = menu.querySelectorAll('input[type="checkbox"]:checked');
    const checkedArray = Array.from(checked);
    
    if (checkedArray.length === 0) {
        tagsContainer.innerHTML = '';
        return;
    }

    let html = `
        <div class="tag">
            ${checkedArray[0].value}
            <button type="button" onclick="removeTag(this, '${filterId}', '${checkedArray[0].value}')">×</button>
        </div>
    `;

    if (checkedArray.length > 1) {
        html += `<div class="tag-count">+${checkedArray.length - 1}</div>`;
    }

    tagsContainer.innerHTML = html;
}

function removeTag(btn, filterId, value) {
    const menu = document.getElementById(filterId + '-menu');
    const checkbox = Array.from(menu.querySelectorAll('input[type="checkbox"]')).find(cb => cb.value === value);
    if (checkbox) {
        checkbox.checked = false;
        updateTags(filterId, document.getElementById(filterId + '-tags'), menu);
        performSearch();
    }
}

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
    
    // Add Christmas lights after rendering
    addChristmasLights();
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
    
    const typeMenu = document.getElementById('filter-type-menu');
    const selectedTypes = Array.from(typeMenu.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value.toLowerCase());
    
    const categoryMenu = document.getElementById('filter-category-menu');
    const selectedCategories = Array.from(categoryMenu.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value.toLowerCase());
    
    const startInput = document.getElementById('filter-date-start').value ? new Date(document.getElementById('filter-date-start').value) : null;
    const endInput = document.getElementById('filter-date-end').value ? new Date(document.getElementById('filter-date-end').value) : null;

    if(startInput) startInput.setHours(0,0,0,0);
    if(endInput) endInput.setHours(23,59,59,999);

    const spotlightContainer = document.getElementById('spotlight-container');
    const isFiltering = searchTerm !== '' || selectedTypes.length > 0 || selectedCategories.length > 0 || startInput || endInput;
    
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
        
        const matchesType = selectedTypes.length === 0 || selectedTypes.some(type => itemType.includes(type));
        const matchesCat = selectedCategories.length === 0 || selectedCategories.some(cat => itemCat.includes(cat));

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

// Christmas Lights Animation
function addChristmasLights() {
    const spotlight = document.getElementById('spotlight-container');
    if (!spotlight) return;
    
    // Remove existing lights if any
    const existingLights = spotlight.querySelector('.christmas-lights');
    if (existingLights) existingLights.remove();

    // Create lights container
    const lightsContainer = document.createElement('div');
    lightsContainer.className = 'christmas-lights';
    
    const width = spotlight.offsetWidth;
    const height = spotlight.offsetHeight;
    
    const colors = ['yellow'];
    const spacing = 40;
    
    // Trace the exact black border outline
    const borderOffset = -10; // Offset to center and move left
    
    // Top lights - on the border line
    for (let x = 20; x < width; x += spacing) {
        createLight(lightsContainer, x, borderOffset, colors);
    }
    
    // Bottom lights - on the border line
    for (let x = 20; x < width; x += spacing) {
        createLight(lightsContainer, x, height + borderOffset, colors);
    }
    
    // Left lights - on the border line
    for (let y = 0; y <= height; y += spacing) {
        createLight(lightsContainer, borderOffset, y, colors);
    }
    
    // Right lights - on the border line
    for (let y = 0; y <= height; y += spacing) {
        createLight(lightsContainer, width + borderOffset, y, colors);
    }
    
    spotlight.appendChild(lightsContainer);
}

function createLight(container, x, y, colors) {
    const light = document.createElement('div');
    light.className = 'light ' + colors[Math.floor(Math.random() * colors.length)];
    light.style.left = x + 'px';
    light.style.top = y + 'px';
    container.appendChild(light);
}