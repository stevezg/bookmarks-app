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

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const toggleExpandedBookmark = function(id) {
    const bookmark = this.findBookmarkById(id);
    bookmark.expanded = !bookmark.expanded;
  };

  const toggleEditBookmark = function(id) {
    const bookmark = this.findBookmarkById(id);
    bookmark.editing = !bookmark.editing;
  };

  const setFilterRating = function(filter_rating) {
    this.filter = filter_rating;
  };

  const updateBookmark = function(newBookmark, id) {
    const bookmark = this.findBookmarkById(id);
    Object.assign(bookmark, newBookmark);
  };
  const setError = function(error) {
    this.error = error;
    
  };

  return {
    bookmarks,
    filter,
    error,
    adding,
    addBookmark,

    findBookmarkById,
    toggleAddingABookmark,
    updateBookmark,
    setFilterRating,
    toggleEditBookmark,
    toggleExpandedBookmark,
    findAndDelete,
    setError
  };
})();
