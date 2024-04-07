
let volu;
let currentsong = new Audio()
let songs;
let folders
let currentfold;
let username


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsong(floder) {
    //geting the songs 
    //console.log(floder)
    currentfold = floder
    let a = await fetch(`/${currentfold}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = null
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currentfold}/`)[1])
        }

    }
    //dispaly the songs in songlist
    let songsul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songsul.innerHTML = ""

    for (let song of songs) {
        songsul.innerHTML = songsul.innerHTML + `<li>
            <img class="limg" src="/${currentfold}/cover.jpg" alt="" srcset="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>artist</div>
            </div>
                    <div class="playnow">
                        <span>Play now</span>
                        <img class="invert" src="img/play.svg" alt="">
                    </div>
        </li>`

    }


    //adding event listener
    let songsli = []
    songsli = Array.from(document.querySelector(".songlist").getElementsByTagName("li"))

    for (let song of songsli) {
        song.addEventListener("click", element => {
            playmusic(song.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    }
    return songs
}

async function dispalyalbum(username, folders) {
    folders = folders
    let cardul = ""
    cardul = document.querySelector(".cardcontainer").getElementsByTagName("ul")[0]
    cardul.innerHTML = ``
    for (let nf of folders) {
        let a = await fetch(`/songs${username}/${nf}/info.json`)
        let response1 = await a.json();
        cardul.innerHTML = cardul.innerHTML + `<li>
        
        <div class="card" >
        <img src="/songs${username}/${nf}/cover.jpg" alt="">
        <h2>${response1.Title}</h2>
        <p>${response1.discription}</p>
        </div>
        </li>`

    }


    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = null
            //console.log(e)
            //console.log(e.getElementsByTagName("h2"))
            //console.log(e.innerText)
            let text = e.innerText
           // console.log(`songs${username}/` + text.split("\n")[0])
            songs = await getsong(`songs${username}/` + text.split("\n")[0])
            playmusic(songs[0])
           // console.log(songs)
        })
    })


}
//fetching the folders
async function getfold(username) {
    let f = ""
    f = await fetch(`/songs${username}/`)
    let response
    response = await f.text();
    let div = ""
    div = document.createElement("div")
    div.innerHTML = response;
    let fold = ""
    fold = div.getElementsByTagName("a")
    //console.log(fold)
    folders = []

    for (let index = 0; index < fold.length; index++) {
        const element = fold[index];
        if (element.href.includes(`/songs${username}/`) && !element.href.includes(".htacces")) {
            //folders.push(element.href.includes("/songs/"))
            folders.push(element.href.split(`/songs${username}/`)[1])
        }
    }
    return folders
}

// play music function
function playmusic(track, pause = false) {
    //let audio = new Audio("/songs/"+track)
    // console.log(currentsong)
    currentsong.src = `/${currentfold}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg";
    }
    document.getElementById("songinfo").innerHTML = `<img class="limg" src="/${currentfold}/cover.jpg" alt="" srcset=""> ${track.replaceAll("%20", " ")}`
    document.getElementById("time").innerHTML = "00:00/00:00";
}

// add event listner to login form
document.getElementById("loginform").addEventListener("submit", async function run(event) {
    event.preventDefault();
    username = document.getElementById("user").value;
    var password = document.getElementById("pass").value;
    //console.log(username)
    //console.log(password)
    if (username == "vishnu" && password == "v") {
        document.querySelector(".toggleform").style.left = "120%"
        folders = await getfold(username)
        //console.log(folders)
        let songs = await getsong(`songs${username}/${folders[0]}`)
        await dispalyalbum(`${username}`, folders)
        // console.log(songs)
        playmusic(songs[0], true)
    }
    else {
        console.log("error")
    }
})

//add an event listener to previous
previous.addEventListener("click", () => {
    //console.log("yes")
    // console.log(currentsong.src.split("/songs/")[1])
    let maxindex = songs.length

    let index = songs.indexOf(currentsong.src.split(`/${currentfold}/`)[1])
    console.log(index)

    if (index == 0) {
        console.log(maxindex)
        playmusic(songs[maxindex - 1])
    }
    else {
        console.log("er")
        playmusic(songs[index - 1])
    }
})
//add an event listener to next
next.addEventListener("click", () => {
    console.log(currentsong.src.split(`/${currentfold}/`)[1])
    console.log(songs)
    let maxindex = songs.length
    console.log(maxindex)
    let index = songs.indexOf(currentsong.src.split(`/${currentfold}/`)[1])
    console.log(index)
    if ((index + 1) < maxindex) {
        playmusic(songs[index + 1])
    }
    else {
        console.log(songs[0])
        playmusic(songs[0])
    }
})

async function main() {
    username = "default"
    folders = await getfold(username)
    console.log(folders)
    let songs = await getsong(`songs${username}/${folders[0]}`)
    await dispalyalbum(`${username}`, folders)
    console.log(songs)
    playmusic(songs[0], true)

    // adding event listner to play button
    document.getElementById("play").addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    //adding event listener to time 

    currentsong.addEventListener("timeupdate", () => {
        document.getElementById("time").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        seekBar.value = (currentsong.currentTime / currentsong.duration) * 100;
    })
    //adding event lister to seekbar input
    seekBar.addEventListener("input", function () {
        var seekTime = (currentsong.duration * (seekBar.value / 100));
        currentsong.currentTime = seekTime;
    });

    //add  an event listener to hamburger
    document.getElementById("ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.getElementById("close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add event listener to volume buttons
    let lv;
    vol.addEventListener("input", function () {
        volu = vol.value / 100;
        lv = vol.value
        currentsong.volume = volu;
    });
    mute.addEventListener("click", () => {
        console.log(volu)
        if (currentsong.volume == 0) {
            mute.src = "img/volume.svg"
            console.log(lv)
            currentsong.volume = lv / 100;
            vol.value = lv;
        } else {
            mute.src = "img/mute.svg"
            currentsong.volume = 0.0
            vol.value = 0;
        }
    })
    //adding event listener to login button 1
    document.getElementById("lbtn1").addEventListener("click", () => {
        document.querySelector(".toggleform").style.left = "10px"
    })
    //adding event listener to back
    document.getElementById("back").addEventListener("click", () => {
        document.querySelector(".toggleform").style.left = "120%"
    })
    

}

main()
