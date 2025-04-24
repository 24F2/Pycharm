document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.classList.add('hidden');
        observer.observe(card);
    });
});

let cart = [];

// Load cart from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
});

function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: parseFloat(productPrice) });
    saveCart();
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => {
            cart.splice(index, 1);
            saveCart();
            updateCart();
        };
        li.appendChild(removeButton);
        cartItems.appendChild(li);
        total += item.price;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    alert("Proceeding to checkout...");
    // Add checkout logic here (e.g., redirect to a payment page).
}

function expandCart() {
    document.querySelector('.cart-container').classList.remove('hidden');
    document.querySelector('.cart-container').classList.add('visible');
}

function collapseCart() {
    document.querySelector('.cart-container').classList.remove('visible');
    document.querySelector('.cart-container').classList.add('hidden');
}