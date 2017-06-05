const HOST = 'http://localhost:9000';

const api = {
  search(query) {
    return fetch(`${HOST}/v1/search?query=${encodeURIComponent(query)}`);
  },

  list() {
    return fetch(`${HOST}/v1/books`).then((response) => {
      return response.json();
    });
  },

  save(book, rating) {
    return fetch(`${HOST}/v1/books`, {
      method: 'post',
      body: JSON.stringify({book, rating}),
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    });
  },

  delete(id) {
    return fetch(`${HOST}/v1/books/${id}`, {
      method: 'delete',
    });
  }
};

export default api;
