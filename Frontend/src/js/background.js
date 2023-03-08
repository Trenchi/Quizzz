// Switch between Video Wallpaper an Static Wallpaper

var video = document.querySelector('#fullscreen-bg video');
var image = document.querySelector('#fullscreen-bg-image');
var toggleButton = document.querySelector('#fullscreen-bg-toggle');

toggleButton.addEventListener('click', function() {
    if (video.style.display !== 'none') {
        video.style.display = 'none';
        image.style.display = 'block';
        toggleButton.innerHTML = 'Video anzeigen';
    } else {
        video.style.display = 'block';
        image.style.display = 'none';
        toggleButton.innerHTML = 'Bild anzeigen';
    }
});
