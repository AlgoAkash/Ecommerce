const API = "https://dummyjson.com/products?limit=194";
const productContainer = document.getElementById("products");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("search");
const cartCount = document.getElementById("cartCount");
let allProducts = [];



function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
}

updateCartCount();

function addToCart(product) {

    let cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            quantity: 1
        });
    }
    saveCart(cart);
    updateCartCount();
    alert(`${product.title} added to cart!`);

}


function createCard(product) {
    const discountPrice =
        (
            product.price -
            (product.price * product.discountPercentage / 100)
        ).toFixed(2);
    const card = document.createElement("div");

    card.className =
        "bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300";

    card.innerHTML = `
        <img
            src="${product.thumbnail}"
            class="w-full h-56 object-cover cursor-pointer"
        >
        <div class="p-5">

            <span class="text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                ${product.category}
            </span>

            <h2 class="font-bold text-lg mt-3">
                ${product.title}
            </h2>

            <p class="text-gray-500 mt-1">
                ${product.brand}
            </p>
            <div class="flex items-center gap-2 mt-3">

                <span class="text-2xl font-bold text-green-600">

                    $${discountPrice}
                </span>

                <span class="line-through text-gray-400">
                    $${product.price}
                </span>
            </div>

            <div class="flex justify-between items-center mt-4">

                <span
                    class="bg-yellow-100 px-2 py-1 rounded">

                    ⭐ ${product.rating}
                </span>
                <span
                    class="text-red-500 font-semibold">
                    ${product.discountPercentage.toFixed(0)}% OFF
                </span>
            </div>
            <button
                class="cartBtn mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
                Add To Cart
            </button>
        </div>

    `;

    card.querySelector("img").onclick = () => {
        window.location.href =
            `product.html?id=${product.id}`;

    };
    card.querySelector(".cartBtn").onclick = () => {
        addToCart(product);

    };
    return card;
}


function displayProducts(products) {

    productContainer.innerHTML = "";

    products.forEach(product => {

        productContainer.appendChild(createCard(product));

    });
}


async function loadProducts() {

    loader.style.display = "flex";
    try {

        const response = await fetch(API);
        const data = await response.json();
        allProducts = data.products;
        displayProducts(allProducts);

    } catch (error) {
        productContainer.innerHTML = `
            <h1 class="text-red-500 text-3xl">
                Failed to load products.
            </h1>
        `;
    }
    loader.style.display = "none";
}

loadProducts();


searchInput.addEventListener("keyup", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = allProducts.filter(product =>
        product.title.toLowerCase().includes(value) ||
        product.brand.toLowerCase().includes(value) ||
        product.category.toLowerCase().includes(value)
    );
    displayProducts(filtered);
});