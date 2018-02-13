// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({11:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  search(searchTerm, searchLimit, sortBy) {
    return fetch(`https://cors-anywhere.herokuapp.com/http://reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`, {
      mode: "cors"
    }).then(res => res.json()).then(data => data.data.children.map(data => data.data)).catch(err => console.log(err));
  }
};
},{}],4:[function(require,module,exports) {
"use strict";

var _reddApi = require("./reddApi");

var _reddApi2 = _interopRequireDefault(_reddApi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

let timer;

searchForm.addEventListener("submit", e => {
  const searchTerm = searchInput.value;
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;
  const searchLimit = document.getElementById("limit").value;
  if (searchTerm === "") {
    //show message
    showMessage("Please add a Search term", "alert-danger", true);
  }
  showLoading();
  _reddApi2.default.search(searchTerm, searchLimit, sortBy).then(results => {
    clearInterval(timer);
    document.querySelector(".progressBar").remove();
    let output = `<div class="card-columns">`;
    results.forEach(post => {
      let image = post.preview ? post.preview.images[0].source.url : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
      output += `
          <div class="card mb-2">
          <img class="card-img-top" src="${image}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${truncateString(post.selftext, 100)}</p>
            <a href="${post.url}" target="_blank
            " class="btn btn-primary">Read More</a>
            <a href="https://reddit.com${post.permalink}" target="_blank
            " class="btn btn-primary">Reddit Comments</a>
            <hr>
            <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span> 
            <span class="badge badge-dark">Score: ${post.score}</span>
          </div>
        </div>
          
          `;
    });
    output += `</div>`;
    document.getElementById("results").innerHTML = output;
  }).catch(err => console.log(err));
  // Search Logic
  e.preventDefault();
});

function showMessage(msg, className, withTimer) {
  const div = document.createElement("div");
  div.className = `alert ${className}`;
  div.appendChild(document.createTextNode(msg));
  const searchContainer = document.getElementById("search-container");
  const search = document.getElementById("search");
  searchContainer.insertBefore(div, search);
  if (withTimer) {
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }
}

function showLoading() {
  const div = document.createElement("div");
  div.className = `progressBar`;
  div.innerHTML = `<div class="progress" style="height: 3px;">
  <div class="progress-bar bg-danger" role="progressbar" style="width: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>`;
  let current_progress = 0;
  timer = setInterval(() => {
    current_progress += 20;
    let el = document.querySelector(".progress-bar");
    el.style.width = current_progress + "%";
    el["aria - valuenow"] = `$"{current_progress}"`;
    if (current_progress >= 100) {
      current_progress = 0;
    }
  }, 1000);
  const searchContainer = document.getElementById("search-container");
  const search = document.getElementById("search");
  searchContainer.insertBefore(div, search);
}

function truncateString(myString, limit) {
  const shortened = myString.indexOf(" ", limit);
  if (shortened == -1) return myString;
  return myString.substring(0, shortened);
}
},{"./reddApi":11}],18:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var ws = new WebSocket('ws://' + hostname + ':' + '39035' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[18,4])
//# sourceMappingURL=/dist/travesty-reddit.map