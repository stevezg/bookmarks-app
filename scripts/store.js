'use strict';

const store = (function() {
  const bookmarks = [];
  const filter = null;
  const error = null;
  const adding = false;

  const addBookmark = function(bookmark) {
    this.bookmarks.push(bookmark);
  };

  const findBookmarkById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const toggleAddingABookmark = function() {
    store.adding = !store.adding;
  };

  return {
    bookmarks,
    filter,
    error,
    adding,
    addBookmark,

    findBookmarkById,
    toggleAddingABookmark
  };
})();
