// Store meals data
let meals = [];

// Page navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update report when showing report page
    if (pageId === 'reportPage') {
        updateReport();
    }
}

// Form submission
document.getElementById('mealForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('mealName').value;
    const type = document.getElementById('mealType').value;
    const time = document.getElementById('mealTime').value;
    
    // Get checked food types
    const includes = [];
    const checkboxes = ['grains', 'protein', 'vegetables', 'fruits', 'dairy', 'snacks'];
    checkboxes.forEach(item => {
        if (document.getElementById(item).checked) {
            includes.push(item);
        }
    });
    
    // Add meal to array
    meals.push({
        name: name,
        type: type,
        time: time,
        includes: includes
    });
    
    // Reset form
    this.reset();
    
    // Go back to homepage
    showPage('homepage');
    
    alert('Meal added successfully!');
});

// Update report page
function updateReport() {
    const recordsContainer = document.getElementById('mealRecords');
    const reportText = document.getElementById('reportText');
    
    if (meals.length === 0) {
        recordsContainer.innerHTML = '<p>No meals recorded yet.</p>';
        reportText.textContent = 'Today you ate 0 meals.';
        return;
    }
    
    recordsContainer.innerHTML = '';
    
    meals.forEach((meal, index) => {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-record';
        
        // Create food type indicators
        const indicators = meal.includes.map(item => 
            `<div class="food-dot ${item}" title="${item}"></div>`
        ).join('');
        
        mealDiv.innerHTML = `
            <div class="meal-time">${index + 1}. ${meal.time} - ${meal.type}</div>
            <div class="meal-name">${meal.name}</div>
            <div class="food-indicators">${indicators}</div>
        `;
        
        recordsContainer.appendChild(mealDiv);
    });
    
    // Generate report text
    const totalMeals = meals.length;
    reportText.textContent = `Today you ate ${totalMeals} meal${totalMeals !== 1 ? 's' : ''}.`;
}