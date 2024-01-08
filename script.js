/* Const variable */
const LOCALSTORAGE_CART = "LOCALSTORAGE_CART";
const ADD_PRODUCT = "ADD_PRODUCT";
const REMOVE_PRODUCT = "REMOVE_PRODUCT";
const DELETE_PRODUCT = "DELETE_PRODUCT";

/* dom veriable */
let listProductHTML = document.querySelector(".listProduct");
let listCartHTML = document.querySelector("#listCart");
let cartIcon = document.querySelector("#cart-icon");
let cartContainer = document.querySelector("#cart");
let closeCart = document.querySelector("#cart-close");
let totalCartItem = document.querySelector("#total-cart-item");
let totalItems = document.querySelector("#total-items");
let totalPriceHtml = document.querySelector("#total-price");
let totalProductsHtml = document.querySelector("#total-products");
let addToCartBtns;

/**
 * Product items
 */
let products = [];
/** Cart items  */
let cart = [];

cartIcon.addEventListener("click", () => {
  cartContainer.classList.toggle("active");
});

closeCart.addEventListener("click", () => {
  cartContainer.classList.toggle("active");
});

/**
 * Add Product to html container
 */
const addProductToHTML = () => {
  if (products.length > 0) {
    // if data has
    products.forEach((product) => {
      let newProduct = document.createElement("div");

      newProduct.dataset.id = product.id;
      newProduct.classList.add(
        "max-w-md",
        "mx-auto",
        "bg-white",
        "p-6",
        "rounded-md",
        "shadow-md",
        "item"
      );
      newProduct.innerHTML = `
            <img
            src=${product.image}
            alt=${product.name}
            class="mb-4 rounded-md"
          />

          <h2 class="text-xl font-semibold mb-2">${product.name}</h2>
          <p class="text-gray-600 mb-4">Product description goes here.</p>

          <p class="text-gray-800 font-bold mb-4">$${product.price}</p>

          <button
            
            class="defaultBgColor text-white px-4 py-2 rounded-md w-full addToCartBtn"
            onclick="addToCartHandler(event)"
          >
            Add to Cart
          </button>
            `;

      listProductHTML.appendChild(newProduct);
    });
  }
  // get all add to cart button.
  addToCartBtns = document.querySelectorAll(".addToCartBtn");
  disableAddToCartBtn();
};

const addToCartHandler = (e) => {
  let id_of_product = e.target.parentElement.dataset.id;

  // add item to product cart
  addToCart(id_of_product);
};

/**
Add product to cart array
*/
const addToCart = (product_id) => {
  let isAvailableProductIdIntoCart = cart.findIndex(
    (value) => value.product_id == product_id
  );

  if (isAvailableProductIdIntoCart < 0) {
    cart.push({
      product_id: product_id,
      quantity: 1,
    });
  }
  addCartItemsToHTML();
  addCartToLocalStroage();
};

/**  
    add product cart info to localstorage
*/
const addCartToLocalStroage = () => {
  localStorage.setItem(LOCALSTORAGE_CART, JSON.stringify(cart));
};

/**
 * render cart item to html
 *
 */
const addCartItemsToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalPrice = 0;
  let items = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      let newItem = document.createElement("div");

      newItem.classList.add("cart-box");

      newItem.dataset.id = item.product_id;

      const mainProduct = products.find((value) => value.id == item.product_id);

      if (mainProduct) {
        items += item.quantity;
        totalPrice += mainProduct.price * item.quantity;
        newItem.innerHTML = `
                <img src="${mainProduct.image}" alt="${
          mainProduct.name
        }" class="cart-img" />
                <div class="detail-box">
                  <div class="cart-product-title">${mainProduct.name}</div>
                  <div class="cart-price">${
                    mainProduct.price * item.quantity
                  }</div>
                  <div class="flex gap-1">
                    <span class="text-[#333] bg-white px-2 cursor-pointer" onclick="handleChangeCartProduct(${
                      item.product_id
                    },${REMOVE_PRODUCT},event)">-</span>
                    <span class="cart-quantity bg-white rounded-sm">${
                      item.quantity
                    }</span>
                    <span class="text-[#333] bg-white px-2 cursor-pointer" onclick="handleChangeCartProduct(${
                      item.product_id
                    },${ADD_PRODUCT},event)">+</span>
                  </div>
                </div>
                <!-- REMOVE CART  -->
                <i class="text-red-400 bx bxs-trash-alt cart-remove" onclick="handleChangeCartProduct(${
                  item.product_id
                },${DELETE_PRODUCT},event)"></i>
                `;
        listCartHTML.appendChild(newItem);
      }
    });
  }
  totalCartItem.innerHTML = cart.length;
  totalItems.innerHTML = items;
  totalProductsHtml.innerHTML = cart.length;
  totalPriceHtml.innerHTML = totalPrice;
  disableAddToCartBtn();
};

/** 
 * Increase product in cart 

*/
const handleChangeCartProduct = (product_id, action, e) => {
  changeCartAction(product_id, action);
  addCartItemsToHTML();
  addCartToLocalStroage();
};

/* 
    change cart Product actions
*/

const changeCartAction = (product_id, action) => {
  let productCartIndex = cart.findIndex(
    (value) => value.product_id == product_id
  );

  if (productCartIndex >= 0) {
    switch (action) {
      case ADD_PRODUCT:
        cart[productCartIndex].quantity =
          parseInt(cart[productCartIndex].quantity) + 1;

        break;
      case REMOVE_PRODUCT:
        if (cart[productCartIndex].quantity > 1) {
          cart[productCartIndex].quantity =
            parseInt(cart[productCartIndex].quantity) - 1;
        }
        break;
      case DELETE_PRODUCT:
        cart.splice(productCartIndex, 1);
        break;
      default:
        break;
    }
  }
};

/* 
   add to cart btn disable or not
*/
const disableAddToCartBtn = () => {
  addToCartBtns.forEach((ele) => {
    const existItemIntoCart = cart.some(
      (obj) => obj.product_id == ele.parentElement.dataset.id
    );
    if (existItemIntoCart) {
      ele.classList.remove("defaultBgColor");
      ele.classList.add("disableBgColor");
    } else {
      ele.classList.remove("disableBgColor");
      ele.classList.add("defaultBgColor");
    }
  });
};

const initApp = async () => {
  //fetch product data
  const respose = await fetch("./products.json");

  const data = await respose.json();

  products = data;

  addProductToHTML();

  // get cart data from localstorage if have any

  if (localStorage.getItem(LOCALSTORAGE_CART)) {
    cart = JSON.parse(localStorage.getItem(LOCALSTORAGE_CART));

    addCartItemsToHTML();
  }
};

initApp();
