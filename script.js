// =========================
// GET ELEMENTS
// =========================
const form = document.getElementById("product-form");
const inputname = document.getElementById("input-name");
const inputcategory = document.getElementById("input-category");
const inputsku = document.getElementById("input-sku");
const inputquantity = document.getElementById("input-quantity");
const inputprice = document.getElementById("input-price");

const total_products = document.getElementById("total");
const total_price = document.getElementById("price");
const total_stock = document.getElementById("instock");
const low_stock = document.getElementById("lowstock");
const number_of_products = document.getElementById("product_number");

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("img-preview");

const product_section = document.getElementById("product-section");

// modal controls
const modal = document.getElementById("form-card");
const addBtn = document.getElementById("add-btns");
const cancelBtn = document.getElementById("cancel-button");
const searchinput = document.getElementById("search-input");

let products = [];
let selectedimage = "";
let editingId = null;
// =========================
// Adding local storage to save products data even after refreshing the page
// ===========================
// function saveToLocalStorage() {
//   localStorage.setItem("products", JSON.stringify(products));
// }

// function get fetchProducts()
async function loadProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();

    products = data; // update state
    renderProducts();
    updates();
  } catch (err) {
    console.error(err);
  }
}

// =========================
// MODAL FUNCTIONS
// =========================
function openModal() {
  modal.classList.remove("hiddens");
}

function closeModal() {
  modal.classList.add("hiddens");
}

function resetForm() {
  form.reset();
  imageInput.value = "";
  imagePreview.src = "";
  imagePreview.classList.add("hidden");
  selectedimage = "";
  editingId = null;
}

// =========================
// OPEN / CLOSE MODAL
// =========================
addBtn.addEventListener("click", () => {
  resetForm();
  openModal();
});

cancelBtn.addEventListener("click", () => {
  closeModal();
});

// close only if user clicks background
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// =========================
// IMAGE PREVIEW + SAVE
// =========================
imageInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove("hidden");

  const reader = new FileReader();

  reader.onload = function (e) {
    selectedimage = e.target.result;
  };

  reader.readAsDataURL(file);
});

// =========================
// FORM SUBMIT (ADD + EDIT)
// =========================
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = inputname.value.trim();
  const category = inputcategory.value.trim();
  const sku = inputsku.value.trim();
  const quantity = Number(inputquantity.value);
  const price = Number(inputprice.value);

  if (!name || !category || !sku || quantity <= 0 || price <= 0) {
    alert("Please fill in all fields correctly.");
    return;
  }

  if (editingId !== null) {
    const updatedProduct = {
      // _id: editingId,
      name,
      category,
      sku,
      quantity,
      price,
      image: selectedimage,
    };

    await fetch(`http://localhost:5000/api/products/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    loadProducts();
    closeModal();
    resetForm();
    return;
  }

  const product = {
    // _id: Date.now(),
    name,
    category,
    sku,
    quantity,
    price,
    image: selectedimage || imagePreview.src, 
  };

  // post product to backend
  await fetch("http://localhost:5000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }); 

  loadProducts();
  closeModal();
  resetForm();

  // console.log("Adding product:", product)
});

// =========================
// UPDATES
// =========================
function updates() {
  total_products.textContent = products.length;

  total_price.textContent =
    "£" + products.reduce((acc, p) => acc + p.price * p.quantity, 0).toFixed(2);

  total_stock.textContent = products.reduce((acc, p) => acc + p.quantity, 0);

  low_stock.textContent = products.filter((p) => p.quantity < 5).length;
  number_of_products.textContent = `Showing ${products.length} of ${products.length} products`;
}

// filter listener products based on search query

searchinput.addEventListener("input", renderProducts);
// =========================
// RENDER PRODUCTS
// =========================
function renderProducts() {
  product_section.innerHTML = "";

  //  filter products with search query and render those instead
  const query = searchinput.value.toLowerCase();

  const filteredProducts = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    );
  });

  for (const product of filteredProducts) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
      <div class="buttons-edit-delete">
        <button class="edit-btn" data-id="${product._id}">
          <img src="/icons/edit.svg" alt="edit" />
        </button>

        <button class="delete-btn" data-id="${product._id}">
          <img src="/icons/trash.svg" alt="delete" />
        </button>
      </div>

      <div class="product-image">
        <img src="${product.image || "/items/nature.jpg"}" alt="${product.name}" />
      </div>

      <div class="product-content">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-sku">SKU: ${product.sku}</p>
        <p class="product-category">Category: ${product.category}</p>
      </div>

      <div class="product-stats">
        <div class="product-stats-left">
          <h3>Price</h3>
          <p>£${product.price.toFixed(2)}</p>
        </div>

        <div class="product-stats-right">
          <h3>Quantity</h3>
          <p>${product.quantity}</p>
        </div>
      </div>

      <div class="product-total">
        <h2>Total Value</h2>
        <p>£${(product.price * product.quantity).toFixed(2)}</p>
      </div>
    `;

    product_section.appendChild(productCard);
  }
}

// =========================
// DELETE PRODUCT
// =========================
document.addEventListener("click", async (e) => {
  const deleteBtn = e.target.closest(".delete-btn");

  if (!deleteBtn) return;

  const id = deleteBtn.dataset.id;

  await fetch(`http://localhost:5000/api/products/${id}`, {
    method: "DELETE",
  });

  loadProducts();
});

// =========================
// EDIT PRODUCT
// =========================
document.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  const id = editBtn.dataset.id;

  const product = products.find((p) => p._id === id);
  if (!product) return;

  inputname.value = product.name;
  inputcategory.value = product.category;
  inputsku.value = product.sku;
  inputquantity.value = product.quantity;
  inputprice.value = product.price;

  imagePreview.src = product.image || "";
  if (product.image) {
    imagePreview.classList.remove("hidden");
  } else {
    imagePreview.classList.add("hidden");
  }

  selectedimage = product.image;
  editingId = id;

  openModal();
});

loadProducts();
