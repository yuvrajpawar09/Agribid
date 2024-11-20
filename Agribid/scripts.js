let products = []; // List of all products
let bidHistory = []; // History of all bids
let currentUser = null; // Currently logged-in user

// Handle login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (username && password) {
        currentUser = { username, role };
        alert(`Logged in as ${role}`);
        showDashboard(role);
    } else {
        alert('Please enter valid credentials!');
    }
});

// Logout functionality
document.getElementById('logout-link').addEventListener('click', () => {
    currentUser = null;
    alert('Logged out successfully');
    resetView();
});

// Show appropriate dashboard
function showDashboard(role) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('logout-link').classList.remove('hidden');

    if (role === 'farmer') {
        document.getElementById('farmer-dashboard').classList.remove('hidden');
        displayFarmerProducts();
    } else if (role === 'vendor') {
        document.getElementById('vendor-dashboard').classList.remove('hidden');
        displayProductsForBidding();
        displayVendorBids();
    }
}

// Reset view to login screen
function resetView() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('logout-link').classList.add('hidden');
    document.getElementById('farmer-dashboard').classList.add('hidden');
    document.getElementById('vendor-dashboard').classList.add('hidden');
}

// Add product (Farmer only)
document.getElementById('add-product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);

    if (name && price) {
        products.push({ name, price, farmer: currentUser.username, bids: [] });
        alert(`${name} added successfully!`);
        displayFarmerProducts();
    }
});

// Display farmer's products
function displayFarmerProducts() {
    const farmerProductsList = document.getElementById('farmer-products-list');
    farmerProductsList.innerHTML = '';

    products.filter(p => p.farmer === currentUser.username).forEach((product, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${product.name} - ₹${product.price} 
            <button onclick="viewBids(${index})">View Bids</button>`;
        farmerProductsList.appendChild(li);
    });
}

// View bids for a specific product (Farmer only)
function viewBids(index) {
    const farmerBidDetailsList = document.getElementById('farmer-bid-details-list');
    farmerBidDetailsList.innerHTML = '';

    const product = products[index];
    product.bids.forEach(bid => {
        const li = document.createElement('li');
        li.innerText = `Vendor: ${bid.vendor} - ₹${bid.price} - Status: ${bid.status}`;
        farmerBidDetailsList.appendChild(li);
    });

    // Add option for Farmer to sell the product at highest bid
    const highestBid = product.bids.reduce((maxBid, bid) => bid.price > maxBid.price ? bid : maxBid, product.bids[0]);
    const sellButton = document.createElement('button');
    sellButton.textContent = 'Sell to Highest Bid';
    sellButton.onclick = function () {
        sellProductToHighestBid(index, highestBid);
    };
    farmerBidDetailsList.appendChild(sellButton);
}

// Sell product to the highest bid
function sellProductToHighestBid(productIndex, highestBid) {
    const product = products[productIndex];

    // Update bid status to "won" or "lost"
    product.bids.forEach(bid => {
        bid.status = bid.vendor === highestBid.vendor ? 'won' : 'lost';
    });

    alert(`Product ${product.name} sold to ${highestBid.vendor} for ₹${highestBid.price}`);
    displayFarmerProducts();
    displayVendorBids();
}

// Display products for vendors to bid on (include farmer name)
function displayProductsForBidding() {
    const vendorProductsList = document.getElementById('vendor-products-list');
    vendorProductsList.innerHTML = '';

    products.forEach((product, index) => {
        if (!product.bids.some((bid) => bid.vendor === currentUser.username)) {
            const li = document.createElement('li');
            li.innerHTML = `Product: ${product.name} - ₹${product.price} <br> 
                            Farmer: ${product.farmer} 
                            <button onclick="placeBid(${index})">Place Bid</button>`;
            vendorProductsList.appendChild(li);
        }
    });
}

// Place bid (Vendor)
function placeBid(index) {
    const price = parseFloat(prompt('Enter your bid price:'));
    if (price > 0) {
        const product = products[index];
        product.bids.push({ vendor: currentUser.username, price, status: 'pending' });
        alert(`Bid placed for ₹${price}`);
        displayVendorBids();
    }
}

// Display vendor's bids
function displayVendorBids() {
    const vendorBidDetailsList = document.getElementById('vendor-bid-details-list');
    vendorBidDetailsList.innerHTML = '';

    products.forEach(product => {
        product.bids.filter(bid => bid.vendor === currentUser.username).forEach(bid => {
            const li = document.createElement('li');
            li.innerText = `Product: ${product.name} - ₹${product.price} - 
                            Bid: ₹${bid.price} - Status: ${bid.status}`;
            vendorBidDetailsList.appendChild(li);
        });
    });
}
