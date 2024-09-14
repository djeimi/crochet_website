let flag = 0;
let config;

document.addEventListener('DOMContentLoaded', function() {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            config = data;
        });

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

    document.querySelector('.list_nav').addEventListener('click', function(event) {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const page = event.target.textContent;
            updateCards(page);
            updateNavigation(page);
        }
    });

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

    document.getElementById('arrow_left_pages').addEventListener('click', function() {
        navigateTo(this);
    });

    document.getElementById('arrow_right_pages').addEventListener('click', function() {
        navigateTo(this);
    });
});


function changePhoto(action) {
    if (!config) return;

    let photo = document.querySelector("#slideshow_image");
    
    photo.style.opacity = 0;
    photo.style.transform = 'scale(0.9)';
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
        photo.style.transform = 'scale(1)'; 
    }, 500); 
}

document.addEventListener('DOMContentLoaded', function() {
    setInterval(() => {
        changePhoto('next');
    }, 10000);
});

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