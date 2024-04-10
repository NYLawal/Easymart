const baseUrl = "https://easymart-gap9.onrender.com/api/v1"
const imgFile = document.getElementById("imgfile")
const output = document.querySelector("output")
let imagesArray = []
const productnameInput = document.getElementById("pname");
const categoryInput = document.getElementById("pcategory");
const priceInput = document.getElementById("pprice");
const stockInput = document.getElementById("pstock");
const descriptionInput = document.getElementById("pdescr");
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

 
const uploadProduct = (productInfo) => {
    axios
        .post(`${baseUrl}/product/add`, productInfo) 
        // {
        //     headers: {
        //       'Authorization': `Bearer ${token}` 
        //     }
        //   }
          
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
                text: err.response.data.message,
            });
        });
};

const uploadImage = document.getElementById("uploadimg");
uploadImage.addEventListener("click", () => {
    // const productName = productnameInput.value;
    // const category = categoryInput.value;
    // const price = priceInput.value;
    // const noInStock = stockInput.value;
    // const description = descriptionInput.value;
    
    //     const formData = {
    //         productName,
    //         category,
    //         price,
    //         noInStock,
    //         description,
    //         pimage
    //     }

//     const form = document.querySelector("form");
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
  const formData = new FormData(form);
  const formDataObj = {};
  formData.append("productImage", pimage);
  formData.forEach((value, key) => (formDataObj[key] = value));
        uploadProduct(formDataObj);
});
