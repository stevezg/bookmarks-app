const api = (function() {
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/steve';

  const getBookmarks = function(callback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'GET',
      contentType: 'application/json',
      success: callback
    });
  };

  const createBookmark = function(newBookmark, callback, error) {
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newBookmark),
      success: callback,
      error: error
    });
  };

  const updateBookmark = function(updatedData, id, callback, error) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify(updatedData),
      success: callback,
      error: error
    });
  };

  const deleteBookmark = function(id, callback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: callback
    });
  };

  return {
    getBookmarks,
    createBookmark,
    deleteBookmark,
    updateBookmark
  };
})();
