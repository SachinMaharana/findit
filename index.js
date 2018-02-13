import reddit from "./reddApi";

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
  reddit
    .search(searchTerm, searchLimit, sortBy)
    .then(results => {
      clearInterval(timer);
      document.querySelector(".progressBar").remove();
      let output = `<div class="card-columns">`;
      results.forEach(post => {
        let image = post.preview
          ? post.preview.images[0].source.url
          : "https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg";
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
            <span class="badge badge-secondary">Subreddit: ${
              post.subreddit
            }</span> 
            <span class="badge badge-dark">Score: ${post.score}</span>
          </div>
        </div>
          
          `;
      });
      output += `</div>`;
      document.getElementById("results").innerHTML = output;
    })
    .catch(err => console.log(err));
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
