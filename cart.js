const cartContainer = document.getElementById("cartItems");
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
    let cart = getCart();
    cartContainer.innerHTML = "";
    if (cart.length === 0) {

        cartContainer.innerHTML = `
        <div class="bg-white rounded-xl shadow p-10 text-center">

        <h1 class="text-4xl font-bold mb-4">
        Your Cart is Empty
        </h1>
        <a
        href="index.html"
        class="bg-indigo-600 text-white px-6 py-3 rounded-xl">
        Continue Shopping

        </a>

        </div>
        `;
        document.getElementById("itemCount").textContent = 0;
        document.getElementById("subtotal").textContent = "$0";
        document.getElementById("discount").textContent = "$0";
        document.getElementById("total").textContent = "$0";
        return;
    }
    let subtotal = 0;
    let items = 0;

    cart.forEach(product => {

        subtotal += product.price * product.quantity;
        items += product.quantity;
        const card = document.createElement("div");
        card.className =
            "bg-white rounded-xl shadow p-5 flex flex-col md:flex-row gap-5";
        card.innerHTML = `

<img
src="${product.thumbnail}"
class="w-40 h-40 rounded-xl object-cover">
<div class="flex-1">
<h2 class="text-2xl font-bold">
${product.title}
</h2>

<p class="text-gray-500 mt-2">
$${product.price}

</p>
<div class="flex gap-3 items-center mt-5">
<button
class="minus bg-red-500 text-white px-3 rounded">

-
</button>
<span class="font-bold">
${product.quantity}

</span>
<button
class="plus bg-green-500 text-white px-3 rounded">

+
</button>
<button
class="remove ml-5 text-red-600">
Remove

</button>
</div>
</div>
`;
        card.querySelector(".plus").onclick = () => {
            product.quantity++;

            saveCart(cart);
            updateCart();

        };
        card.querySelector(".minus").onclick = () => {
            if (product.quantity > 1) {
                product.quantity--;

            }
            saveCart(cart);
            updateCart();

        };
        card.querySelector(".remove").onclick = () => {
            cart = cart.filter(item => item.id !== product.id);
            saveCart(cart);
            updateCart();

        };
        cartContainer.appendChild(card);
    });

    const discount = subtotal * 0.10;
    const delivery = 20;

    const total = subtotal - discount + delivery;
    document.getElementById("itemCount").textContent = items;

    document.getElementById("subtotal").textContent =
        "$" + subtotal.toFixed(2);

    document.getElementById("discount").textContent =
        "-$" + discount.toFixed(2);
    document.getElementById("total").textContent =
        "$" + total.toFixed(2);

}
const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", () => {

    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("🎉 Order placed successfully!");

    localStorage.removeItem("cart");

    updateCart();

});

updateCart();