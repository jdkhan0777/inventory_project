// calling inputs
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

let products = [];

// Calling buttons
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = inputname.value;
  const category = inputcategory.value;
  const sku = inputsku.value;
  const quantity = Number(inputquantity.value);
  const price = Number(inputprice.value);

  const product = {
    name: name,
    category: category,
    sku: sku,
    quantity: quantity,
    price: price,
  };

  products.push(product);

  if (name === "" || category === "" || sku === "" || quantity === "" || price === "") {
    alert("Please fill in all fields.");
    return;
  }

  console.log(products);

  inputname.value = "";
  inputcategory.value = "";
  inputsku.value = "";
  inputquantity.value = "";
  inputprice.value = "";
  updates();
});

function updates(){
  products.innerHTML = "";

  let total = 0;
  let total_prices = 0; 
  let total_stock_count = 0; 
  let low_stock_count = 0;
  
  
  for (let i of products){
    total += i.quantity;
    total_prices += i.price * i.quantity;
    total_stock_count += i.quantity;

    if (i.quantity <= 5) {
      // Do something for low stock items
      low_stock_count++;
    }
  }
  total_products.textContent = total;
  total_price.textContent = "£" + total_prices.toFixed(2);
  total_stock.textContent = total_stock_count;
  low_stock.textContent = low_stock_count;

}


// form-card

const formCard = document.getElementById("form-card");
const cancelBtn = document.getElementById("cancel-button");
const addBtn = document.getElementById("add-btns");
const closeBtn = document.getElementById("close-btn");

addBtn.addEventListener("click", function () {
  formCard.classList.remove("hidden");
 
});

cancelBtn.addEventListener("click", function () {
  formCard.classList.add("hidden");
});

// closeBtn.addEventListener("click", function () {
//   formCard.classList.add("hidden");
// });



