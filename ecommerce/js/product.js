const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const loader = document.getElementById("loader");
const container = document.getElementById("productContainer");
const cartCount = document.getElementById("cartCount");
function getCart(){
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart){
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount(){

    let total = 0;
    getCart().forEach(item => total += item.quantity);
    cartCount.textContent = total;

}
updateCartCount();

function addToCart(product){
    let cart = getCart();
    const existing = cart.find(item => item.id == product.id);
    if(existing){

        existing.quantity++;

    }else{

        cart.push({
            id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            price: product.price,
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();
    alert("Added to Cart!");

}
async function loadProduct() {

    loader.style.display = "flex";
    const response = await fetch(
        `https://dummyjson.com/products/${id}`
    );

    const product = await response.json();
    loader.style.display = "none";

    const images = product.images
        .map(img =>
            `
            <img
            src="${img}"
            class="rounded-lg h-24 w-24 object-cover cursor-pointer border hover:scale-105 transition">
            `
        )
        .join("");

    const discounted =(
            product.price -
            (product.price * product.discountPercentage / 100)
        ).toFixed(2);

    container.innerHTML = `
<div class="bg-white rounded-3xl shadow-lg p-8 grid lg:grid-cols-2 gap-10">

<div>
<img
src="${product.thumbnail}"
class="rounded-xl w-full h-96 object-cover mb-5">
<div class="flex gap-3 flex-wrap">
${images}

</div>
</div>
<div>
<span class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded">
${product.category}

</span>
<h1 class="text-5xl font-bold mt-4">
${product.title}

</h1>
<p class="text-gray-500 mt-3">
${product.description}

</p>
<div class="mt-6 flex items-center gap-4">
<span class="text-4xl font-bold text-green-600">
$${discounted}

</span>
<span class="text-gray-400 line-through">
$${product.price}
</span>
</div>

<div class="mt-5 flex gap-5">
<span class="bg-yellow-100 px-3 py-2 rounded">
⭐ ${product.rating}

</span>
<span class="bg-green-100 px-3 py-2 rounded">
Stock : ${product.stock}
</span>

</div>
<div class="mt-5">

<p><strong>Brand:</strong> ${product.brand}</p>
<p><strong>Discount:</strong> ${product.discountPercentage.toFixed(0)}%</p>
<p><strong>Warranty:</strong> ${product.warrantyInformation || "Not Available"}</p>

<p><strong>Shipping:</strong> ${product.shippingInformation || "Fast Delivery"}</p>
</div>
<div class="mt-8 flex gap-4">
<button
id="cartBtn"
class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl">
Add To Cart

</button>
<a
href="cart.html"
class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl">

Buy Now
</a>
</div>
</div>
</div>

`;
document
.getElementById("cartBtn")
.addEventListener("click", () => {
addToCart(product);
});
}
loadProduct();