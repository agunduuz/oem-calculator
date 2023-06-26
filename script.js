//* Storage Controller (Local Storage Module)
const StorageController = (function () {
  //Private !!
  return {
    //Public !!
    storeProduct: function (product) {
      let products;

      if (localStorage.getItem('Products') === null) {
        products = [];
        products.push(product);
      } else {
        products = JSON.parse(localStorage.getItem('Products'));
        products.push(product);
      }
      localStorage.setItem('Products', JSON.stringify(products));
    },
    getProducts: function () {
      let products;
      if (localStorage.getItem('Products') === null) {
        products = [];
      } else {
        products = JSON.parse(localStorage.getItem('Products'));
      }
      return products;
    },
    updateProduct: function (product) {
      let products = JSON.parse(localStorage.getItem('Products'));
      products.forEach(function (prd, index) {
        if (product.id == prd.id) {
          products.splice(index, 1, product);
        }
      });
      localStorage.setItem('Products', JSON.stringify(products));
    },
    deleteProduct: function (id) {
      let products = JSON.parse(localStorage.getItem('Products'));
      products.forEach(function (prd, index) {
        if (id == prd.id) {
          products.splice(index, 1);
        }
      });
      localStorage.setItem('Products', JSON.stringify(products));
    },
  };
})();

//* Product Controller (Products Module)
const ProductController = (function () {
  //Private !!
  const Product = function (id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
  };

  const data = {
    products: StorageController.getProducts(),
    selectedProduct: null,
    totalPrice: 0,
  };

  return {
    //Public !!
    getProducts: function () {
      return data.products;
    },
    getData: function () {
      return data;
    },
    getProductById: function (id) {
      let product = null;

      data.products.forEach(function (prd) {
        if (prd.id == id) {
          product = prd;
        }
      });

      return product;
    },
    setCurrentProduct: function (product) {
      data.selectedProduct = product;
    },
    getCurrentProduct: function () {
      return data.selectedProduct;
    },
    addProduct: function (name, price) {
      let id;

      if (data.products.length > 0) {
        id = data.products[data.products.length - 1].id + 1;
      } else {
        id = 0;
      }

      const newProduct = new Product(id, name, parseFloat(price));
      data.products.push(newProduct);
      return newProduct;
    },
    updateProduct: function (name, price) {
      let product = null;

      data.products.forEach(function (prd) {
        if (prd.id == data.selectedProduct.id) {
          prd.name = name;
          prd.price = parseFloat(price);
          product = prd;
        }
      });
      return product;
    },
    deleteProduct: function (product) {
      data.products.forEach(function (prd, index) {
        if (prd.id == product.id) {
          data.products.splice(index, 1);
        }
      });
    },
    getTotal: function () {
      let total = 0;

      data.products.forEach(function (item) {
        total += item.price;
      });
      data.totalPrice = total;
      return data.totalPrice;
    },
  };
})();

//* UI Controller (UI Module)
const UIController = (function () {
  //Private !!
  const Selectors = {
    productList: '#item-list',
    productListItems: '#item-list tr',
    addButton: '.addBtn',
    updateButton: '.updateBtn',
    deleteButton: '.deleteBtn',
    cancelButton: '.cancelBtn',
    productName: '#productName',
    productPrice: '#productPrice',
    productCard: '#productCard',
    totalTL: '#total-tl',
    totalDollar: '#total-dollar',
  };

  return {
    //Public !!
    createProductList: function (products) {
      let html = '';

      products.forEach((prd) => {
        html += `
              <tr>
                 <td>${prd.id}</td>
                 <td>${prd.name}</td>
                 <td>${prd.price} $</td>
                 <td class="text-right">

                    <i class="far fa-edit edit-product"></i>

                </td>
              </tr>
            `;
      });

      document.querySelector(Selectors.productList).innerHTML = html;
    },
    getSelectors: function () {
      return Selectors;
    },
    addProduct: function (prd) {
      document.querySelector(Selectors.productCard).style.display = 'block';
      var item = `
                <tr>
                    <td>${prd.id}</td>
                    <td>${prd.name}</td>
                    <td>${prd.price} $</td>
                    <td class="text-right">

                        <i class="far fa-edit edit-product"></i>

                    </td>
                </tr>
            `;
      document.querySelector(Selectors.productList).innerHTML += item;
    },
    deleteProduct: function () {
      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg')) {
          item.remove();
        }
      });
    },
    updateProduct: function (prd) {
      let updatedItem = null;
      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg')) {
          item.children[1].textContent = prd.name;
          item.children[2].textContent = prd.price + ' $';
          updatedItem = item;
        }
      });
      return updatedItem;
    },
    clearInputs: function () {
      document.querySelector(Selectors.productName).value = '';
      document.querySelector(Selectors.productPrice).value = '';
    },
    clearWarnings: function () {
      let items = document.querySelectorAll(Selectors.productListItems);
      items.forEach(function (item) {
        if (item.classList.contains('bg')) {
          item.classList.remove('bg');
        }
      });
    },
    hideCard: function () {
      document.querySelector(Selectors.productCard).style.display = 'none';
    },
    showTotal: function (total) {
      document.querySelector(Selectors.totalDollar).textContent = total;
      document.querySelector(Selectors.totalTL).textContent = total * 25;
    },
    addProductToForm: function () {
      const selectedProduct = ProductController.getCurrentProduct();
      document.querySelector(Selectors.productName).value =
        selectedProduct.name;
      document.querySelector(Selectors.productPrice).value =
        selectedProduct.price;
    },
    addingState: function (item) {
      UIController.clearWarnings();

      UIController.clearInputs();
      document.querySelector(Selectors.addButton).style.display = 'inline';
      document.querySelector(Selectors.updateButton).style.display = 'none';
      document.querySelector(Selectors.deleteButton).style.display = 'none';
      document.querySelector(Selectors.cancelButton).style.display = 'none';
    },
    editState: function (tr) {
      tr.classList.add('bg');
      document.querySelector(Selectors.addButton).style.display = 'none';
      document.querySelector(Selectors.updateButton).style.display = 'inline';
      document.querySelector(Selectors.deleteButton).style.display = 'inline';
      document.querySelector(Selectors.cancelButton).style.display = 'inline';
    },
  };
})();

