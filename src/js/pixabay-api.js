import axios from 'axios';

const PIXABAY_URL = 'https://pixabay.com/api';
const MY_KEY = '47550347-a44441999a35f73cd42751acc';

export async function getImagesByQuery(query, page) {
  const response = await axios.get(PIXABAY_URL, {
    params: {
      key: MY_KEY,
      q: query,
      page: page,
      per_page: 15,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    },
  });
  return response.data;
}
