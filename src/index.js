import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchpics } from "./pics_api";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-form-input');
const galleryEl = document.querySelector('.gallery');
const buttonLoadMore = document.querySelector('.load-more');
buttonLoadMore.classList.add('is-hidden');
buttonLoadMore.style.display = 'none';

let page = 1;
const perPage = 40;
let pictures = [];
let notiflixParams = {
  position: 'center-center',
  timeout: 4000,
  width: '400px',
  fontSize: '24px'
}

let currentQuery = '';

window.addEventListener('scroll', handleScroll);
formEl.addEventListener('submit', handlerForm);
buttonLoadMore.addEventListener('click', onBtnLoadMoreClick);
document.addEventListener('click', startModalWindow);

function handlerForm(evt) {
  evt.preventDefault();
  const submitValue = inputEl.value.trim();
  // Если новый запрос отличается от предыдущего, очищаем галерею и сбрасываем страницу
  if (submitValue !== currentQuery) {
    galleryEl.innerHTML = '';
    page = 1;
  }
  currentQuery = submitValue;
  console.log(currentQuery);

  fetchMorePictures(currentQuery, page, perPage);
}

const simpleLightbox = new SimpleLightbox('.simple-lightbox');

function startModalWindow(event) {
    if (event.target.classList.contains('simple-lightbox')) {
      event.preventDefault();
      console.log('Before opening the lightbox');
      simpleLightbox.open();
      console.log('After opening the lightbox');
    }
  }

function fetchMorePictures(query, page, perPage) {
  fetchpics(query, page, perPage)
    .then(resp => {
      const newPictures = resp.hits.map(({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
      }) => {
        return {
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads
        };
      });

      if (newPictures.length === 0) {
        Notify.info("Sorry, there are no images matching your search query. Please try again.", notiflixParams);
        return;
      }

      galleryEl.insertAdjacentHTML('beforeend', createMarkup(newPictures));

      if (newPictures.length === perPage) {
        buttonLoadMore.style.display = 'grid';
      } else {
        buttonLoadMore.style.display = 'none';
      }
    })
    .catch(e => console.log(e))
    .finally(() => {
      formEl.reset();
    });
}

// Инициализация SimpleLightbox
simpleLightbox.on('show.simplelightbox', () => {
  console.log('Opening lightbox');
});

function createMarkup(arr) {
  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `
      <div class="photo-card">
        <img class="simple-lightbox" src="${webformatURL}" data-lb="${largeImageURL}" alt="${tags}" width="300px" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>
    `;
  }).join('');
}

function onBtnLoadMoreClick() {
  page += 1;
  fetchMorePictures(currentQuery, page, perPage);
}

function handleScroll() {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollY + windowHeight >= 0.9 * documentHeight) {
    buttonLoadMore.style.display = 'grid';
  } else {
    buttonLoadMore.style.display = 'none';
  }
}