//* APP Controller (Main Module)
const App = (function (ProductCtrl, UICtrl, StorageCtrl) {
  //Private !!
  const UISelectors = UICtrl.getSelectors();

  // EVENTS LISTENER FUNCTION !!
  const loadEventListeners = function () {
    // Add Product Event
    document
      .querySelector(UISelectors.addButton)
      .addEventListener('click', productAddSubmit);
    // Edit Product Click Event
    document
      .querySelector(UISelectors.productList)
      .addEventListener('click', productEditClick);

    // Edit Product Submit Event
    document
      .querySelector(UISelectors.updateButton)
      .addEventListener('click', editProductSubmit);

    // Cancel Button Click
    document
      .querySelector(UISelectors.cancelButton)
      .addEventListener('click', cancelUpdate);

    // Delete Product Submit Event
    document
      .querySelector(UISelectors.deleteButton)
      .addEventListener('click', deleteProductSubmit);
  };

  const productAddSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== '' && productPrice !== '') {
      // Add Product
      const newProduct = ProductCtrl.addProduct(productName, productPrice);

      // Add Item to List
      UICtrl.addProduct(newProduct);

      // Add Product to Local Sotrage
      StorageCtrl.storeProduct(newProduct);

      // Get Total
      const total = ProductCtrl.getTotal();

      // Show Total
      UICtrl.showTotal(total);

      // Clear Inputs
      UICtrl.clearInputs();
    }

    e.preventDefault();
  };

  const productEditClick = function (e) {
    if (e.target.classList.contains('edit-product')) {
      const id =
        e.target.parentNode.previousElementSibling.previousElementSibling
          .previousElementSibling.textContent;

      // Get Selected Product
      const product = ProductCtrl.getProductById(id);

      // Set Current Product
      ProductCtrl.setCurrentProduct(product);

      UICtrl.clearWarnings();

      // Add Product to UI
      UICtrl.addProductToForm();

      UICtrl.editState(e.target.parentNode.parentNode);
    }
    e.preventDefault();
  };

  const editProductSubmit = function (e) {
    const productName = document.querySelector(UISelectors.productName).value;
    const productPrice = document.querySelector(UISelectors.productPrice).value;

    if (productName !== '' && productPrice !== '') {
      // Update Product
      const updatedProduct = ProductCtrl.updateProduct(
        productName,
        productPrice
      );

      // Update UI
      let item = UICtrl.updateProduct(updatedProduct);

      // Get Total
      const total = ProductCtrl.getTotal();

      // Show Total
      UICtrl.showTotal(total);

      // Update Storage
      StorageCtrl.updateProduct(updatedProduct);

      UICtrl.addingState();
    }
    e.preventDefault();
  };

  const cancelUpdate = function (e) {
    UICtrl.addingState();
    UICtrl.clearWarnings();
    e.preventDefault();
  };

  const deleteProductSubmit = function (e) {
    // Get Selected Product
    const selectedProduct = ProductCtrl.getCurrentProduct();

    // Delete Product
    ProductCtrl.deleteProduct(selectedProduct);

    // Delete UI
    UICtrl.deleteProduct();

    // Get Total
    const total = ProductCtrl.getTotal();

    // Show Total
    UICtrl.showTotal(total);

    // Delete from Storage
    StorageCtrl.deleteProduct(selectedProduct.id);

    UICtrl.addingState();

    if (total == 0) {
      UICtrl.hideCard();
    }

    e.preventDefault();
  };
  return {
    init: function () {
      console.log('starting app...');

      UICtrl.addingState();

      const products = ProductCtrl.getProducts();

      if (products.length == 0) {
        UICtrl.hideCard();
      } else {
        UICtrl.createProductList(products);
      }

      // get total
      const total = ProductCtrl.getTotal();

      // show total
      UICtrl.showTotal(total);

      loadEventListeners();
    },
  };
})(ProductController, UIController, StorageController);

App.init();
