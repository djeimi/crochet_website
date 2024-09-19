let flag = 0;
let config;
let currentFilterPage = 1;
const itemsPerPage = 8;
let currentFilter;
let filterSwitchedOn = false;

document.addEventListener('DOMContentLoaded', function() {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            config = data;
            updateCards(1);
            updateNavigation(1);
        })
        setInterval(() => {
            changePhoto('next');}, 
            10000);

    let cards = document.querySelector('.cards');
    let navLinks = document.querySelectorAll('.list_nav a');
    let initialNavLinksLength = navLinks.length;

    function updateCards(page) {
        const pageData = config[`page${page}`];
        cards.innerHTML = '';
        pageData.forEach(item => {
            let itemArray = item.split(', ');
            let src = itemArray[0];
            let description = itemArray[1];

            const cardItem = document.createElement('li');
            cardItem.classList.add('card_item');
            cardItem.innerHTML = `
                <a>
                    <div class="img_container_cards">
                        <img class="img_cards" src="${src}" alt="${description}">
                    </div>
                    <h2 class="description_cards">${description}</h2>
                </a>
            `;
            cards.appendChild(cardItem);
        });

        scrollToTop();
    }

    function updateNavigation(page) {
        navLinks = document.querySelectorAll('.list_nav a');

        if ((page > initialNavLinksLength - 1) && ((navLinks[navLinks.length-1].textContent - page) >= (initialNavLinksLength - 1))){

            let list = document.querySelector('.list_nav');
            let firstPage = navLinks[0].textContent;
            let lastPage = navLinks[navLinks.length - 1].textContent;
            list.innerHTML = '';

            let dotsItemLeft = document.createElement('li');
            let dotsItemRight = document.createElement('li');
            let linkItem = document.createElement('li');
            let firstLinkItem = document.createElement('li');
            let lastLinkItem = document.createElement('li');
            dotsItemLeft.innerHTML = `
                <div>...</div>
            `;
            dotsItemRight.innerHTML = `
                <div>...</div>
            `;
            linkItem.innerHTML = `
                <a class="link">${page}</a>
            `;
            lastLinkItem.innerHTML = `
                <a class="link">${lastPage}</a>
            `;
            firstLinkItem.innerHTML = `
                <a class="link">${firstPage}</a>
            `;

            list.appendChild(firstLinkItem);
            list.appendChild(dotsItemLeft);
            list.appendChild(linkItem);
            list.appendChild(dotsItemRight);
            list.appendChild(lastLinkItem);
        }
        else{
            if (page < (navLinks[navLinks.length - 1].textContent - page)){

                let list = document.querySelector('.list_nav');
                let firstPage = navLinks[0].textContent;
                let lastPage = navLinks[navLinks.length - 1].textContent;
                list.innerHTML = '';

                let dotsItemRight = document.createElement('li');
                let lastLinkItem = document.createElement('li');

                for (let i = firstPage; i <= initialNavLinksLength - 1; i++){
                    let linkItem = document.createElement('li');
                    linkItem.innerHTML = `
                        <a class="link">${i}</a>
                    `;

                    list.appendChild(linkItem);
                }

                dotsItemRight.innerHTML = `
                    <div>...</div>
                `;
                lastLinkItem.innerHTML = `
                    <a class="link">${lastPage}</a>
                `;

                list.appendChild(dotsItemRight);
                list.appendChild(lastLinkItem);
            }
            else{
                let list = document.querySelector('.list_nav');
                let firstPage = navLinks[0].textContent;
                let lastPage = navLinks[navLinks.length - 1].textContent;
                list.innerHTML = '';

                let dotsItemLeft = document.createElement('li');
                let firstLinkItem = document.createElement('li');

                dotsItemLeft.innerHTML = `
                    <div>...</div>
                `;
                firstLinkItem.innerHTML = `
                    <a class="link">${firstPage}</a>
                `;

                list.appendChild(firstLinkItem);
                list.appendChild(dotsItemLeft);

                for (let i = navLinks[navLinks.length - 1].textContent - initialNavLinksLength + 2; i <= lastPage; i++){
                    let linkItem = document.createElement('li');
                    linkItem.innerHTML = `
                        <a class="link">${i}</a>
                    `;

                    list.appendChild(linkItem);
                }
            }
        }

        navLinks = document.querySelectorAll('.list_nav a');

        navLinks.forEach(link => {
            if (link.textContent === page.toString()) {
                link.parentElement.classList.add('current');
            } else {
                link.parentElement.classList.remove('current');
            }
        });

        let leftArrow = document.getElementById('arrow_left_pages');
        let rightArrow = document.getElementById('arrow_right_pages');

        if (page != 1){
            leftArrow.style.visibility = 'visible';
        }
        else{
            leftArrow.style.visibility = 'hidden';
        }

        if (page == navLinks[navLinks.length-1].textContent){
            rightArrow.style.visibility = 'hidden';
        }
        else{
            rightArrow.style.visibility = 'visible';
        }
    }

    function navigateTo(element){
        let currentPage = document.querySelector('.current');
        let newPage;

        if (element.id.includes('left')){
            newPage = Number(currentPage.textContent) - 1;
        } else {
            newPage = Number(currentPage.textContent) + 1;
        }

        updateCards(newPage);
        updateNavigation(newPage);
    }
    
    document.querySelector('.list_nav').addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            const page = event.target.textContent;
            if (!filterSwitchedOn){
                event.preventDefault();
                updateCards(page);
                updateNavigation(page);
            }
            else{
                if (page > currentFilterPage){
                    currentFilterPage++;
                }
                else{
                    currentFilterPage--;
                }
                updateCardsByFilter(currentFilter);
            }
        }
    });

    document.getElementById('arrow_left_pages').addEventListener('click', function() {
        if (!filterSwitchedOn){
            navigateTo(this);
        }
    });

    document.getElementById('arrow_right_pages').addEventListener('click', function() {
        if (!filterSwitchedOn){
            navigateTo(this);
        }
    });

    document.getElementById('img_container').addEventListener('click', function() {
        filterSwitchedOn = false;
        
        updateCards(1);
        updateNavigation(1);
    });
});

