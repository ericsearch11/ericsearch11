"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var formSearch = document.querySelector("#form_search");
var matchFound = document.querySelector(".match-found");
var found = document.querySelector(".found");
var searchText = document.querySelector(".search-text");
var searchInput = document.querySelector("#search");
var searchHead = document.querySelector(".search-head");
var cardFound = document.querySelector(".card-found");
var cardFoundBG = document.querySelector(".card-found-bg");
var circle = document.querySelector(".rounded-circle");
fetchAPIandUI("https://api.ies.ed.gov/eric/?rows=20&start=0&format=json&search=author:alam", "alam");
searchInput.addEventListener("keyup", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var keyword, type, rows, parameter;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(this.value.length > 3)) {
            _context.next = 10;
            break;
          }

          searchText.innerHTML = "\"".concat(this.value, "\"");
          keyword = this.value;
          type = document.getElementById("inputGroupSelect01").value;
          rows = 20;
          parameter = "";
          parameter = switch_type(type, keyword);
          url = "https://api.ies.ed.gov/eric/?rows=".concat(rows, "&start=0&format=json").concat(parameter);
          _context.next = 10;
          return fetchAPIandUI(url, keyword);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
})));
formSearch.addEventListener("submit", /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(e) {
    var keyword, type, rows, parameter;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            e.preventDefault();
            keyword = document.getElementById("search").value;
            type = document.getElementById("inputGroupSelect01").value;
            rows = 20;
            parameter = "";
            parameter = switch_type(type, keyword);
            url = "https://api.ies.ed.gov/eric/?rows=".concat(rows, "&start=0&format=json").concat(parameter);
            _context2.next = 9;
            return fetchAPIandUI(url, keyword);

          case 9:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}());

function fetchAPIandUI(url, keyword) {
  return fetch(url, {
    method: "GET"
  }).then(function (res) {
    return res.json();
  }).then(function (response) {
    var card = "";
    var res = response.response;

    if (res.numFound > 0) {
      var journals = res.docs;
      journals.forEach(function (journal) {
        card += create_result(journal);
      });
      searchText.innerHTML = "\"".concat(keyword, "\"");
      matchFound.innerHTML = "&nbsp;&nbsp;Match ".concat(res.numFound);
      found.innerHTML = "found (".concat(res.numFound, ")");
      cardFoundBG.innerHTML = "<strong>Found</strong>";
      changeColor(searchHead, "text-danger", "text-success");
      changeColor(cardFound, "border-danger", "border-success");
      changeColor(cardFoundBG, "bg-danger", "bg-success");
      changeColor(circle, "bg-danger", "bg-success");
    } else {
      matchFound.innerHTML = "&nbsp;&nbsp;Match 0";
      found.innerHTML = "not found";
      cardFoundBG.innerHTML = "<strong>Not found</strong>";
      changeColor(searchHead, "text-success", "text-danger");
      changeColor(cardFound, "border-success", "border-danger");
      changeColor(cardFoundBG, "bg-success", "bg-danger");
      changeColor(circle, "bg-success", "bg-danger");
    }

    var content_result = document.querySelector(".content-result");
    content_result.innerHTML = card;
  })["catch"](function (err) {
    return console.log(err);
  });
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
      return "&search=author:'".concat(keyword, "'");

    case "title":
      return "&search=title:'".concat(keyword, "'");

    case "description":
      return "&search=description:'".concat(keyword, "'");

    case "isbn":
      return "&search=isbn:'".concat(keyword, "'");

    case "issn":
      return "&search=issn:'".concat(keyword, "'");

    case "languange":
      return "&search=languange:'".concat(keyword, "'");

    case "publisher":
      return "&search=publisher:'".concat(keyword, "'");

    case "subject":
      return "&search=subject:'".concat(keyword, "'");

    default:
      return "&search=author:'".concat(keyword, "'");
  }
}

function create_result(result) {
  return "\n    <div class=\"card my-2 shadow\" style=\"width: 100%;\">\n        <div class=\"card-body p-3 text-secondary\">\n            <h5 class=\"card-title\">\n            <strong>".concat(result.title.ucwords(), "</strong>\n            </h5>\n            <h6 class=\"card-subtitle mb-3\">\n            ").concat(result.description.ucfirst().substr(0, 150), " ...\n            </h6>\n            <p class=\"card-text text-success\" style=\"line-height: 0.3;\">\n              ").concat(result.author[0].ucwords(), " \n              <strong class=\"text-secondary\">\n              (").concat(result.publicationdateyear, ")\n              </strong>\n            </p>\n            <p class=\"card-text mb-4\" style=\"line-height: 0;\">\n            <small class=\"text-primary\"><strong class=\"text-secondary\"></strong>\n              ").concat(result.issn[0], "\n            </small>\n            </p>   \n            ").concat(create_result_subject(result.subject), "\n        </div>\n    </div>\n    ");
}

function create_result_subject(subject) {
  var strSubject = "";

  for (i = 0; i <= 2; i++) {
    strSubject += "<span class=\"badge badge-secondary mr-1\">".concat(subject[i], "</span>");
  }

  return strSubject;
}

String.prototype.ucfirst = function () {
  str = this.toLowerCase();
  return str.toLowerCase().charAt(0).toUpperCase() + str.slice(1);
};

String.prototype.ucwords = function () {
  str = this.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g, function (s) {
    return s.toUpperCase();
  });
};
