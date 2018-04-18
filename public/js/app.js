// invoke functions
$(function() {
    getAndDisplayBooks();
})

const MOCK_BOOKS = {
    "books": [
        {
            "id": "1111111",
            "title": "mock book 1",
            "author": "mock author 1",
            "isbn": 1111111111,
            "description": "mock desc 1",
            "book_added": "2018-04-01",
            "book_modified": "2018-04-02",
            "rating_avg": 0,
            "rating_user": 3,
            "image_link": "./defaultBook.png"
        },
        {
            "id": "2222222",
            "title": "mock book 2",
            "author": "mock author 2",
            "isbn": 2222222222,
            "description": "mock desc 2",
            "book_added": "2018-04-02",
            "book_modified": "2018-04-03",
            "rating_avg": 1,
            "rating_user": 1,
            "image_link": "./defaultBook.png"
        },
        {
            "id": "333333",
            "title": "mock book 3",
            "author": "mock author 3",
            "isbn": 3333333333,
            "description": "mock desc 3",
            "book_added": "2018-04-03",
            "book_modified": "2018-04-04",
            "rating_avg": 2,
            "rating_user": 4,
            "image_link": "./defaultBook.png"
        },
        {
            "id": "4444444",
            "title": "mock book 4",
            "author": "mock author 4",
            "isbn": 444444444,
            "description": "mock desc 4",
            "book_added": "2018-04-04",
            "book_modified": "2018-04-05",
            "rating_avg": 3,
            "rating_user": 2,
            "image_link": "./defaultBook.png"
        }
    ]
};

// EVENT LISTENERS

//handle add book button click on homepage
// display the add book interface
$('#add-book-btn').on('click', function() {
    $('.add-book-background').removeClass('hidden');
    $('.add-book-dialog').removeClass('hidden');
});
// handle escaping from add book dialog
// hide modal
$('.add-book-dialog').on('click', '.close-btn', function() {
    $('.add-book-background').addClass('hidden');
    $('.add-book-dialog').addClass('hidden');
    $('.book-result-dialog').html('').addClass('hidden');
    getAndDisplayBooks();
});
$('.book-result-dialog').on('click', '.close-btn', function() {
    console.log('closing book result');
    $('.book-result-dialog').addClass('hidden');
    $('.selected-book img').remove();
});
// user submits search for book
// get book results from google api and call renderAllVolumes fn
$('.add-book-form').on('submit', function(event) {
    event.preventDefault();
    const SEARCH_STRING = $('#book-search').val();
    $('.book-searchresults').children().remove();
    searchAllVolumes(SEARCH_STRING, renderAllVolumes)
});
$('.book-searchresults').on('click', '.result', function() {
    let selectedBookId = $(this).attr('id');
    console.log(`clicked book ${selectedBookId}`);
    $('.book-result-background').removeClass('hidden');
    $('.book-result-dialog').removeClass('hidden');
    searchSingleVolume(selectedBookId, renderSingleVolume)
});
// gets bookId, looks up book, calls addToShelf fn
$('.book-result-dialog').on('click', '.add-to-shelf-btn', function() {
    let selectedBookId = $(this).parent().attr('id');
    console.log(selectedBookId);
    searchSingleVolume(selectedBookId, addToShelf);
});
$('.book-result-dialog').on('click', '.view-books-btn', function() {
    getAndDisplayBooks();
});
$('.book-result-dialog').on('click', '.book-result-close', function() {
    $('.book-result-dialog').html('');
    $('.book-result-dialog').addClass('hidden');
});

$('.user-books').on('click', '.result', function() {
    const selectedBookId = $(this).attr('id');
    const userBook = MOCK_BOOKS.books.find( x => x.id === selectedBookId);
    console.log(userBook);
})
// RENDERING FUNCTIONS

