import './css/styles.css';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import SimpleLightbox from 'simplelightbox';
import iziToast from 'izitoast';
import { getImagesByQuery } from './js/pixabay-api.js';
import { createGalleryMarkup, clearGallery } from './js/render-functions.js';

const refs = {
  form: document.getElementById('search-form'),
  gallery: document.getElementById('gallery'),
  loader: document.getElementById('loader'),
};

let lightbox = null;

refs.form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();

  const searchQuery = event.currentTarget.searchQuery.value.trim();

  if (!searchQuery) {
    iziToast.error({
      title: 'Search error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

  toggleLoader(true);
  clearGallery(refs.gallery);

  try {
    const data = await getImagesByQuery(searchQuery);

    if (!data?.hits?.length) {
      iziToast.warning({
        title: 'No results',
        message: `No images found for "${searchQuery}".`,
        position: 'topRight',
      });
      return;
    }

    refs.gallery.innerHTML = createGalleryMarkup(data.hits);
    initLightbox();

    iziToast.success({
      title: 'Search complete',
      message: `Found ${data.totalHits} images for "${searchQuery}".`,
      position: 'topRight',
    });

    if (data.hits.length < 40 || data.totalHits <= data.hits.length) {
      iziToast.info({
        title: 'End of results',
        message: 'No more images are available for this search query.',
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Request failed',
      message: 'Something went wrong while fetching images. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    toggleLoader(false);
  }
}

function initLightbox() {
  if (lightbox) {
    lightbox.destroy();
  }

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
    scrollZoom: false,
  });
}

function toggleLoader(isVisible) {
  refs.loader.classList.toggle('is-hidden', !isVisible);
}
