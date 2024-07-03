const parseContent = async (response: any, options: any) => {
  const { requestId, payload, ...headers } = options;

  let json;

  if (headers["Content-Type"] === "blob") {
    return response.blob();
  }

  if (headers["Content-Type"] === "text/plain") {
    return response.text();
  }

  json = await response.json();

  if (response.status >= 200 && response.status < 300) {
    return json;
  } else {
    const error = new Error();

    const errorObject: any = {
      statusCode: response.status,
      message: json.message,
    };

    error.message = errorObject.message;
    error.stack = errorObject;

    throw error;
  }
};

const afterFetchHandlers = {
  parseContent,
};
export default afterFetchHandlers;
