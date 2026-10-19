const remove_bar = document.querySelector(".toggle_bar");
const nav_bar = document.querySelector(".main-links");
const page_numbers = document.querySelector("#page-numbers");
const modalWindow = document.querySelector("dialog.modal.main");
const add_book = document.querySelector(".add-book");
const submit_book = document.querySelector("dialog .submit-new-book");
const form = document.querySelector(".modal form")
const clear_button = document.querySelector("dialog .clear-input");
const book_window = document.querySelector(".book-window");
const book_sidebar = document.querySelector(".book-sidebar");
const clear_button_sidebar = document.querySelector(".book-sidebar .clear-input");
const form_sidebar = document.querySelector(".book-sidebar form")
const num_pages = document.querySelector("#page-numbers");
const sorting = document.querySelector("#sorting-books");
const closeButtonDialog = document.querySelector("dialog .close");
const closeButtonSidebar = document.querySelector(".book-sidebar .close");
const remove_button = document.querySelector(".remove-item");
const modalRemove = document.querySelector("dialog.modal.delete");
const delete_item = document.querySelector(".delete-item");
const cancel_delete = document.querySelector(".cancel-delete");
const form_number_of_elems = document.querySelector(".number-of-elems-on-page");
const input_number_of_elems = document.querySelector("#number-of-elems-per-page");
const user_stats_choice = document.querySelector("#user_stats_choice");
const stats_container = document.querySelector(".stats-container");
const stats_favorite = document.querySelector(".stats-favorite");
const stats_rating = document.querySelector(".stats-rating");
const stats_num_pages = document.querySelector(".stats-num_pages");

/*Modal Input Fields*/
const modal_title = document.querySelector("#modal-title");
const modal_author = document.querySelector("#modal-author");
const modal_rating = document.querySelector("#modal-rating");
const modal_favorite = document.querySelector("#modal-favorite");
const modal_review = document.querySelector("#modal-review");
const modal_status = document.querySelector("#modal-status");
const modal_num_pages = document.querySelector("#modal-num-pages");

/*Sidebar Input Fields*/
const sidebar_title = document.querySelector("#sidebar-title");
const sidebar_author = document.querySelector("#sidebar-author");
const sidebar_rating = document.querySelector("#sidebar-rating");
const sidebar_favorite = document.querySelector("#sidebar-favorite");
const sidebar_review = document.querySelector("#sidebar-review");
const sidebar_status = document.querySelector("#sidebar-status");
const sidebar_num_pages = document.querySelector("#sidebar-num-pages");

/*Functions and objects */
let books = [];
let sorted_books = [];
const current_books_showed = new Map();
book_window.number_per_page = 50;
const images = ["./images/book1.jpg","./images/book2.jpg","./images/book3.png",]
function random_elem(array){
    return array[Math.floor(Math.random() * array.length)] 
}
function Book(title,author,rating,favorite,review,status,num_pages){
    if (!new.target){
        throw new Error("Must be called with new")
    }
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.rating = Number(rating);
    this.favorite = (favorite === "true" ? true : false);
    this.review = review;
    this.status = status;
    this.num_pages = Number(num_pages);
    this.img = random_elem(images); //Needed for rendering
}
function create_card(book){
    const book_shown = document.createElement("button");
    book_shown.classList.add("card")
    const book_image = document.createElement("img");
    book_image.src = book.img; //Make sure image is not jumping in rendering. So do not choose img in create_card
    book_image.alt = `Book named: ${book.title}`;
    book_image.classList.add("card-image");
    const text = document.createElement("span");
    text.classList.add("card-text");
    text.textContent = book.title;
    book_shown.appendChild(text);
    book_shown.appendChild(book_image);
    return book_shown;
}

