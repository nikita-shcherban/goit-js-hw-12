import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import {
  clearGallery,
  createGallery,
  hideLoader,
  showLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';
import { getImagesByQuery } from './js/pixabay-api';

const formSearch = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more-btn');

let queryValue = '';
let page = 1;
const perPage = 15;

formSearch.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  const searchQuery = event.currentTarget.elements['search-text'].value.trim();

  if (!searchQuery) {
    return;
  }

  queryValue = searchQuery;
  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const dataSearch = await getImagesByQuery(queryValue, page);

    if (dataSearch.hits.length === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }
    createGallery(dataSearch.hits);
    if (dataSearch.totalHits <= perPage) {
      hideLoadMoreButton();
      iziToast.error({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Something went wrong!',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    formSearch.reset();
  }
}

loadMoreBtn.addEventListener('click', loadMorePages);

async function loadMorePages() {
  page += 1;

  hideLoadMoreButton();
  showLoader();

  try {
    const dataSearch = await getImagesByQuery(queryValue, page);

    createGallery(dataSearch.hits);

    const galleryCard = document.querySelector('.gallery-item');
    if (galleryCard) {
      const rect = galleryCard.getBoundingClientRect();
      const cardHeight = rect.height;

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    const totalPages = Math.ceil(dataSearch.totalHits / perPage);
    if (page >= totalPages) {
      iziToast.error({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      message: 'Something went wrong!',
      position: 'topRight',
    });
    showLoadMoreButton();
  } finally {
    hideLoader();
  }
}
