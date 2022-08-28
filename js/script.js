const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
HideMusicBtn = musicList.querySelector("#close");


let musicIndex = Math.floor((Math.random() * allMusic.length)+1);

window.addEventListener("load",()=>{
    loadMusic(musicIndex);
    playingNow();
})

//load music function 

function loadMusic(indexNumb)
{
   musicName.innerText = allMusic[indexNumb-1].name;
   musicArtist.innerText = allMusic[indexNumb-1].artist;
   musicImg.src = `images/${allMusic[indexNumb-1].img}.jpg`;
   mainAudio.src= `songs/${allMusic[indexNumb-1].src}.mp3`;
}

// play music function
function playMusic()
{
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

// pause music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
// next music function
function nextMusic(){
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}

// previous music function
function prevMusic(){
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}

// play/pause music btn event

playPauseBtn.addEventListener("click",()=>{
    const isMusicPlay = wrapper.classList.contains("paused");
    isMusicPlay ? pauseMusic() : playMusic();
    playingNow();
});

// next music btn event
nextBtn.addEventListener("click",()=>{
    nextMusic();
})

// prev music btn event
prevBtn.addEventListener("click",()=>{
    prevMusic();
})

// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate",(e)=>{
     const currentTime = e.target.currentTime; //getting current time of song
     const duration = e.target.duration;  //getting total duration of song
    let progressWidth = (currentTime/duration) * 100 ;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current"),
     musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata",()=>{

        //  update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec<10){ //adding 0 if total sec is less than 10
            totalSec = `0{totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
       
    });
    //  update playing song current time 
    let currentMin = Math.floor(currentTime/60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec<10){ //adding 0 if total sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

// Let's update playing song current time according to progress bar width
progressArea.addEventListener("click",(e)=>{
    let progressWidthval = progressArea.clientWidth; //getting width of progress bar
    let clickedOffSetX = e.offsetX ; // getting offset x value
    let songDuration = mainAudio.duration ; //getting song total duration

    mainAudio.currentTime = (clickedOffSetX/ progressWidthval) * songDuration ;
    playMusic();
    
})

// Let's work on the repeat , suffle  song according to the icon

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
    // first we get the innnerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting inner text of icon
    // let's do different changes on differrent icon click 
    switch(getText)
    {
        case "repeat" : repeatBtn.innerText = "repeat_one";
        repeatBtn.setAttribute("title","Song Looped")                
        break;
        case "repeat_one": repeatBtn.innerText = "shuffle";
        repeatBtn.setAttribute("title","Playback Shuffled")               
        break;
        case "shuffle": repeatBtn.innerText = "repeat";
        repeatBtn.setAttribute("title","Playlist Looped")                
        break;
    }
});

// After the song ended
mainAudio.addEventListener("ended",()=>{
    // we'll do accorfing to the icon means if user has set the icon to loop song the we'll repeat
    // the current song and will do further accordingly
    let getText = repeatBtn.innerText; //getting inner text of icon
    switch(getText)
    {
        case "repeat" : nextMusic();
                        break;
        case "repeat_one":  mainAudio.currentTime = 0 ;
                            loadMusic(musicIndex) ;
                            playMusic();             
                            break;
        case "shuffle": let randIndex = Math.floor((Math.random() * allMusic.length)+1);
                        do{
                            randIndex = Math.floor((Math.random() * allMusic.length)+1);
                        }while(musicIndex == randIndex);
                        musicIndex = randIndex;
                        loadMusic(musicIndex);
                        playMusic();
                        playingNow();

                        break;
    }

    
    
});


showMoreBtn.addEventListener("click",()=>{
    musicList.classList.toggle("show");
});

HideMusicBtn.addEventListener("click",()=>{
        showMoreBtn.click();
})

const ulTag = wrapper.querySelector("ul");

for(let i =0 ; i < allMusic.length;i++)
{
    let liTag = `<li li-index="${i+1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}"class="audio-duration">4:16</span>
                </li>`
    ulTag.insertAdjacentHTML("beforeend",liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata",()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration/60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec<10){ //adding 0 if total sec is less than 10
            totalSec = `0{totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
    })
}

//Lets work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow(){
    for(let j=0 ; j < allLiTags.length;j++)
{   
    let audioTag = allLiTags[j].querySelector(".audio-duration");

     //let's remove playing class fromn all other li except the last one which is clicked 
    if(allLiTags[j].classList.contains("playing")){
        allLiTags[j].classList.remove("playing");
        audioTag.innerText = audioTag.getAttribute("t-duration");
    }
    
    if(allLiTags[j].getAttribute("li-index") == musicIndex ){
        allLiTags[j].classList.add("playing");
        audioTag.innerText = "Playing";
    }
    
    // adding onclick atttribute in all Li tag
    allLiTags[j].setAttribute("onclick","clicked(this)");
}

}
// lets play song on li click
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex ;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}