// renders all books returned from query in accordion
let renderAllVolumes = function(bookResults) {   
    console.log(bookResults);
    bookResults.forEach( (book) => {

        let author = book.volumeInfo.authors[0];
        let description = book.volumeInfo.description;
        let imageLink;
        if(typeof book.volumeInfo.imageLinks != 'undefined') {
            if(typeof book.volumeInfo.imageLinks.smallThumbnail != 'undefined') {
                imageLink = book.volumeInfo.imageLinks.smallThumbnail;
            } else if (typeof book.volumeInfo.imageLinks.thumbnail != 'undefined') {
                imageLink = book.volumeInfo.imageLinks.thumbnail;
            }
        } else {
            imageLink = "./defaultBook.png" // SET TO DEFAULT IMAGE 
        }
    
        let bookResultItem = `
            <div class="result" id="${book.id}">
                <img src="${imageLink}" alt="book image"/>
                <p> ${book.volumeInfo.title}</p>
                <h5>by ${author}</h5>
            </div>`
        $('.book-searchresults').append(bookResultItem);
    })
}

function renderSingleVolume(book) {
    console.log(book);
    let author = book.volumeInfo.authors[0];
    let description = book.volumeInfo.description;
    let imageLink;
    if(typeof book.volumeInfo.imageLinks != 'undefined') {
        if(typeof book.volumeInfo.imageLinks.smallThumbnail != 'undefined') {
            imageLink = book.volumeInfo.imageLinks.smallThumbnail;
        } else if (typeof book.volumeInfo.imageLinks.thumbnail != 'undefined') {
            imageLink = book.volumeInfo.imageLinks.thumbnail;
        }
    } else {
        imageLink = "./defaultBook.png" // SET TO DEFAULT IMAGE 
    }
    let bookResultItem = `
    <div class="selected-book" id="${book.id}">
        <a class="close-btn"></a>
        <img src="${imageLink}" alt="book image"/>
        <p> ${book.volumeInfo.title}</p>
        <h5>by ${author}</h5>
        <p>${description}</p>
        <button class="add-to-shelf-btn">Add to Shelf</button>
        <button class="view-books-btn">View books</button>
    </div>`
    $('.book-result-dialog').html(bookResultItem);
}

// render the users books in the view
function renderUserBooks(data) {
    data.books.forEach( (book) => {
        console.log(book.image_link);
        let userBook = 
        `<div class="result" id="${book.id}">
            <img src="${book.image_link}" alt="book image"/>
            <p> ${book.title}</p>
            <h5>by ${book.author}</h5>
        </div>`
        
        $('.user-books').append(userBook);
    })
}

// builds book object, calls api to create new book
function addToShelf(book) {
    let isbn_index = 0;
    if(book.volumeInfo.industryIdentifiers.length > 1) {
        isbn_index = 1;
    }
    let imageLink;
    if(typeof book.volumeInfo.imageLinks != 'undefined') {
        if(typeof book.volumeInfo.imageLinks.smallThumbnail != 'undefined') {
            imageLink = book.volumeInfo.imageLinks.smallThumbnail;
        } else if (typeof book.volumeInfo.imageLinks.thumbnail != 'undefined') {
            imageLink = book.volumeInfo.imageLinks.thumbnail;
        }
    } else {
        imageLink = "./defaultBook.png" // SET TO DEFAULT IMAGE 
    }
    let bookObj = {
        "title": book.volumeInfo.title,
        "author": book.volumeInfo.authors[0],
        "isbn": book.volumeInfo.industryIdentifiers[isbn_index].identifier,
        "description": book.volumeInfo.description,
        "book_added": Date.now(),
        "book_modified": Date.now(),
        "rating_avg": book.volumeInfo.averageRating || 'None',
        "rating_user": 0,
        "image_link": imageLink
    }
    // CALL API ENDPOINT TO CREATE BOOK
    console.log(bookObj);
    MOCK_BOOKS.books.push(bookObj);
    console.log(MOCK_BOOKS.books);
}

function getAllBooks(callbackFn) {
    setTimeout(function(){ callbackFn(MOCK_BOOKS)}, 1000);
    
    // ajax call to API to get books
}

// empty shelf view and populate with latest books
function getAndDisplayBooks() {
    $('.user-books').children().remove();
    getAllBooks(renderUserBooks);
    $('.add-book-background').addClass('hidden');
    $('.add-book-dialog').addClass('hidden');
    $('.book-result-dialog').addClass('hidden');
}