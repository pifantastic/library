export default {
  search(query) {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`).then((response) => {
      return response.text().then(text => JSON.parse(text));
    });
  }
};
