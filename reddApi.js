export default {
  search(searchTerm, searchLimit, sortBy) {
    return fetch(
      `https://cors-anywhere.herokuapp.com/http://reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`,
      {
        mode: "cors"
      }
    )
      .then(res => res.json())
      .then(data => data.data.children.map(data => data.data))
      .catch(err => console.log(err));
  }
};
