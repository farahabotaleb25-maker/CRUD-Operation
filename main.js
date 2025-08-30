  var ProductNameInput = document.getElementById("ProductName");
  var ProductPriceInput = document.getElementById("ProductPrice");
  var ProductCategoryInput = document.getElementById("ProductCategory");
  var ProductDescriptionInput = document.getElementById("ProductDescription");
  var productImageInput = document.getElementById("productImage");
  var SearchInput = document.getElementById("SearchInput");
  var alertmsg = document.getElementById("alertmsg");
  var addbtn = document.getElementById("addbtn");
  var updatebtn = document.getElementById("updatebtn");

  var productList = [];
  var currentIndex;

  if (localStorage.getItem("productList") != null) {
    productList = JSON.parse(localStorage.getItem("productList"));
  }

  displayProducts(productList);

  function validateName() {
    var regex = /^[A-Z][a-z]{2,20}$/;
    if (regex.test(ProductNameInput.value.trim())) {
      ProductNameInput.classList.remove("is-invalid");
      ProductNameInput.classList.add("is-valid");
      alertmsg.classList.add("d-none");
      return true;
    } else {
      ProductNameInput.classList.add("is-invalid");
      ProductNameInput.classList.remove("is-valid");
      alertmsg.classList.remove("d-none");
      return false;
    }
  }

  function validatePrice() {
    if (ProductPriceInput.value > 0) {
      ProductPriceInput.classList.remove("is-invalid");
      ProductPriceInput.classList.add("is-valid");
      return true;
    } else {
      ProductPriceInput.classList.add("is-invalid");
      ProductPriceInput.classList.remove("is-valid");
      return false;
    }
  }

  function validateCategory() {
    if (ProductCategoryInput.value.trim().length >= 3) {
      ProductCategoryInput.classList.remove("is-invalid");
      ProductCategoryInput.classList.add("is-valid");
      return true;
    } else {
      ProductCategoryInput.classList.add("is-invalid");
      ProductCategoryInput.classList.remove("is-valid");
      return false;
    }
  }

  function validateDescription() {
    if (ProductDescriptionInput.value.trim().length >= 5) {
      ProductDescriptionInput.classList.remove("is-invalid");
      ProductDescriptionInput.classList.add("is-valid");
      return true;
    } else {
      ProductDescriptionInput.classList.add("is-invalid");
      ProductDescriptionInput.classList.remove("is-valid");
      return false;
    }
  }

  function AddProduct() {
    var isNameValid = validateName();
    var isPriceValid = validatePrice();
    var isCategoryValid = validateCategory();
    var isDescriptionValid = validateDescription();

    if (!(isNameValid && isPriceValid && isCategoryValid && isDescriptionValid)) {
      return;
    }

    var reader = new FileReader();
    if (productImageInput.files[0]) {
      reader.onload = function (e) {
        var product = {
          name: ProductNameInput.value,
          price: ProductPriceInput.value,
          category: ProductCategoryInput.value,
          description: ProductDescriptionInput.value,
          image: e.target.result,
        };
        productList.push(product);
        localStorage.setItem("productList", JSON.stringify(productList));
        displayProducts(productList);
        clearForm();
      };
      reader.readAsDataURL(productImageInput.files[0]);
    } else {
      var product = {
        name: ProductNameInput.value,
        price: ProductPriceInput.value,
        category: ProductCategoryInput.value,
        description: ProductDescriptionInput.value,
        image: "https://via.placeholder.com/150",
      };
      productList.push(product);
      localStorage.setItem("productList", JSON.stringify(productList));
      displayProducts(productList);
      clearForm();
    }
  }

  function clearForm() {
    ProductNameInput.value = "";
    ProductPriceInput.value = "";
    ProductCategoryInput.value = "";
    ProductDescriptionInput.value = "";
    productImageInput.value = "";
    alertmsg.classList.add("d-none");

    ProductNameInput.classList.remove("is-valid", "is-invalid");
    ProductPriceInput.classList.remove("is-valid", "is-invalid");
    ProductCategoryInput.classList.remove("is-valid", "is-invalid");
    ProductDescriptionInput.classList.remove("is-valid", "is-invalid");
  }

  function displayProducts(arr) {
    var box = "";
    for (var i = 0; i < arr.length; i++) {
      box += `
        <div class="col-lg-4 col-md-6 mb-4">
          <div class="card border-0 shadow-lg h-100">
            <img src="${arr[i].image}" class="card-img-top" alt="product" style="height:200px; object-fit:cover;">
            <div class="card-body">
              <h5 class="card-title">${arr[i].name}</h5>
              <p class="card-text">${arr[i].description}</p>
              <p><span class="fw-bold">Price:</span> ${arr[i].price}</p>
              <p><span class="fw-bold">Category:</span> ${arr[i].category}</p>
            </div>
            <div class="card-footer bg-transparent border-0 d-flex justify-content-around">
              <button class="btn btn-warning" onclick="setFormForUpdate(${i})">Update</button>
              <button class="btn btn-danger" onclick="deleteProduct(${i})">Delete</button>
            </div>
          </div>
        </div>`;
    }
    document.getElementById("productTableBody").innerHTML = box;
  }

  function deleteProduct(index) {
    productList.splice(index, 1);
    localStorage.setItem("productList", JSON.stringify(productList));
    displayProducts(productList);
  }

  function SearchProduct() {
    var searchValue = SearchInput.value.toLowerCase().trim();
    var SearchResult = [];

    if (searchValue === "") {
      displayProducts(productList);
      return;
    }

    for (var i = 0; i < productList.length; i++) {
      if (productList[i].name.toLowerCase().includes(searchValue)) {
        SearchResult.push(productList[i]);
      }
    }

    displayProducts(SearchResult);
  }

  function setFormForUpdate(index) {
    var product = productList[index];
    ProductNameInput.value = product.name;
    ProductPriceInput.value = product.price;
    ProductCategoryInput.value = product.category;
    ProductDescriptionInput.value = product.description;
    productImageInput.value = ""; 

    ProductNameInput.classList.remove("is-valid", "is-invalid");
    ProductPriceInput.classList.remove("is-valid", "is-invalid");
    ProductCategoryInput.classList.remove("is-valid", "is-invalid");
    ProductDescriptionInput.classList.remove("is-valid", "is-invalid");

    currentIndex = index;
    updatebtn.classList.remove("d-none");
    addbtn.classList.add("d-none");
  }

  function updateProduct() {
    var isNameValid = validateName();
    var isPriceValid = validatePrice();
    var isCategoryValid = validateCategory();
    var isDescriptionValid = validateDescription();

    if (!isNameValid || !isPriceValid || !isCategoryValid || !isDescriptionValid) {
      return;
    }

    if (productImageInput.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        productList[currentIndex] = {
          name: ProductNameInput.value,
          price: ProductPriceInput.value,
          category: ProductCategoryInput.value,
          description: ProductDescriptionInput.value,
          image: e.target.result,
        };
        localStorage.setItem("productList", JSON.stringify(productList));
        displayProducts(productList);
        clearForm();
        updatebtn.classList.add("d-none");
        addbtn.classList.remove("d-none");
      };
      reader.readAsDataURL(productImageInput.files[0]);
    } else {
      productList[currentIndex] = {
        name: ProductNameInput.value,
        price: ProductPriceInput.value,
        category: ProductCategoryInput.value,
        description: ProductDescriptionInput.value,
        image: productList[currentIndex].image, 
      };
      localStorage.setItem("productList", JSON.stringify(productList));
      displayProducts(productList);
      clearForm();
      updatebtn.classList.add("d-none");
      addbtn.classList.remove("d-none");
    }
  }