let currentSong = new Audio();
let songs ;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and seconds
    /*if(isNaN(seconds) || seconds < 0){
        return "invalid input";
    }*/

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds with leading zeros
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Concatenate and return the result
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll('%20', ' ')}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="play1">
                                <img class="invert" src="play1.svg" alt="">
                            </div>
        
        </li>`
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
}


const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function main() {

    await getSongs("songs")
    playMusic(songs[0], true)

    


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    //listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)
            }`
        document.querySelector(".circle").style.left = (currentSong.currentTime /
            currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    /*document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-90%"
    })*/


    previous.addEventListener("click",()=>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0 ){
            playMusic(songs[index-1])
        }
    })

    next.addEventListener("click",()=>{
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }
    })

    //load the playlist card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })


}

main()