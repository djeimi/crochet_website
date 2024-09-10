let flag = 0;
let config;

document.addEventListener('DOMContentLoaded', function() {
    fetch('config.json')
        .then(response => response.json())
        .then(data => {
            config = data;
        });
});

function changePhoto(action) {
    if (!config) return;

    let photo = document.querySelector("#slideshow_container img");

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
}
