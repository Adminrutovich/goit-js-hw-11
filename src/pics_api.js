const BASE_URL = "https://pixabay.com/api/";
const KEY = "40099242-203d99469d805b74a85c7d20b";
const perPage = 40;
// const KEY1 = "37440122-e5d5a2493910548fa520b3add";
// const KEY2 = "29588079-fbc492831fdad231bf7222b96";


// export function fetchpics(submitValue) {
//     return fetch(`${BASE_URL}?key=${KEY}&q=${submitValue}&per_page=${perPage}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`)
//     .then((resp) => {
//       if (!resp.ok) {
//         throw new Error(resp.statusText);
//         }
        
//       return resp.json();
//     }
//   );
// }

export async function fetchpics(submitValue, page) {
    const resp = await fetch(
      `${BASE_URL}?key=${KEY}&q=${submitValue}&per_page=${perPage}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    if (!resp.ok) {
      throw new Error(resp.statusText);
    }
    return resp.json();
  }

//   export async function loadMorePictures(submitValue) {
//     const resp = await fetch(`${BASE_URL}?key=${KEY}&q=${submitValue}&per_page=${perPage}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`)
//     if (!resp.ok) {
//         throw new Error(resp.statusText)
//     }
//     return resp.json()
// }