// calling inputs
const form = document.getElementById("product-form");
const inputname = document.getElementById("input-name");
const inputcategory = document.getElementById("input-category");
const inputsku = document.getElementById("input-sku");
const inputquantity = document.getElementById("input-quantity");
const inputprice = document.getElementById("input-price");

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

  console.log(products);

  inputname.value = "";
  inputcategory.value = "";
  inputsku.value = "";
  inputquantity.value = "";
  inputprice.value = "";
});
