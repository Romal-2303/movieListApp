interface FetchOptions extends RequestInit {
  body?: any;
}

const fetchData = (api_url: string, options: FetchOptions = {}) => {
  return new Promise((resolve, reject) => {
    fetch(`${api_url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

export { fetchData };
