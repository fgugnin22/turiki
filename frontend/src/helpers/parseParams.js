export const parseParams = (string) => {
  // Set up a new URLSearchParams object using the string.
  const params = new URLSearchParams(string);

  // Get an iterator for the URLSearchParams object.
  const entries = params.entries();

  const result = {};

  // Loop through the URLSearchParams object and add each key/value
  for (const [key, value] of entries) {
    // Split comma-separated values into an array.
    if (value.includes(",")) {
      result[key] = value.split(",");
    } else {
      result[key] = [value];
    }

    // If a key does not have a value, delete it.
    if (!value) {
      delete result[key];
    }
  }

  return result;
};
