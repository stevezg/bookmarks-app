$(document).ready(function() {
  bookmark.bindEventListeners();

  api.getBookmarks(bookmarks => {
    bookmarks.forEach(bookmark => {
      bookmark.expanded = false;
      bookmark.editing = false;
      store.addBookmark(bookmark);
    });
    bookmark.render();
  });
});
