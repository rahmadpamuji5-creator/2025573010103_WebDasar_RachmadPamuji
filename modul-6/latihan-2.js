const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");

// STATE KERANJANG
let cart = [];

// TAMBAH PRODUK
productList.addEventListener("click", function (e) {

  if (e.target.classList.contains("btn")) {

    const id = e.target.dataset.id;
    const name = e.target.dataset.name;
    const price = Number(e.target.dataset.price);

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
      existingItem.qty++;
    } else {
      cart.push({
        id,
        name,
        price,
        qty: 1
      });
    }

    renderCart();
  }
});

// RENDER KERANJANG
function renderCart() {

  cartItems.innerHTML = "";

  let total = 0;
  let totalItems = 0;

  cart.forEach(item => {

    total += item.price * item.qty;
    totalItems += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">

        <h4>${item.name}</h4>

        <p>
          Rp ${item.price.toLocaleString()} x ${item.qty}
        </p>

        <div class="qty-control">

          <button class="qty-btn minus" data-id="${item.id}">
            -
          </button>

          <span>${item.qty}</span>

          <button class="qty-btn plus" data-id="${item.id}">
            +
          </button>

        </div>

        <button class="remove-btn" data-id="${item.id}">
          Hapus
        </button>

      </div>
    `;
  });

  totalPrice.textContent = total.toLocaleString();
  cartCount.textContent = totalItems;
}

// EVENT KERANJANG
cartItems.addEventListener("click", function (e) {

  const id = e.target.dataset.id;

  // TAMBAH JUMLAH
  if (e.target.classList.contains("plus")) {

    const item = cart.find(item => item.id === id);
    item.qty++;

    renderCart();
  }

  // KURANG JUMLAH
  if (e.target.classList.contains("minus")) {

    const item = cart.find(item => item.id === id);

    if (item.qty > 1) {
      item.qty--;
    }

    renderCart();
  }

  // HAPUS ITEM
  if (e.target.classList.contains("remove-btn")) {

    cart = cart.filter(item => item.id !== id);

    renderCart();
  }
});

// CHECKOUT
checkoutBtn.addEventListener("click", function () {

  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  let summary = "=== RINGKASAN ORDER ===\n\n";

  cart.forEach(item => {
    summary += `
${item.name} (${item.qty}) = Rp ${(item.price * item.qty).toLocaleString()}
`;
  });

  summary += `\nTotal: Rp ${totalPrice.textContent}`;

  alert(summary);
});