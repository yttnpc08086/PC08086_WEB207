function playVideo(file) {
    var thumbnail = document.getElementById("thumbnail");
    var playButton = document.querySelector(".play-btn");
    var myvideo = document.getElementById("myvideo");
    thumbnail.style.display = "none";
    playButton.style.display = "none";
    myvideo.src = file;
    myvideo.style.display = "block";
    myvideo.play();
};