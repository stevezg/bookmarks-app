const bookmark = (function() {
  const generateAddBookmarkForm = function() {
    return `
    <h2>Create a new Bookmark📚🔖</h2>
    <label for="title">Title</label> <input id="title" name="title" type="text
    class="input-bookmark-title" placeholder="enter title" >
    <label for="url">Link</label>
    <input
      id="url"
      type="text"
      class="input-bookmark-url"
      placeholder="enter url"
    />
    <label for="description">Description</label>
    <textarea
      type="text"
      id="description"
      name="description"
      class="input-bookmark-description"
      placeholder="Enter a description"
    ></textarea>
    <label for="rating">Rating</label>
    <select id="rating" name="rating" class="input-bookmark-rating">
      <option selected disabled>Choose a Rating</option>
      <option value="1">1 Star</option>
      <option value="2">2 Stars</option>
      <option value="3">3 Stars</option>
      <option value="4">4 Stars</option>
      <option value="5">5 Stars</option>
    </select>
    <p class="add-form-error-message"></p>
    <button type="submit" class="create-bookmark-button">
      Create Bookmark
    </button>
    <button type="button" class="cancel-create-bookmark-button">
      Cancel
    </button>
    <ul class="bookmark-list js-bookmark-list"></ul>
  </div>
    `;
  };

  const generateAddBookmarksListComponent = function(bookmarks) {
    return bookmarks
      .map(bookmark => generateBookmarkElement(bookmark))
      .join('');
  };

  const generateBookmarkElement = function(bookmark) {
    let rating = '';
    if (bookmark.rating) {
      const number_of_stars = bookmark.rating;
      for (let i = 0; i < number_of_stars; i++) {
        rating += '<i class="fas fa-star"></i>';
      }

      for (let i = 0; i < 5 - number_of_stars; i++) {
        rating += '<i class="far fa-star"></i>';
      }
    } else {
      rating = 'No rating yet';
    }

    const desc = bookmark.desc !== '' ? bookmark.desc : 'No description yet';

    let details = bookmark.expanded
      ? `  <p>${desc}</p>
        <a href="${
          bookmark.url
        } class = "visit-site" target = "_blank">Visit site</a>
        <button type = "button" class = "details js-details" > Less Details <i class="fas fa-caret-up"></i> </button>
        `
      : '<button type = "button" class = "details js-details" > More Details <i class="fas fa-caret-down"></i> </button>';

    if (bookmark.editing) {
      const cell = ['', '', '', '', ''];
      cell[bookmark.rating - 1] = 'selected';

      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${
        bookmark.id
      }">
      <p class = "edit-bookmark-title-p js-bookmark-title">${bookmark.title}</p>
      <form class = "editing-form js-editing-form ">
        <label for = "title">Title:</label>
        <input id = "title" name = "title" type = "text" class = "edit-bookmark-title js-edit-bookmark-title" value = "${
          bookmark.title
        }"></input>
        <label for = "url">URL:</label>
        <input id = "url" name = "url" type = "text" class = "edit-bookmark-url js-edit-bookmark-url" value = "${
          bookmark.url
        }"></input>
        <label for = "desc">Description:</label>
        <textarea id = "desc" name = "desc" class = "edit-bookmark-desc js-edit-bookmark-description" value = "${desc}" >${
        bookmark.desc
      }</textarea>
        <label for = "rating">Rating:</label>
        <select id = "rating" name = "rating" class = "input-edit-bookmark-rating js-input-edit-bookmark-rating">
              <option selected disabled>Choose a Rating</option>
              <option ${cell[0]} value="1">1 Star</option>
              <option ${cell[1]} value="2">2 Stars</option>
              <option ${cell[2]} value="3">3 Stars</option>
              <option ${cell[3]} value="4">4 Stars</option>
              <option ${cell[4]} value="5">5 Stars</option>
        </select>
        <output class = "edit-error-message js-edit-error-message"></output>
        <button type = "submit" class = "save-edit-button js-save-edit-button"> Save </button>
        <button type = "button" class = "cancel-edit-button js-cancel-edit-button"> Cancel </button>
      </form> 
    </li>
      `;
    } else {
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${
        bookmark.id
      }">
      <div class = "float-right">
      <button aria-label = "edit bookmark" class = "edit-bookmark  js-edit-bookmark"><i class="fas fa-edit"></i></button>
      <button aria-label = "delete bookmark" class = "delete-bookmark js-delete-bookmark"><i class="fas fa-trash-alt "></i></button>
      </div>
      <p class = "bookmark-title js-bookmark-title">${bookmark.title}</p>
      <div>
        <p>${rating}</p>
        ${details}
      </div>
    </li>
      `;
    }
  };

  const getIdFromBookmark = function(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id');
  };

  const handleAddBookmark = function() {
    $('.js-begin-add-bookmark').click(event => {
      store.toggleAddingABookmark();
      $('form').toggle();

      renderAddBookmarkForm();
    });
  };

  //in charge of the cancel adding bookmark functionality
  const handleCancelAddBookmark = function() {
    //event listener for when user clicks cancel in the form
    $('form').on('click', '.js-cancel-create-bookmark-button', event => {
      //toggle adding in the store
      store.toggleAddingABookmark();
      //toggle the hidden bool for form
      $('form').toggle();
      renderAddBookmarkForm();
    });
  };

  const handleCreateBookmark = function() {
    $('form').on('submit', event => {
      event.preventDefault();
      const newBookmark = $(event.target).serializeJson();
      console.log(newBookmark);
      api.createBookmark(
        newBookmark,
        bookmark => {
          bookmark.expanded = false;
          store.toggleAddingABookmark();
          $('form').toggle();
          store.addBookmark(bookmark);
          store.setError(null);
          renderAddBookmarkForm();
          render();
        },
        error => {
          console.log('error adding');
        }
      );
    });
  };

  $.fn.extend({
    serializeJson: function() {
      const obj = {};
      const data = new FormData(this[0]);
      data.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }
  });

  const render = function() {
    //copy the store bookmarks so we can filter it if necassary, but doesnt change the store itself

    let bookmarks = [...store.bookmarks];

    console.log(bookmarks);
    if (store.filter) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter);
    }

    //generate string from what's in the store
    const html = generateAddBookmarksListComponent(bookmarks);
    $('.js-bookmark-list').html(html);
  };

  const renderAddBookmarkForm = function() {
    if (store.adding) {
      $('.js-adding-new-bookmark-form').html(generateAddBookmarkForm());
    } else {
      $('.js-adding-new-bookmark-form').html('');
    }
  };

  const bindEventListeners = function() {
    handleAddBookmark();
    handleCreateBookmark();
    getIdFromBookmark();
    handleCancelAddBookmark();
  };

  return {
    bindEventListeners,
    render
  };
})();
