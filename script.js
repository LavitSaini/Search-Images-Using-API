let imagesRoot = document.querySelector(".images");
let searchBox = document.querySelector(".images-search");
let errorMessage = document.querySelector(".error-mess");
let loadMoreImagesBox = document.querySelector(".load-more-images");
let loadMoreBtn = document.querySelector(".load-more-btn");
let message = document.querySelector(".message");

let queryValue = "";
let imagesCount = 10;

let url =
  "https://api.unsplash.com/photos/?per_page=10&client_id=FmFCaLui0USrNounn7k-6G_wdiVut5bC1E0DUmm7ClE";

let imgSearchUrl = (query, noOfImages = 10) => {
  return `https://api.unsplash.com/search/photos?per_page=${noOfImages}&query=${query}&client_id=FmFCaLui0USrNounn7k-6G_wdiVut5bC1E0DUmm7ClE`;
};

// Application Name
// Images Search

// Application Description
// fetch images deponds on keyword

// Application ID
// 600594

// Access Key
// FmFCaLui0USrNounn7k-6G_wdiVut5bC1E0DUmm7ClE

// Secret Key
// 0xH5U1UdAoS78bqfUA-tpFZTFo_0ZwYffU-_0ZxnL30

function displayLoader(root) {
  root.innerHTML = `<!-- Loader -->
  <div class="loader">
      <div class="spinner"></div>
  </div>`;
}

displayLoader(imagesRoot);

function displayError(message = "Something Wants Wrong!", root = imagesRoot) {
  root.innerHTML = `<!-- Error Message -->
  <div class="error-box">
      <h2 class="error-message">${message}</h2>
  </div>`;
}

// Using Callback
function fetch1(url, successHandller) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onload = () => {
    if (xhr.status >= 400) {
      alert("Data fetching Error!");
      retrun;
    }
    successHandller(JSON.parse(xhr.response));
  };
  xhr.send();
}

// Using Promise
function fetch2(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        let data = JSON.parse(xhr.response);
        resolve(data);
      } else {
        reject("Error While fetching Data!");
      }
    };
    xhr.send();
  });
}

function displayImages(imagesArray, root = imagesRoot) {
  let clutter = ``;
  imagesArray.forEach((img) => {
    clutter += `<li>
    <img src="${img.urls.thumb}"  alt="" ></li>`;
  });
  root.innerHTML = clutter;
}

fetch2(url)
  .then((imagesData) => {
    if (imagesData.length === 0) {
      displayError("No Images found!");
      return;
    }
    displayImages(imagesData);
  })
  .catch((error) => {
    displayError(error);
  });

function checkInputValidation(inputValue) {
  let valueWordsArray = inputValue.split("");
  return valueWordsArray.every((word) => {
    return (
      (word.charCodeAt(0) >= 65 && word.charCodeAt(0) <= 122) ||
      word.charCodeAt(0) === 32
    );
  });
}

function handleInput(e) {
  if (e.keyCode === 13) {
    // Check Input Validation
    if (!checkInputValidation(searchBox.value)) {
      errorMessage.textContent = "Wrong Search Query!";
      return;
    }

    displayLoader(imagesRoot);

    errorMessage.textContent = "";
    fetch2(imgSearchUrl(searchBox.value))
      .then((imagesData) => {
        if (imagesData.results.length === 0) {
          message.style.display = "none";
          displayError("No Images found!");
          return;
        }
        displayImages(imagesData.results);
        message.style.display = "none";
        loadMoreBtn.style.display = "block";
      })
      .catch((error) => {
        displayError(error);
      });

    queryValue = searchBox.value;
    searchBox.value = "";
  }
}

searchBox.addEventListener("keyup", handleInput);

function handleClick() {
  displayLoader(imagesRoot);
  imagesCount += 10;

  fetch2(imgSearchUrl(queryValue, imagesCount))
    .then((imagesData) => {
      if (imagesData.results.length < imagesCount) {
        throw new Error("Images Limit Exceed!");
      }
      displayImages(imagesData.results);
    })
    .catch(() => {
      fetch2(imgSearchUrl(queryValue, imagesCount - 10))
        .then((imagesData) => {
          displayImages(imagesData.results);
        })
        .catch((error) => {
          displayError(error);
        });
      loadMoreBtn.style.display = "none";
      message.textContent = "No More Images Loaded!";
      message.style.display = "block";
      imagesCount = 0;
    });
}

loadMoreBtn.addEventListener("click", handleClick);
