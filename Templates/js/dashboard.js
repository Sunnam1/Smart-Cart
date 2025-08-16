document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initDashboard();
    
    // Set up real-time updates
    setupRealTimeUpdates();
});

function initDashboard() {
    // Load user data
    loadUserData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize recommendation sections
    initRecommendationSections();
}

function loadUserData() {
    // In a real app, this would be an API call
    const mockUser = {
        name: "Alex Johnson",
        location: "New York",
        interests: ["electronics", "fitness", "home"],
        recentActivity: [
            { type: "view", productId: 1, time: "2 hours ago" },
            { type: "purchase", productId: 3, time: "1 day ago" }
        ]
    };
    
    // Update UI with user data
    updateUserProfile(mockUser);
}

function updateUserProfile(user) {
    // Update user name
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        el.textContent = user.name;
    });
    
    // Update location
    const locationElements = document.querySelectorAll('.user-location');
    locationElements.forEach(el => {
        el.textContent = user.location;
    });
    
    // Update interests
    const interestsContainer = document.querySelector('.interest-tags');
    if (interestsContainer) {
        interestsContainer.innerHTML = user.interests.map(interest => `
            <span class="badge bg-primary me-1 mb-1">${interest}
                <button class="btn-remove-tag"><i class="fas fa-times"></i></button>
            </span>
        `).join('');
    }
}

function initRecommendationSections() {
    // Mock data - replace with API calls
    const mockProducts = [
        {
            id: 1,
            name: "Wireless Earbuds Pro",
            price: 149.99,
            image: "earbuds.jpg",
            rating: 4.5,
            category: "electronics",
            matchScore: 0.85
        },
        {
            id: 2,
            name: "Smart Fitness Watch",
            price: 199.99,
            image: "smartwatch.jpg",
            rating: 4.2,
            category: "fitness",
            matchScore: 0.78
        },
        // Add more products...
    ];
    
    // Render each recommendation section
    renderRecommendationSection('history-recs', filterProducts(mockProducts, 'electronics'), "Based on your interest in Electronics");
    renderRecommendationSection('trending-recs', filterProducts(mockProducts, 'fitness'), "Trending in Fitness");
    renderRecommendationSection('location-recs', filterProducts(mockProducts).slice(0, 4), "Popular in New York");
}

function filterProducts(products, category) {
    if (!category) return products;
    return products.filter(p => p.category === category);
}

function renderRecommendationSection(elementId, products, title) {
    const container = document.getElementById(elementId);
    if (!container) return;
    
    // Show skeleton loading first
    container.innerHTML = `
        <div class="col-12">
            <div class="skeleton" style="height: 300px;"></div>
        </div>
    `;
    
    // Simulate API delay
    setTimeout(() => {
        if (products.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-4">
                    <i class="fas fa-info-circle me-2"></i>
                    No recommendations available
                </div>
            `;
            return;
        }
        
        container.innerHTML = products.map(product => `
            <div class="col-md-6 col-lg-3 mb-4">
                <div class="card product-card h-100 card-lift">
                    ${product.matchScore ? `
                    <div class="match-badge">
                        ${Math.round(product.matchScore * 100)}% Match
                    </div>
                    ` : ''}
                    <img src="assets/${product.image}" class="card-img-top p-3" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-primary fw-bold">$${product.price.toFixed(2)}</span>
                            <span class="text-warning">
                                <i class="fas fa-star"></i> ${product.rating}
                            </span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <button class="btn btn-sm btn-outline-primary me-2 quick-view" data-id="${product.id}">
                            Quick View
                        </button>
                        <button class="btn btn-sm btn-primary add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }, 800);
}

function setupEventListeners() {
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const productId = parseInt(button.dataset.id);
            addToCart(productId);
        }
    });
    
    // Quick view functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.quick-view')) {
            const button = e.target.closest('.quick-view');
            const productId = parseInt(button.dataset.id);
            showQuickView(productId);
        }
    });
}

function addToCart(productId) {
    // In a real app, this would be an API call
    console.log(`Added product ${productId} to cart`);
    showToast('Item added to cart', 'success');
    updateCartCount();
    animateAddToCart();
}

function showQuickView(productId) {
    // In a real app, this would show a modal or redirect
    console.log(`Showing quick view for product ${productId}`);
    showToast('Opening product details', 'info');
}

function updateCartCount() {
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => {
        const currentCount = parseInt(el.textContent) || 0;
        el.textContent = currentCount + 1;
        el.classList.add('bounce');
        setTimeout(() => el.classList.remove('bounce'), 1000);
    });
}

function animateAddToCart() {
    // Add animation class to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 1000);
    }
}

function setupRealTimeUpdates() {
    // Simulate real-time updates every 30 seconds
    setInterval(() => {
        console.log('Checking for new recommendations...');
        // In a real app, this would fetch new data
    }, 30000);
    
    // Update time-based elements every minute
    setInterval(() => {
        updateTimeElements();
    }, 60000);
}

function updateTimeElements() {
    const hour = new Date().getHours();
    let timeOfDay;
    
    if (hour < 12) timeOfDay = "Morning";
    else if (hour < 18) timeOfDay = "Afternoon";
    else timeOfDay = "Evening";
    
    document.querySelectorAll('.time-of-day').forEach(el => {
        el.textContent = timeOfDay;
    });
}