function changePhoto(action) {
    if (!config) return;

    let photo = document.querySelector("#slideshow_image");

    photo.style.opacity = 0;
    setTimeout(() => {
        switch (action) {
            case "next":
                if (flag + 1 < config.slideshow.length) {
                    let value = config.slideshow[flag + 1].split(', ');
                    photo.src = value[0];
                    photo.alt = value[1];
                    ++flag;
                } else {
                    let value = config.slideshow[0].split(', ');
                    photo.src = value[0];
                    photo.alt = value[1];
                    flag = 0;
                }
                break;
            case "prev":
                if (flag - 1 >= 0) {
                    let value = config.slideshow[flag - 1].split(', ');
                    photo.src = value[0];
                    photo.alt = value[1];
                    --flag;
                } else {
                    let value = config.slideshow[config.slideshow.length - 1].split(', ');
                    photo.src = value[0];
                    photo.alt = value[1];
                    flag = config.slideshow.length - 1;
                }
                break;
        }
        photo.style.opacity = 1;
    }, 500);
}

function scrollToTop(){
    document.body.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

window.addEventListener('scroll', function() {
    const currentScrollPosition = window.scrollY;
    let button = document.getElementById("arrow_up");

    if (currentScrollPosition >= 50) {
        button.style.visibility = "visible";
    } else {
        button.style.visibility = "hidden";
    }
});

function openMenu() {
    let menu = document.getElementById("mobile-menu");
    let menuBtn = document.getElementById('mobile-menu-btn');

    if (menuBtn.classList.contains('open')) {
        menu.style.display = "none";
        menuBtn.classList.remove('open');
        menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    } else {
        menu.style.display = "block";
        menuBtn.classList.add('open');
        menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    }
}

function extractPhotos(config) {
    const photos = [];

    for (const key in config) {
        if (key.startsWith('page')) {
            config[key].forEach(item => {
                photos.push(item);
            });
        }
    }

    return photos;
}

function updateCardsByFilter(filter) {
    let cards = document.querySelector('.cards');

    currentFilter = filter;
    filterSwitchedOn = true;

    let photos = extractPhotos(config);

    let filteredPhotos = photos.filter(item => {
        let itemArray = item.split(', ');
        let types = itemArray[2].replace('[','').replace(']','').split(' ');
        return types.includes(filter);
    });

    let totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
    let startIndex = (currentFilterPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    cards.innerHTML = '';
    filteredPhotos.slice(startIndex, endIndex).forEach(item => {
        let itemArray = item.split(', ');
        let src = itemArray[0];
        let description = itemArray[1];
        const cardItem = document.createElement('li');
        cardItem.classList.add('card_item');
        cardItem.innerHTML = `
            <a>
                <div class="img_container_cards">
                    <img class="img_cards" src="${src}" alt="${description}">
                </div>
                <h2 class="description_cards">${description}</h2>
            </a>
        `;
        cards.appendChild(cardItem);
    });

    updateFilterNavigation(totalPages);
}

function updateFilterNavigation(totalPages) {
    let list = document.querySelector('.list_nav');
    list.innerHTML = '';

    if (totalPages <= 1) {
        let linkItem = document.createElement('li');
        linkItem.innerHTML = `
            <a class="link">1</a>
        `;
        list.appendChild(linkItem);
    } else if (totalPages <= 4) {
        for (let i = 1; i <= totalPages; i++) {
            let linkItem = document.createElement('li');
            linkItem.innerHTML = `
                <a class="link">${i}</a>
            `;
            list.appendChild(linkItem);
        }
    } else {
        let firstLinkItem = document.createElement('li');
        let dotsItemLeft = document.createElement('li');
        let dotsItemRight = document.createElement('li');
        let lastLinkItem = document.createElement('li');

        firstLinkItem.innerHTML = `
            <a class="link">1</a>
        `;
        dotsItemLeft.innerHTML = `
            <div>...</div>
        `;
        dotsItemRight.innerHTML = `
            <div>...</div>
        `;
        lastLinkItem.innerHTML = `
            <a class="link">${totalPages}</a>
        `;

        list.appendChild(firstLinkItem);
        list.appendChild(dotsItemLeft);

        for (let i = currentFilterPage - 1; i <= currentFilterPage + 2 && i <= totalPages; i++) {
            if (i > 0) {
                let linkItem = document.createElement('li');
                linkItem.innerHTML = `
                    <a class="link">${i}</a>
                `;
                list.appendChild(linkItem);
            }
        }

        list.appendChild(dotsItemRight);
        list.appendChild(lastLinkItem);
    }

    let navLinks = document.querySelectorAll('.list_nav a');
    navLinks.forEach(link => {
        if (link.textContent === currentFilterPage.toString()) {
            link.parentElement.classList.add('current');
        } else {
            link.parentElement.classList.remove('current');
        }
    });

    let leftArrow = document.getElementById('arrow_left_pages');
    let rightArrow = document.getElementById('arrow_right_pages');

    if (currentFilterPage != 1){
        leftArrow.style.visibility = 'visible';
    }
    else{
        leftArrow.style.visibility = 'hidden';
    }

    if (currentFilterPage == totalPages){
        rightArrow.style.visibility = 'hidden';
    }
    else{
        rightArrow.style.visibility = 'visible';
    }
}

document.getElementById('arrow_left_pages').addEventListener('click', function() {
    if (currentFilterPage > 1) {
        currentFilterPage--;
        updateCardsByFilter(currentFilter);
    }
});

document.getElementById('arrow_right_pages').addEventListener('click', function() {
    let photos = extractPhotos(config);
    let filteredPhotos = photos.filter(item => {
        let itemArray = item.split(', ');
        let types = itemArray[2].replace('[','').replace(']','').split(' ');
        return types.includes(currentFilter);
    });
    let totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);

    if (currentFilterPage < totalPages) {
        currentFilterPage++;
        updateCardsByFilter(currentFilter);
    }
});