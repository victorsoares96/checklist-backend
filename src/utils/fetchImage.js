const fetch = require('node-fetch');

const fetchImage = async (src) => {
  const response = await fetch(src);
  const image = await response.buffer();
  console.log(image)
  return image;
};

module.exports = fetchImage;