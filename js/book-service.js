'use strict';

const gTitle = ['Harry Potter and the Philosophers Stone', 'Harry Potter and the Chamber of Secrets', 'Harry Potter and the Prisoner of Azkaban', 'Harry Potter and the Goblet of Fire', 'Harry Potter and the Order of the Phoenix', 'Harry Potter and the Half Blood Prince', 'Harry Potter and the Deathly Hallows', 'The Hobbit', 'The Lord of The Rings And The Fellowship of The Ring', 'The Lord of The Rings and The Two Towers', 'The Lord of The Rings and The Return of the King', 'Percy Jackson and The Lightning Thief', 'Percy Jackson and The Sea of Monsters', 'Percy Jackson and The Titans Curse', 'Percy Jackson and The Battle of The Labyrinth', 'Percy Jackson and The Last Olympian', 'I, Robot', 'The Book of Five Rings', 'Robinson Crusoe', 'Itamars Squad'];
const KEY = 'books';
var gBooks;
const PAGE_SIZE = 5;
var gPageIdx = 0;
var gSortBy = 'title';

function createBooks() {
    var books = loadFromStorage(KEY);
    if (!books || !books.length) {
        books = [];
        for (let i = 0; i < 20; i++) {
            const bookImgUrl = `../img/${gTitle[i]}.jpg`;
            const book = _createBook(gTitle[i], 0, bookImgUrl);
            book.i = i;
            books.push(book);
        }
    }
    gBooks = books;
    _saveBooksToStorage();
}

function _createBook(title, price, imgUrl) {
    if (!price) price = getRandomIntInclusive(20,100);
    return {
        id: makeId(),
        title: title,
        price: price,
        imgUrl: imgUrl,
        desc: makeLorem()
    }
}

function getBooks() {
    var startIdx = gPageIdx * PAGE_SIZE;
    gBooks.sort(bookComparator);
    return gBooks.slice(startIdx, startIdx + PAGE_SIZE);
}

function _saveBooksToStorage() {
    saveToStorage(KEY, gBooks);
}

function removeBook(bookId) {
    var bookIdx = gBooks.findIndex(book => bookId === book.id);
    gBooks.splice(bookIdx, 1);
    _saveBooksToStorage();
}

function addBook(name, price) {
    const imgUrl = 'img/randombook.jpg'
    var book = _createBook(name, price, imgUrl);
    gBooks.unshift(book);
    _saveBooksToStorage();
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId);
    book.price = newPrice;
    _saveBooksToStorage();
}

function getBookById(bookId) {
    var book = gBooks.find(chosenBook => bookId=== chosenBook.id);
    return book;
}

function checkIfBookAlreadyExists(bookTitle) {
    var book = gBooks.find(chosenBook => bookTitle === chosenBook.title);
    return book;
}

function bookComparator(book1, book2) {
    switch (gSortBy) {
        case 'title':
            if (book1.title.toLowerCase() > book2.title.toLowerCase()) return 1;
            if (book1.title.toLowerCase() < book2.title.toLowerCase()) return -1;
            return 0;
        case 'price':
            return book1[gSortBy] - book2[gSortBy];
    }
}

function setSortBy(sortBy) {
    gSortBy = sortBy;

}

function getCurrentPage() {
    return gPageIdx;
}

function nextPage() {
    if (gPageIdx < (gBooks.length - PAGE_SIZE)/PAGE_SIZE) gPageIdx++;
    else return;
}

function prevPage() {
    if (gPageIdx > 0) gPageIdx--;
    else return;
}

function getFirstPage() {
    gPageIdx = 0;    
}

function getSecondPage() {
    gPageIdx = 1;
}

function getThirdPage() {
    gPageIdx = 2;
}

function getFourthPage() {
    gPageIdx = 3;
}
