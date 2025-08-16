document.addEventListener('DOMContentLoaded', function() {
    // Initialize product page
    initProductPage();
});

function initProductPage() {
    // Load product data
    loadProductData();
    
    // Initialize gallery
    initImageGallery();
    
    // Set up event listeners
    setupEventListeners();
}

function loadProductData() {
    // In a real app, this would be an API call based on URL parameter
    const productId = new URLSearchParams(window.location.search).get('id') || 1;
    
    const mockProduct = {
        id: productId,
        name: "Premium Wireless Earbuds Pro",
        price: 149.99,
        originalPrice: 199.99,
        description: "Experience crystal-clear sound with active noise cancellation and 30-hour battery life.",
        features: [
            "Active Noise Cancellation",
            "30-hour battery life",
            "IPX7 Waterproof",
            "Wireless charging case"
        ],
        images: [
            "earbuds-main.jpg",
            "earbuds-angle.jpg",
            "earbuds-case.jpg"
        ],
        rating: 4.7,
        reviewCount: 1243,
        stock: 15
    };
    
    // Render product details
    renderProductDetails(mockProduct);
    
    // Load recommended products
    loadRecommendedProducts(mockProduct.id);
}

function renderProductDetails(product) {
    // Basic info
    document.querySelector('.product-title').textContent = product.name;
    document.querySelector('.product-price').textContent = formatPrice(product.price);
    
    if (product.originalPrice) {
        document.querySelector('.original-price').textContent = formatPrice(product.originalPrice);
        const discount = Math.round((1 - product.price/product.originalPrice) * 100);
        document.querySelector('.discount-badge').textContent = `${discount}% OFF`;
    } else {
        document.querySelector('.original-price').style.display = 'none';
        document.querySelector('.discount-badge').style.display = 'none';
    }
    
    // Description
    document.querySelector('.product-description').textContent = product.description;
    
    // Features
    const featuresList = document.querySelector('.features-list');
    featuresList.innerHTML = product.features.map(feat => `
        <li class="feature-item">
            <i class="fas fa-check-circle me-2 text-success"></i>
            ${feat}
        </li>
    `).join('');
    
    // Rating
    document.querySelector('.rating-stars').innerHTML = renderStars(product.rating);
    document.querySelector('.rating-count').textContent = `${product.rating} (${product.reviewCount} reviews)`;
    
    // Stock status
    const stockElement = document.querySelector('.stock-status');
    if (product.stock > 5) {
        stockElement.innerHTML = `<i class="fas fa-check-circle text-success me-2"></i> In Stock`;
    } else if (product.stock > 0) {
        stockElement.innerHTML = `<i class="fas fa-exclamation-circle text-warning me-2"></i> Only ${product.stock} left!`;
    } else {
        stockElement.innerHTML = `<i class="fas fa-times-circle text-danger me-2"></i> Out of Stock`;
    }
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    
    return stars;
}

function initImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            mainImage.src = this.src;
            mainImage.alt = this.alt;
            
            // Add fade effect
            mainImage.classList.add('fade-out');
            setTimeout(() => {
                mainImage.classList.remove('fade-out');
            }, 300);
        });
    });
}

function loadRecommendedProducts(currentProductId) {
    // In a real app, this would be an API call
    const mockRecommended = [
        {
            id: 2,
            name: "Earbud Silicone Tips (Set of 3)",
            price: 12.99,
            image: "earbud-tips.jpg",
            rating: 4.2
        },
        {
            id: 3,
            name: "Wireless Charging Pad",
            price: 29.99,
            image: "charging-pad.jpg",
            rating: 4.5
        }
    ];
    
    renderRecommendedProducts(mockRecommended);
}

function renderRecommendedProducts(products) {
    const container = document.querySelector('.recommended-products');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="col-md-6">
            <div class="card mb-3 card-lift">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="assets/${product.image}" class="img-fluid rounded-start" alt="${product.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <p class="card-text text-primary fw-bold mb-0">$${product.price.toFixed(2)}</p>
                                <span class="text-warning">
                                    <i class="fas fa-star"></i> ${product.rating}
                                </span>
                            </div>
                            <button class="btn btn-sm btn-primary mt-2 w-100 add-to-cart" data-id="${product.id}">
                                <i class="fas fa-cart-plus me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupEventListeners() {
    // Quantity selector
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = document.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (this.classList.contains('minus') && value > 1) {
                input.value = value - 1;
            } else if (this.classList.contains('plus') && value < 10) {
                input.value = value + 1;
            }
        });
    });
    
    // Add to cart
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const productId = parseInt(button.dataset.id);
            const quantity = parseInt(document.querySelector('.quantity-input').value);
            
            addToCart(productId, quantity);
        }
    });
    
    // Wishlist button
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.classList.replace('far', 'fas');
                showToast('Added to wishlist', 'success');
            } else {
                icon.classList.replace('fas', 'far');
                showToast('Removed from wishlist', 'info');
            }
        });
    }
}

function addToCart(productId, quantity = 1) {
    // In a real app, this would be an API call
    console.log(`Added ${quantity} of product ${productId} to cart`);
    showToast('Item added to cart', 'success');
    
    // Animate cart icon in navbar if it exists
    const cartIcon = document.querySelector('.navbar-cart');
    if (cartIcon) {
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 1000);
    }
}