// PRODUCT DATA 
const productsContainer = document.getElementById("products-container");

// Product array with minimal icon-style images
const products = [
    {
        id: 1,
        name: "Apples",
        price: 20,
        description: "6 large apples",
        image: "https://cdn-icons-png.flaticon.com/128/415/415733.png"
    },
    {
        id: 2,
        name: "Burger",
        price: 25,
        description: "600g burger",
        image: "https://cdn-icons-png.flaticon.com/128/1046/1046784.png"
    },
    {
        id: 3,
        name: "Pop Corn",
        price: 18,
        description: "1 pack of pop corn",
        image: "https://cdn-icons-png.flaticon.com/128/1046/1046793.png"
    },
    {
        id: 4,
        name: "Coffee",
        price: 50,
        description: "300ml of coffee",
        image: "https://cdn-icons-png.flaticon.com/128/1046/1046800.png"
    }
];

//  COOKIE FUNCTIONS 
function getCookie(name) {
    let decoded = decodeURIComponent(document.cookie);
    let parts = decoded.split("; ");
    for (let part of parts) {
        if (part.startsWith(name + "=")) {
            return part.split("=")[1];
        }
    }
    return "";
}

// Login and store username in cookie
document.getElementById("login-btn").addEventListener("click", () => {
    const username = document.getElementById("username-input").value.trim();
    if (username !== "") {
        document.cookie = `username=${username}; path=/; max-age=31536000`; // 1 year
        showGreeting();
    }
});

// Show greeting using cookie
function showGreeting() {
    const username = getCookie("username");
    if (username) {
        document.getElementById("greeting").textContent = `Welcome back, ${username}!`;
        document.getElementById("login-section").classList.add("hidden");
    }
}

// CART SYSTEM 
let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];

// Render products on the page
function renderProducts() {
    productsContainer.innerHTML = "";

    products.forEach(product => {
        let div = document.createElement("div");
        div.classList.add("item");

        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Price: R${product.price}</p>
            <p>${product.description}</p>
            <button data-id="${product.id}" class="add-to-cart">Add To Cart</button>
        `;

        productsContainer.appendChild(div);
    });

    // Event delegation for Add to Cart buttons
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            addItem(Number(e.target.dataset.id));
        }
    });
}

// Add item to cart and update localStorage
function addItem(id) {
    let item = products.find(obj => obj.id === id);
    if (item) {
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Remove item from cart
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartDisplay();
}

// Render cart contents
function updateCartDisplay() {
    const cartContainer = document.getElementById("cart-container");
    const totalPrice = document.getElementById("total-price");

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        // Show message if cart is empty
        cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
        totalPrice.textContent = `Total Price: R0`;
        return;
    }

    cart.forEach(product => {
        const div = document.createElement("div");
        div.classList.add("bought-item");

        div.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: R${product.price}</p>
            <button data-id="${product.id}" class="remove-from-cart">Remove</button>
        `;
        cartContainer.appendChild(div);
    });

    // Update total price dynamically
    totalPrice.textContent = `Total Price: R${cart.reduce((t, x) => t + x.price, 0)}`;

    // Event delegation for Remove buttons
    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-from-cart")) {
            removeItem(Number(e.target.dataset.id));
        }
    });
}

// Function for changing visibility of main page and cart
function visibilityToggle() {
    document.getElementById("featured-products").classList.toggle("hidden");
    document.getElementById("cart-area").classList.toggle("hidden");
}

// Button for viewing cart
document.getElementById("view-cart-button").addEventListener("click", () => {
    visibilityToggle();
    updateCartDisplay();
});
// Button for return to main page from cart page
document.getElementById("close-cart").addEventListener("click", visibilityToggle);

// Clear cart completely
document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    localStorage.removeItem("cart");
    updateCartDisplay();
});

// FONT PREFERENCES (Session Storage) 
window.addEventListener("DOMContentLoaded", () => {
    let savedFont = sessionStorage.getItem("font"); // obtain font from session storage
    let fontSelect = document.getElementById("font-select");
    
    // Statement for checking if font is valid,applying the font to the page and assigning the dropdown the extracted value.
    if (savedFont) {
        document.body.style.fontFamily = savedFont;
        fontSelect.value = savedFont;
    }

    // an event listener for monitoring changes in the dropdown, assigning the value to the page and saving it in session storage
    fontSelect.addEventListener("change", () => {
        const newFont = fontSelect.value;
        document.body.style.fontFamily = newFont;
        sessionStorage.setItem("font", newFont);
    });

    // Show greeting if logged in
    showGreeting();
});

//  SERVICE WORKER REGISTRATION 
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(() => {
        const cacheNote = document.getElementById("cache-note");
        cacheNote.textContent = "Static content cached for faster loading!";
        cacheNote.classList.remove("hidden");
    });
}

// Initial render
renderProducts();
updateCartDisplay();

