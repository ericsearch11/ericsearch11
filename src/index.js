const formSearch = document.querySelector("#form_search");
const matchFound = document.querySelector(".match-found");
const found = document.querySelector(".found");
const searchText = document.querySelector(".search-text");
const searchInput = document.querySelector("#search");
const searchHead = document.querySelector(".search-head");
const cardFound = document.querySelector(".card-found");
const cardFoundBG = document.querySelector(".card-found-bg");
const circle = document.querySelector(".rounded-circle");

fetchAPIandUI(
  "https://api.ies.ed.gov/eric/?rows=20&start=0&format=json&search=author:alam",
  "alam"
);

searchInput.addEventListener("keyup", async function() {
  if (this.value.length > 3) {
    searchText.innerHTML = `"${this.value}"`;
    let keyword = this.value;
    let type = document.getElementById("inputGroupSelect01").value;
    let rows = 20;
    let parameter = "";

    parameter = switch_type(type, keyword);

    url = `https://api.ies.ed.gov/eric/?rows=${rows}&start=0&format=json${parameter}`;
    await fetchAPIandUI(url, keyword);
  }
});

formSearch.addEventListener("submit", async function(e) {
  e.preventDefault();
  let keyword = document.getElementById("search").value;
  let type = document.getElementById("inputGroupSelect01").value;
  let rows = 20;
  let parameter = "";

  parameter = switch_type(type, keyword);

  url = `https://api.ies.ed.gov/eric/?rows=${rows}&start=0&format=json${parameter}`;

  await fetchAPIandUI(url, keyword);
});

function fetchAPIandUI(url, keyword) {
  return fetch(url, {
    method: "GET"
  })
    .then(res => res.json())
    .then(response => {
      let card = "";
      let res = response.response;
      if (res.numFound > 0) {
        let journals = res.docs;
        journals.forEach(journal => {
          card += create_result(journal);
        });
        searchText.innerHTML = `"${keyword}"`;

        matchFound.innerHTML = `&nbsp;&nbsp;Match ${res.numFound}`;
        found.innerHTML = `found (${res.numFound})`;
        cardFoundBG.innerHTML = `<strong>Found</strong>`;
        changeColor(searchHead, "text-danger", "text-success");
        changeColor(cardFound, "border-danger", "border-success");
        changeColor(cardFoundBG, "bg-danger", "bg-success");
        changeColor(circle, "bg-danger", "bg-success");
      } else {
        matchFound.innerHTML = `&nbsp;&nbsp;Match 0`;
        found.innerHTML = `not found`;
        cardFoundBG.innerHTML = `<strong>Not found</strong>`;
        changeColor(searchHead, "text-success", "text-danger");
        changeColor(cardFound, "border-success", "border-danger");
        changeColor(cardFoundBG, "bg-success", "bg-danger");
        changeColor(circle, "bg-success", "bg-danger");
      }
      const content_result = document.querySelector(".content-result");
      content_result.innerHTML = card;
    })
    .catch(err => console.log(err));
}

function changeColor(element, style1, style2) {
  element.classList.remove(style1);
  if (!element.classList.contains(style2)) {
    element.classList.add(style2);
  }
}

function switch_type(type, keyword) {
  switch (type) {
    case "author":
      return `&search=author:'${keyword}'`;
    case "title":
      return `&search=title:'${keyword}'`;
    case "description":
      return `&search=description:'${keyword}'`;
    case "isbn":
      return `&search=isbn:'${keyword}'`;
    case "issn":
      return `&search=issn:'${keyword}'`;
    case "languange":
      return `&search=languange:'${keyword}'`;
    case "publisher":
      return `&search=publisher:'${keyword}'`;
    case "subject":
      return `&search=subject:'${keyword}'`;
    default:
      return `&search=author:'${keyword}'`;
  }
}

function create_result(result) {
  return `
    <div class="card my-2 shadow" style="width: 100%;">
        <div class="card-body p-3 text-secondary">
            <h5 class="card-title">
            <strong>${result.title.ucwords()}</strong>
            </h5>
            <h6 class="card-subtitle mb-3">
            ${result.description.ucfirst().substr(0, 150)} ...
            </h6>
            <p class="card-text text-success" style="line-height: 0.3;">
              ${result.author[0].ucwords()} 
              <strong class="text-secondary">
              (${result.publicationdateyear})
              </strong>
            </p>
            <p class="card-text mb-4" style="line-height: 0;">
            <small class="text-primary"><strong class="text-secondary"></strong>
              ${result.issn[0]}
            </small>
            </p>   
            ${create_result_subject(result.subject)}
        </div>
    </div>
    `;
}

function create_result_subject(subject) {
  let strSubject = "";
  for (i = 0; i <= 2; i++) {
    strSubject += `<span class="badge badge-secondary mr-1">${subject[i]}</span>`;
  }

  return strSubject;
}

String.prototype.ucfirst = function() {
  str = this.toLowerCase();
  return (
    str
      .toLowerCase()
      .charAt(0)
      .toUpperCase() + str.slice(1)
  );
};

String.prototype.ucwords = function() {
  str = this.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function(s) {
    return s.toUpperCase();
  });
};
