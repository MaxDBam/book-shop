'use strict';

function onInit() {
    createBooks();
    renderBooks();
    renderPages();
    document.querySelector('.prev-page').disabled = checkIfFirstPage();
    document.querySelector('.next-page').disabled = checkIfLastPage();
    document.querySelector('.first-page').classList.add('active');
    document.querySelector('.first-page').style.cursor = 'auto';
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

function renderPages() {
    var books = getSumOfBooks();
    var elPaging = document.querySelector('.paging');
    var numOfPages = 0;
    var strHtmls = books.map((book, idx) => {
        if (idx % PAGE_SIZE === 0) {
            const isItTheFirstPage = (numOfPages === 0) ? 'first-page' : '';
            numOfPages++;
            return `<button class="${isItTheFirstPage} page" data-page="${numOfPages}" onclick="onToADiffPage(this)">${numOfPages}</button>`
        }
    });
    const disabledBtnOrNot = (checkIfFirstPage() || checkIfLastPage()) ? 'disabled' : '';
    elPaging.innerHTML = `<button class="prev-page" onclick="onPrevPage()" ${disabledBtnOrNot}>&lt;&lt;</button>`;
    // elPaging.innerHTML += '<button class="first-page page" onclick="onToFirstPage()">1</button>';
    elPaging.innerHTML += strHtmls.join('');
    elPaging.innerHTML += `<button class="next-page" onclick="onNextPage()" ${disabledBtnOrNot}>&gt;&gt;</button>`;
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
    renderPages();
    onToADiffPage('', 'delete');
    renderDefaultCursorIfFirstOrLastPage();
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
    renderPages();
    onToADiffPage('', 'create')
    renderDefaultCursorIfFirstOrLastPage();
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
    if (!document.querySelector('.modal').hidden) {
        document.querySelector('.modal').hidden = true;
    } else document.querySelector('.modal').hidden = false;
}

function onRateBook(num) {
    var elSpanRateBook = document.querySelector('.book-rate');
    if (num > 0 && elSpanRateBook.innerHTML < 10) {
        elSpanRateBook.innerHTML++;
    } else if (num < 0 && elSpanRateBook.innerHTML > 0) {
        elSpanRateBook.innerHTML--;
    }
}

function onSortChange(sortBy) {
    setSortBy(sortBy);
    renderBooks();
}

function onNextPage() {
    nextPage();
    const currPage = getCurrentPage();
    const elPages = document.querySelectorAll('.page');

    elPages.forEach(function (btn, idx) {
        if ((currPage + 1).toString() === elPages[idx].dataset.page) {
            elPages[idx].classList.add('active');
            elPages[idx].style.cursor = 'auto';
        } else {
            elPages[idx].classList.remove('active');
            elPages[idx].style.cursor = 'pointer';
        } 
    });
    renderDefaultCursorIfFirstOrLastPage();
    renderBooks();
}

function onPrevPage() {
    prevPage();
    var currPage = getCurrentPage();
    const elPages = document.querySelectorAll('.page');

    elPages.forEach(function (btn, idx) {
        if ((currPage + 1).toString() === elPages[idx].dataset.page) {
            elPages[idx].classList.add('active');
            elPages[idx].style.cursor = 'auto';
        } else {
            elPages[idx].classList.remove('active');
            elPages[idx].style.cursor = 'pointer';
        } 
    });
    renderDefaultCursorIfFirstOrLastPage();
    renderBooks();
}

function onToADiffPage(page, action) {
    renderPages();
    const diffPage = document.querySelectorAll('.page');
    var clickedPage;
    if (!page && getCurrentPage() < getSumOfBooks().length / PAGE_SIZE) {
        page = getCurrentPage() + 1;
    } else if (!page && getCurrentPage() === getSumOfBooks().length / PAGE_SIZE) {
        page = getCurrentPage();
    } else clickedPage = page.dataset.page;

    diffPage.forEach(function (btn, idx) {
        if (clickedPage !== '' && diffPage[idx].dataset.page === clickedPage) {
            diffPage[idx].classList.add('active');
            diffPage[idx].style.cursor = 'auto';
        } else if (!clickedPage && diffPage[idx].dataset.page === page.toString()) {
            diffPage[idx].classList.add('active');
            diffPage[idx].style.cursor = 'auto';
        } else {
            diffPage[idx].classList.remove('active');
            diffPage[idx].style.cursor = 'pointer';
        }
    });
    getDiffPage(page, action);
    renderBooks();
    renderDefaultCursorIfFirstOrLastPage();
}

function renderDefaultCursorIfFirstOrLastPage() {
    document.querySelector('.prev-page').disabled = checkIfFirstPage();
    document.querySelector('.next-page').disabled = checkIfLastPage();
    if (checkIfFirstPage()) {
        document.querySelector('.prev-page').style.cursor = 'auto';
    } 
    else {
        document.querySelector('.prev-page').style.cursor = 'pointer';
    }
    document.querySelector('.next-page').disabled = checkIfLastPage();
    if (checkIfLastPage()) {
        document.querySelector('.next-page').style.cursor = 'auto';
    } 
    else {
        document.querySelector('.next-page').style.cursor = 'pointer';
    }
}
