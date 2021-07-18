'use strict';

function onInit() {
    createBooks();
    renderBooks();
    document.querySelector('.first-page').classList.add('active');
}

function renderBooks() {
    var books = getBooks();
    var elTableTBody = document.querySelector('table tbody');
    var strHtmls = books.map(book => {
        return `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}</td>
            <td><button onclick="onReadBook('${book.id}')" class="read-btn">Read</button></td>
            <td><button onclick="onUpdateBook('${book.id}')" class="update-btn">Update</button></td>
            <td><button onclick="onRemoveBook('${book.id}')" class="delete-btn">Delete</button></td>
        </tr>    
        `
    });
    elTableTBody.innerHTML = strHtmls.join('');
}

function onUpdateBook(bookId) {
    var book = getBookById(bookId);
    onAddBook();
    const elBookEditOrAdd = document.querySelector('.book-editor-add');
    const elBookTitleInput = elBookEditOrAdd.querySelector('input[name="title"]');
    const elBookPriceInput = elBookEditOrAdd.querySelector('input[name="price"]');
    
    elBookTitleInput.value = book.title;
    elBookPriceInput.value = book.price;
}

function onRemoveBook(bookId) {
    removeBook(bookId);
    renderBooks();
}

function onAddBook() {
    const elBookEditOrAdd = document.querySelector('.book-editor-add');
    if (elBookEditOrAdd.hidden) {
        elBookEditOrAdd.hidden = false;
    } else elBookEditOrAdd.hidden = true;
}

function onSaveBook() {
    const elBookEditOrAdd = document.querySelector('.book-editor-add');
    const elBookTitleInput = elBookEditOrAdd.querySelector('input[name="title"]');
    const elBookPriceInput = elBookEditOrAdd.querySelector('input[name="price"]');

    const title = elBookTitleInput.value;
    const price = elBookPriceInput.value;
    var book = checkIfBookAlreadyExists(title);
    if (book) {
        updateBook(book.id, price);
    } else {
        addBook(title, price);
    }
    renderBooks();
    elBookTitleInput.value = '';
    elBookPriceInput.value = '';
    elBookEditOrAdd.hidden = true;
}

function onReadBook(bookId) {
    var book = getBookById(bookId);
    var elModal = document.querySelector('.modal');
    elModal.querySelector('h4').innerText = book.title;
    elModal.querySelector('img').src = book.imgUrl;
    elModal.querySelector('p').innerText = book.desc;
    elModal.querySelector('h5').innerText = book.price;
    elModal.hidden = false;
}

function onCloseModal() {
    if(!document.querySelector('.modal').hidden) {
        document.querySelector('.modal').hidden = true;
    } else document.querySelector('.modal').hidden = false;
}

function onRateBook(num) {
    var elSpanRateBook = document.querySelector('.book-rate');
    if (num > 0 && elSpanRateBook.innerHTML < 10) {
        elSpanRateBook.innerHTML++;
    } else if(num < 0 && elSpanRateBook.innerHTML > 0) {
        elSpanRateBook.innerHTML--;
    }
}

function onSortChange(sortBy) {
    setSortBy(sortBy);
    renderBooks();
}

function onNextPage() {
    nextPage();
    renderBooks();
}

function onPrevPage() {
    prevPage();
    renderBooks();
}

function onToFirstPage() {
    const elFirstPage = document.querySelector('.first-page');
    var elBtnPages = document.getElementsByClassName('page');
    for (let i = 0; i < elBtnPages.length; i++) {
        elBtnPages[i].classList.remove('active');
    }
    elFirstPage.classList.add('active');
    getFirstPage();
    renderBooks();
}

function onToSecondPage() {
    const elSecondPage = document.querySelector('.second-page');
    var elBtnPages = document.getElementsByClassName('page');
    for (let i = 0; i < elBtnPages.length; i++) {
        elBtnPages[i].classList.remove('active');
    }
    elSecondPage.classList.add('active');
    getSecondPage();
    renderBooks();
}

function onToThirdPage() {
    const elThirdPage = document.querySelector('.third-page');
    var elBtnPages = document.getElementsByClassName('page');
    for (let i = 0; i < elBtnPages.length; i++) {
        elBtnPages[i].classList.remove('active');
    }
    elThirdPage.classList.add('active');
    getThirdPage();
    renderBooks();
}

function onToFourthPage() {
    const elFourthPage = document.querySelector('.fourth-page');
    var elBtnPages = document.getElementsByClassName('page');
    for (let i = 0; i < elBtnPages.length; i++) {
        elBtnPages[i].classList.remove('active');
    }
    elFourthPage.classList.add('active');
    getFourthPage();
    renderBooks();
}

// function renderPages() {
//     var elPaging = document.querySelector('.paging');

// }