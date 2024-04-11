const baseUrl = "https://easymart-gap9.onrender.com/api/v1"
const imgFile = document.getElementById("imgfile")
const output = document.querySelector("output")
let imagesArray = []
const productnameInput = document.getElementById("pname");
const categoryInput = document.getElementById("pcategory");
const priceInput = document.getElementById("pprice");
const stockInput = document.getElementById("pstock");
const descriptionInput = document.getElementById("pdescr");
const imageUrlInput = document.getElementById("pimage");
const pimage = document.querySelector("img");
const form = document.querySelector("form");


imgFile.addEventListener("change", () => {
    const file = imgFile.files
    imagesArray.push(file[0])
    displayImages()
  })

  function displayImages() {
    let images = ""
    imagesArray.forEach((image, index) => {
      images += `<div class="image">
                  <img src="${URL.createObjectURL(image)}" alt="image">
                  <span onclick="deleteImage(${index})">&times;</span>
                </div>`
    })
    output.innerHTML = images
  }


  function deleteImage(index) {
    imagesArray.splice(index, 1)
    displayImages()
  }

  const product={
    productName:"sibi bracelet",
    description:"maroon long shining",
    category:"bracelet",
    price:4000,
    noInStock: 2
}

 
const uploadProduct = (productInfo) => {
    axios
        .post(`${baseUrl}/product/add`, productInfo)
        .then(function (response) {
            console.log(response.data);
            console.log(req.file);
            Swal.fire({
                toast: true,
                icon: "success",
                title: "Upload successful",
                animation: false,
                position: "center",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener("mouseenter", Swal.stopTimer);
                    toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
            });

        })
        .catch((err) => {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "Error Processing Input",
                text: err,
            });
        });
};

const handleSubmit = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault()
    const productName = productnameInput.value;
    const category = categoryInput.value;
    const price = priceInput.value;
    const noInStock = stockInput.value;
    const description = descriptionInput.value;
    
        const productData = {
            productName,
            category,
            price,
            noInStock,
            description,
            image_url     
        }

//     const form = document.querySelector("form");
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const formData = new FormData(form);
// //   formData.append('productName', productnameInput.value)
// //   formData.append('description', descriptionInput.value)
// //   formData.append('category', categoryInput.value)
// //   formData.append('price', priceInput.value)
// //   formData.append('noInStock', stockInput.value)
// // formData.append('productImage', form[5].files[0])

// // fetch(`${baseUrl}/product/add`, {
// //         method: 'POST',
// //         body: formData,
// //         headers: {
// //           "Content-Type": "multipart/form-data"
// //         }
// //     })
// //     .then(function (r) {
// //         console.log(r);
// //         return r.json();
// //       })
// //       .then(function (res) {
// //         console.log(res);
// //       })
// //       .catch(function (err) {
// //         Swal.fire({
// //           icon: "error",
// //           title: "Oops...",
// //           text: err,
// //         });
// //       });
// // console.log([...formData])
// // formData.getAll()
// const formData = new FormData(form);
//   formData.append('productImage', imgFile.files[0]);
//   console.log(formData)

//     const formDataObj = {};
// //   formData.append("productImage", myimage);
//   formData.forEach((value, key) => (formDataObj[key] = value));
//   console.log(formDataObj)

// productData.productImage = imgFile.files[0]

        uploadProduct(productData);
});