function rewrite_page_numbers(){
    const index = Number(num_pages.value);//Save index
    const placeholder = num_pages.firstElementChild; //Save placeholder
    num_pages.replaceChildren() //Clear previous options
    num_pages.append(placeholder);
    for (let index=0; index < books.length; index+=book_window.number_per_page){
        let option = document.createElement("option");
        option.value = Math.floor(index/book_window.number_per_page) + 1;
        option.textContent = option.value;
        num_pages.append(option);
    }
    //Place user on his page
    //Check if page exists
    //Number conversion is not strict because of < but added for clarity
    if (index < Number(num_pages.lastElementChild.value)){
        num_pages.value = index === 0? 1 : index//0 is not less then 0. So setting 1 is legitimate
    }else{
        //This one for removing book will always go 1 page down. So no special case needed thus removing needing in boolean argument
        //If we have no pages left it will place placeholder since 0 is not less then 0.
        //If index === num_pages.lastElementChild.value this works correctly.
        num_pages.value = num_pages.lastElementChild.value;
    }
}
function check_add(book){
    books.push(book);
    rewrite_page_numbers();
    render();
}
//Perform sorting and render cards
function render(){
    switch(sorting.value){
        case "initial":
            //For optimization consider keeping property to indicate that order is same.
            //But you would have to push elem to sorted_books. 
            sorted_books = books.slice();
            break;
        case "rating":
             sorted_books = books.toSorted((a,b) => b.rating - a.rating);
             break;
        case "favorite":
            sorted_books = books.toSorted((a,b)=> b.favorite - a.favorite);
             break;
        case "title":
            sorted_books = books.toSorted((a,b) => {
                return a.title.localeCompare(b.title);
            });
            break;
        case "author":
            sorted_books = books.toSorted((a,b)=> {
                return a.author.localeCompare(b.author)
            });
            break;
        case "num-pages":
            sorted_books = books.toSorted((a,b)=> b.num_pages - a.num_pages);
            break;
    }
    const customEvent = new Event("change",{bubbles: true});
    num_pages.dispatchEvent(customEvent);
}
/*Event Listeners */
form.addEventListener("submit",(e) =>{
    e.preventDefault();
    const book = new Book(
        modal_title.value,
        modal_author.value,
        modal_rating.value,
        modal_favorite.value,
        modal_review.value,
        modal_status.value,
        modal_num_pages.value,
    );
    check_add(book);
    form.reset();
    modalWindow.close();
});
add_book.addEventListener("click",(e) =>{
    modalWindow.showModal();
});
book_window.addEventListener("click",(e)=>{
    if (e.target === book_window) return;
    const element = e.target.closest(".card"); //Ensure that it will be card and not its child
    book_sidebar.classList.remove("hidden");
    book_sidebar.book_watched = element;
    const book = current_books_showed.get(book_sidebar.book_watched);
    sidebar_title.value = book.title;
    sidebar_author.value = book.author;
    sidebar_rating.value = book.rating;
    sidebar_favorite.value = book.favorite;
    sidebar_review.value = book.review;
    sidebar_status.value = book.status;
    sidebar_num_pages.value = book.num_pages;
})
form_sidebar.addEventListener("submit",(e)=>{
    e.preventDefault()
    const book = current_books_showed.get(book_sidebar.book_watched);
    book.title = sidebar_title.value;
    book.author = sidebar_author.value;
    book.rating = Number(sidebar_rating.value);
    book.favorite = (sidebar_favorite.value === "true" ? true : false);
    book.review = sidebar_review.value;
    book.status = sidebar_status.value;
    book.num_pages = Number(sidebar_num_pages.value);
    render(); //Rerender page. This will ensure title changes. May be optimized in future(just changing title)
});
clear_button_sidebar.addEventListener("click",(e)=>{
    form_sidebar.reset();
})
clear_button.addEventListener("click",(e)=>{
    form.reset();
})
remove_bar.addEventListener("click", function() {
    nav_bar.classList.toggle("removed");
});
num_pages.addEventListener("change",(e)=>{
    book_sidebar.classList.add("hidden"); //Since we are rerendering page this elem would not exist.Prevent errors by submitting to non-existing book                    
    form_sidebar.reset();
    book_sidebar.book_watched = undefined;
    current_books_showed.clear();
    book_window.replaceChildren(); //Clear grid
    const new_books = sorted_books.slice((num_pages.value - 1)* book_window.number_per_page, num_pages.value * book_window.number_per_page);
    book_window.append(...new_books.map(function (elem){
        const card = create_card(elem); //Check add is not needed
        current_books_showed.set(card,elem);
        return card;
    }));
    //Make sure to update_stats. May be optimized in future(to update only this page stats.Thought is not compatible with current version)
    user_stats_choice.dispatchEvent(new Event("change",{bubbles: true})); 
});
closeButtonDialog.addEventListener("click",(e) =>{
    modalWindow.close();
});
closeButtonSidebar.addEventListener("click",(e) =>{
    book_sidebar.classList.add("hidden");
});
sorting.addEventListener("change",(e)=>{
    render(); //Sort and render elems on current page.
});
remove_button.addEventListener("click",(e)=>{
    modalRemove.showModal();
});
cancel_delete.addEventListener("click",(e)=>{
    modalRemove.close();
});
delete_item.addEventListener("click",(e)=>{
    const book = current_books_showed.get(book_sidebar.book_watched);
    current_books_showed.delete(book_sidebar.book_watched);
    books.splice(books.findIndex((elem) => elem.id === book.id),1);
    rewrite_page_numbers();
    render(); //This will close sidebar and rerender page
    modalRemove.close();
});
//Encompassed in form for native browser validation
form_number_of_elems.addEventListener("submit",(e)=>{
    e.preventDefault();
    book_window.number_per_page = Number(input_number_of_elems.value);
    rewrite_page_numbers();
    render();
})
user_stats_choice.addEventListener("change",(e)=>{
    //Ensure when there is no elems on page stats will be hidden. 
    if (books.length < 1) {
        stats_container.classList.add("hidden");
        return;
    }
    stats_container.classList.remove("hidden"); //reveal stats
    //In future for optimization divs must be transported to HTML
    const subject = user_stats_choice.value === "all_pages" ? books : Array.from(current_books_showed.values());
    const size = subject.length;
    let favorites = 0;
    let not_favorites = 0;
    let favorites_rate;
    for (const elem of subject){
        if (elem.favorite){ //If you want to just make favorite + Boolean(elem.favorite) for conciness
            favorites += 1;
        }else{
            not_favorites += 1;
        }
    }
    favorites_rate = (favorites/size * 100); //size is always greater then zero
    const favorites_rate_string = document.createElement("div");
    const favorites_string = document.createElement("div");
    const not_favorites_string = document.createElement("div");
    favorites_rate_string.textContent = `Favorites_rate: ${favorites_rate.toFixed(2)}%`;
    favorites_string.textContent = `Number of favorites: ${favorites}`;
    not_favorites_string.textContent = `Number of not favorites: ${not_favorites}`;
    stats_favorite.replaceChildren(
        favorites_rate_string,
        favorites_string,
        not_favorites_string,
    )
    let five_stars = 0;
    let four_stars = 0;
    let three_stars = 0;
    let two_stars = 0;
    let one_star = 0;
    let average_rating = 0;
    for (const elem of subject){
        average_rating += elem.rating;
        switch(elem.rating){
            case 5:
                five_stars += 1;
                break;
            case 4:
                four_stars += 1;
                break;
            case 3:
                three_stars += 1;
                break;
            case 2:
                two_stars += 1;
                break;
            case 1:
                one_star += 1;
                break;
        }
    }
    average_rating = average_rating / size;//size is always greater then zero
    const five_stars_string = document.createElement("div")
    const four_stars_string = document.createElement("div")
    const three_stars_string = document.createElement("div")
    const two_stars_string = document.createElement("div")
    const one_star_string = document.createElement("div")
    const average_rating_string = document.createElement("div");
    five_stars_string.textContent = `"⭐⭐⭐⭐⭐":  ${five_stars}`;
    four_stars_string.textContent = `"⭐⭐⭐⭐":  ${four_stars}`;
    three_stars_string.textContent = `"⭐⭐⭐":  ${three_stars}`;
    two_stars_string.textContent = `"⭐⭐":  ${two_stars}`;
    one_star_string.textContent = `"⭐":  ${one_star}`;
    average_rating_string.textContent = `Average rating:  ${average_rating.toFixed(2)}`;
    stats_rating.replaceChildren(
        five_stars_string,
        four_stars_string,
        three_stars_string,
        two_stars_string,
        one_star_string,
        average_rating_string
    )
    let average_num_pages = 0;
    for (const elem of subject){
        average_num_pages += elem.num_pages;
    }
    average_num_pages = average_num_pages / size; //size is always greater then zero
    const average_num_pages_string = document.createElement("div");
    average_num_pages_string.textContent = `Average number of pages is   ${average_num_pages.toFixed(2)}`
    stats_num_pages.replaceChildren(average_num_pages_string);
})