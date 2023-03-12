const baseURL = "https://api.publicapis.org";
const searchForm = document.getElementById("searchForm");
const searchInpt = document.getElementById("searchInpt");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");
const resultsAndFilters = document.getElementById("resultsFilters");
const categoriesSelect = document.getElementById("categoriesSelect");
const corsSetting = document.getElementById("corsEnableDisable");
const authSetting = document.getElementById("authEnableDisable");
const httpsSetting = document.getElementById("httpsEnableDisable");

// Search apis

var array = [];
var arrayOld = [];

const createCards = (arr) => {
  results.innerHTML = "";
  setTimeout(() => {
    var text = document.createElement("h2");
    text.textContent = "Results";
    text.classList.add(
      "text-2xl",
      "font-bold",
      "p-2",
      "text-black",
      "text-center"
    );
    results.appendChild(text);

    if (arr.length > 0) {
      arr.map((x) => {
        var div = document.createElement("div");

        div.innerHTML = `
            <div class='p-2 bg-slate-50 rounded-md m-1.5'>
              <h1>${x.API}</h1>
              <p>${x.Description}</p>
              <a target='_blank' href='${x.Link}'><strong>Go to api<strong></a>
            </div>
            `;
        results.appendChild(div);
      });
    } else {
      var nores = document.createElement("p");
      nores.classList.add("text-center");
      nores.textContent = "No results for '" + searchInpt.value + "'";
      results.appendChild(nores);
    }
  }, 10);
  searchBtn.disabled = false;
  searchBtn.innerHTML = '<i class="fa-solid fa-search"></i>';
  resultsAndFilters.classList.remove("hidden");
};

const fetchApi = async () => {
  searchBtn.disabled = true;
  searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  var url = baseURL + "/entries";
  await fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      var search = searchInpt.value;
      array = data.entries;
      arrayOld = data.entries;

      if (corsSetting.checked) {
        array = array.filter((f) => f.Cors === "yes");
      }
      if (httpsSetting.checked) {
        array = array.filter((f) => f.HTTPS === true);
      }
      if (categoriesSelect.value !== "All") {
        array = array.filter((f) => f.Category === categoriesSelect.value);
      }

      array = array.filter(
        (f) =>
          f.API.toLowerCase().includes(search.toLowerCase()) ||
          f.Description.toLowerCase().includes(search.toLowerCase())
      );
      createCards(array);
    })
    .catch((err) => {
      console.error(err);
      results.innerHTML = `<p class="text-red-600 text-xl">Error!</p>`;
    });
};

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const ctgrys = await fetch(baseURL + "/categories", {
    method: "GET",
  });
  const categories = await ctgrys.json();

  categories.categories.map((x) => {
    var option = document.createElement("option");
    option.value = x;
    option.textContent = x;
    categoriesSelect.appendChild(option);
  });

  fetchApi();
});

corsSetting.onchange = () => {
  if (corsSetting.checked) {
    array = array
      .filter(
        (f) =>
          f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
          f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
      )
      .filter((f) => f.Cors === "yes");
    createCards(array);
  } else {
    if (httpsSetting.checked) {
      array = arrayOld
        .filter(
          (f) =>
            f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
            f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
        )
        .filter((f) => f.HTTPS === true);
      createCards(array);
    } else {
      array = arrayOld.filter(
        (f) =>
          f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
          f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
      );
      createCards(array);
    }
  }
};

httpsSetting.onchange = () => {
  if (httpsSetting.checked) {
    array = array
      .filter(
        (f) =>
          f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
          f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
      )
      .filter((f) => f.HTTPS === true);
    createCards(array);
  } else {
    if (corsSetting.checked) {
      array = arrayOld
        .filter(
          (f) =>
            f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
            f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
        )
        .filter((f) => f.Cors === "yes");
      createCards(array);
    } else {
      array = arrayOld.filter(
        (f) =>
          f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
          f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
      );
      createCards(array);
    }
  }
};

categoriesSelect.onchange = () => {
  if (categoriesSelect.value !== "All") {
    if (corsSetting.checked) {
      array = arrayOld
        .filter(
          (f) =>
            f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
            f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
        )
        .filter((f) => f.Cors === "yes");
    }
    if (httpsSetting.checked) {
      array = arrayOld
        .filter(
          (f) =>
            f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
            f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
        )
        .filter((f) => f.HTTPS === true);
    }

    array = array
      .filter(
        (f) =>
          f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
          f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
      )
      .filter((f) => f.Category === categoriesSelect.value);
    createCards(array);
  } else {
    array = arrayOld.filter(
      (f) =>
        f.API.toLowerCase().includes(searchInpt.value.toLowerCase()) ||
        f.Description.toLowerCase().includes(searchInpt.value.toLowerCase())
    );
    createCards(array);
  }
};
