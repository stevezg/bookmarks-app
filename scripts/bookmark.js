const bookmark = (function() {
  const generateAddBookmarkForm = function() {
    return `
    <h2 class="page-title">Create a new Bookmark📚🔖</h2>
    <label for="title">Title</label> 
    <input
      required="true"
      id="title"
      name="title"
      type="text"
      class="input-bookmark-title" placeholder="enter title" />
    <label for="url">Link</label>
    <input
      required="true"
      id="url"
      type="text"
      class="input-bookmark-url"
      placeholder="must start with https://"
      name="url"
    />
    
    <textarea
      rows="10"
      cols="65"
      type="text"
      id="desc"
      name="desc"
      class="input-bookmark-desc"
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
    `
  }

  const generateAddBookmarksListComponent = function(bookmarks) {
    return bookmarks.map(bookmark => generateBookmarkElement(bookmark)).join('')
  }

  const generateBookmarkElement = function(bookmark) {
    let rating = ''
    if (bookmark.rating) {
      const number_of_stars = bookmark.rating
      for (let i = 0; i < number_of_stars; i++) {
        rating += '<i class="fas fa-star"></i>'
      }

      for (let i = 0; i < 5 - number_of_stars; i++) {
        rating += '<i class="far fa-star"></i>'
      }
    } else {
      rating = ''
    }

    const desc = bookmark.desc !== '' ? bookmark.desc : ''

    const details = bookmark.expanded
      ? `<p>${desc}</p>
        <a href="${
          bookmark.url
        }" class = "visit-site" target = "_blank">Visit site</a>
        <button type = "button" class = "details js-details" > Less Details <i class="fas fa-caret-up"></i> </button>
        `
      : '<button type = "button" class = "details js-details" > More Details <i class="fas fa-caret-down"></i> </button>'

    if (bookmark.editing) {
      const cell = ['', '', '', '', '']
      cell[bookmark.rating - 1] = 'selected'

      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${
        bookmark.id
      }">
      <p class = "edit-bookmark-title-p js-bookmark-title">${bookmark.title}</p>
      <form class = "editing-form js-editing-form ">
        <label for = "title">Title:</label>
        <input required = "true" id = "title" name = "title" type = "text" class = "edit-bookmark-title js-edit-bookmark-title" value = "${
          bookmark.title
        }"></input>
        <label for = "url">Link</label>
        <input 
          required = "true"
          id = "url" 
          name = "url" 
          type = "text" 
          class = "edit-bookmark-url js-edit-bookmark-url" 
          value = "${bookmark.url}"/>
        <label for = "desc">Description:</label>
        <textarea id = "desc" name = "desc" class = "edit-bookmark-desc js-edit-bookmark-desc" value = "${desc}" >${
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
      `
    } else {
      return `
      <li class = "bookmark-element js-bookmark-element" data-bookmark-id = "${
        bookmark.id
      }">
      <div class = "float-right">
      <p class = "bookmark-title js-bookmark-title">${bookmark.title}</p>
      <button aria-label = "edit bookmark" class = "edit-bookmark  js-edit-bookmark">edit</button>
      <button aria-label = "delete bookmark" class = "delete-bookmark js-delete-bookmark">delete</button>
      </div>
 
      <div>
        <p>${rating}</p>
        ${details}
      </div>
    </li>
      `
    }
  }

  const getIdFromBookmark = function(bookmark) {
    return $(bookmark)
      .closest('.js-bookmark-element')
      .data('bookmark-id')
  }

  const handleAddBookmark = function() {
    $('.js-begin-add-bookmark').click(event => {
      store.toggleAddingABookmark()
      $('form').toggle()

      renderAddBookmarkForm()
    })
  }

  const handleCancelAddBookmark = function() {
    $('form').on('click', '.cancel-create-bookmark-button', event => {
      store.toggleAddingABookmark()
      $('form').toggle()
      renderAddBookmarkForm()
    })
  }

  const handleCreateBookmark = function() {
    $('form').on('submit', event => {
      event.preventDefault()
      const newBookmark = $(event.target).serializeJson()

      // console.log(newBookmark);

      api.createBookmark(
        newBookmark,
        bookmark => {
          bookmark.expanded = false
          store.toggleAddingABookmark()
          $('form').toggle()
          store.addBookmark(bookmark)
          renderAddBookmarkForm()
          render()
        },
        error => {
          console.log('error adding')
        }
      )
    })
  }

  $.fn.extend({
    serializeJson: function() {
      const obj = {}
      const data = new FormData(this[0])
      data.forEach((value, key) => {
        obj[key] = value
      })
      return obj
    }
  })

  const handleDeleteBookmark = function() {
    $('.js-bookmark-list').on('click', '.js-delete-bookmark', event => {
      const id = getIdFromBookmark(event.target)
      api.deleteBookmark(id, () => {
        store.findAndDelete(id)
        render()
      })
    })
  }

  const handleExpandBookmark = function() {
    $('.js-bookmark-list').on('click', '.js-details', event => {
      const id = getIdFromBookmark(event.target)
      store.toggleExpandedBookmark(id)
      render()
    })
  }

  const handleEditingBookmark = function() {
    $('.js-bookmark-list').on('click', '.js-edit-bookmark', event => {
      const id = getIdFromBookmark(event.target)
      store.toggleEditBookmark(id)
      render()
    })
  }

  const handleCancelEditBookmark = function() {
    $('.js-bookmark-list').on('click', '.js-cancel-edit-button', event => {
      const bookmark = $(event.target).closest('.js-bookmark-element')
      const id = getIdFromBookmark(bookmark)
      store.toggleEditBookmark(id)
      render()
    })
  }
  const handleSaveEditBookmark = function() {
    $('.js-bookmark-list').on('submit', '.js-editing-form', event => {
      event.preventDefault()
      const newBookmark = $(event.target).serializeJson()
      // console.log(newBookmark);
      const currentBookmark = $(event.target).closest('.js-bookmark-element')

      const id = getIdFromBookmark(currentBookmark)

      api.updateBookmark(
        newBookmark,
        id,
        () => {
          newBookmark.expanded = false
          store.updateBookmark(newBookmark, id)
          store.toggleEditBookmark(id)
          render()
        },

        error => {
          console.log('there was an error')
        }
      )
    })
  }

  const handleFilterRatings = function() {
    $('.js-filter-rating-dropdown').change(event => {
      const filter_rating = $('.js-filter-rating-dropdown').val()
      store.setFilterRating(filter_rating)

      render()
    })
  }

  const showErrorMessage = function(error) {
    $('.js-error-message').html(error)
  }

  const showErrorMessageEdit = function(error) {
    $('.js-edit-error-message').html(error)
  }

  const render = function() {
    let bookmarks = [...store.bookmarks]

    console.log(bookmarks)

    if (store.filter) {
      bookmarks = bookmarks.filter(bookmark => bookmark.rating >= store.filter)
    }

    const html = generateAddBookmarksListComponent(bookmarks)
    $('.js-bookmark-list').html(html)
  }

  const renderAddBookmarkForm = function() {
    if (store.adding) {
      $('.js-adding-new-bookmark-form').html(generateAddBookmarkForm())
    } else {
      $('.js-adding-new-bookmark-form').html('')
    }
  }

  const bindEventListeners = function() {
    handleAddBookmark()
    handleCreateBookmark()
    getIdFromBookmark()
    handleCancelAddBookmark()
    handleDeleteBookmark()
    handleExpandBookmark()
    handleEditingBookmark()
    handleSaveEditBookmark()
    handleCancelEditBookmark()
    handleFilterRatings()
    showErrorMessage()
    showErrorMessageEdit()
  }

  return {
    bindEventListeners,
    render
  }
})()
