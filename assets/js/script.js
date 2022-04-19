// -----------Main JavaScript. All Global JS goes here------------------------------
// ------------Query Selectors----------------------
var currentPlaylistEL = $("#currentPlaylist");
var currentPLUL = document.querySelector('#currentPlaylist')
var searchEL = document.querySelector("#addBtn");
var artistInputEL = document.querySelector("#artistInput");
var titleInputEL = document.querySelector("#titleInput");
var playlistInptEL = document.querySelector("#playlistInput");
var playAllEl = document.querySelector("#playAll");
var noTracksMessageEL = document.querySelector("#noTracksMessage");
var autoplay = document.querySelector("#autoplaySwitch");
var playlistHistoryEl=document.querySelector('#playlistHistory');
var addPlaylistEl=document.querySelector('#savePlaylist');
var playlistHistoryEl2=$("#playlistHistory");
var bizEL=$("#biz");
var defaultPlayerEl=document.querySelector("#defaultPlayer");
var spinner=document.querySelector("#spinner")

//-------------Variables----------------------------
const HIDE_CLASS = "hide";
var currentPlaylistObj;
var currentSongObj;
var newSong;
var playlistHistory=[];
var alltracks = [];
//-------------Objects------------------------------
function songObj(artist, title, scLink, spLink, ytLink, ebLink, defaultPlayer, mbid, sklink,hplink, amlink) {
  this.artist = artist;
  this.title = title;
  this.scLink = scLink;
  this.spLink = spLink;
  this.ytLink = ytLink;
  this.ebLink = ebLink;
  this.defaultPlayer = defaultPlayer;
  this.mbid = mbid;
  this.sklink = sklink;
  this.hplink = hplink;
  this.amlink = amlink;
}

function playlistObj(name, songs, like, order) {
  this.name = name; 
  this.songs = songs;
  this.like=like;
  this.order=order

}

// ------------Init Function------------------------
function init() {
  getPlaylistHistory()
  renderPlaylistHistory()
  createPlaylist();
  setEventListeners();
  
}

//-------------Functions----------------------------
function collapse(ele) {
  if (ele.hasClass(HIDE_CLASS)) {
    ele.removeClass(HIDE_CLASS);
  } else {
    ele.addClass(HIDE_CLASS);
  }
}
function createPlaylist() {
  var playlistName = playlistInptEL.value;
  if (!playlistName) {
    playlistName = "Playlist1";
  }
  currentPlaylistObj = new playlistObj(playlistName);
  currentPlaylistObj.songs = [];
}

function createSong(
  artist, title, scLink, spLink, ytLink, ebLink, defaultPlayer, mbid, sklink, hplink, amlink
) {
  newSong="";
  newSong = new songObj(
    artist, title, scLink, spLink, ytLink, ebLink, defaultPlayer, mbid, sklink, hplink, amlink
  );
  console.log("Creating Song");
  console.log(newSong);
}

function storePlayistHistory() {
  //Json stringify and store to localStorage
  localStorage.setItem("storedPlaylistHistory", JSON.stringify(playlistHistory));
}

function getPlaylistHistory() {
  //Check if there is a stored PlaylistHistory in localStorage. If so, get it. If not, initialize the Playlist History
  playlistHistory = JSON.parse(localStorage.getItem("storedPlaylistHistory"));
  if (!playlistHistory) {
    playlistHistory = [];
  }
    
}
function removeHistory(index) {
  playlistHistory.splice(index,1);
  console.log("Removing Playlist from History");
  console.log(playlistHistory);
  storePlayistHistory();
  getPlaylistHistory()
  renderPlaylistHistory();
}

function addSong() {
  currentPlaylistObj["songs"].push(newSong);
  console.log("Adding to Playlist");
  console.log(currentPlaylistObj);
}

function removeSong(index) {
  currentPlaylistObj["songs"].splice(index,1);
  console.log("Removing Song from playlist");
  console.log(currentPlaylistObj);
}

var formSubmitHandler = async function(event) {
  searchEL.classList.add(HIDE_CLASS);
  spinner.classList.remove(HIDE_CLASS);
  createSong(
    artistInputEL.value,
    titleInputEL.value,
  );
  var artistString = artistInputEL.value.replace(" ", "+");
  artistString = artistString.trim();
  artistTitleString = artistInputEL.value.replace(" ", "+") + "+" + titleInputEL.value.replace(" ", "+");
  artistTitleString = artistTitleString.trim();
  console.log("Artist Search String: " + artistString);
  console.log("Artist and Title: " + artistTitleString);

  await getTrack(artistTitleString);
  await getMBID(artistString)
  if(defaultPlayerEl.checked == true){
    newSong['defaultPlayer']='youtube'
    console.log("Default Player Youtube")
  } else {
    console.log("Default Player SoundCloud")
    newSong['defaultPlayer']='soundcloud'
  }
  addSong();
  spinner.classList.add(HIDE_CLASS);
  searchEL.classList.remove(HIDE_CLASS);
  renderPlaylist(currentPlaylistObj);
  artistInputEL.value="";
  titleInputEL.value="";
}

function playPauseHandler(index) {
  var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
  var currentplayPause = document.querySelector(`[data-playid="${index}"]`);
  stopAllTracks(index);
  if (currentEmbed.src.includes("soundcloud")) {
    scPlayPause(index);
  } else if (currentEmbed.src.includes("youtube")) {
    ytPlayPause(index);
  }
  if(currentplayPause.innerHTML.includes('play')){
    currentplayPause.innerHTML=`<i class="material-icons">pause</i>`
  } else {
    currentplayPause.innerHTML=`<i class="material-icons">play_arrow</i>`
  }
}

function nextTrackHandler(index) {
  console.log("Next Track Index: " + index);
  var numTracks = document.querySelectorAll(".player").length;
  console.log(numTracks);
  if (index + 1 > numTracks - 1) {
    stopAllTracks();
    return;
  }
  var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
  console.log(currentEmbed);
  stopAllTracks();
  var nextEmbed = document.querySelector(`[data-frame-index="${index + 1}"]`);
  console.log("Next Embed");
  console.log(nextEmbed);
  if (nextEmbed.src.includes("spotify")) {
    nextTrackHandler(index + 1);
  } else if (nextEmbed.src.includes("spotify") && (index + 1 > numTracks - 1)) {
    stopAllTracks();
    return;
  } else {
    playPauseHandler(index+1);
  }
}

function previousTrackHandler(index) {
  console.log("Previous Track Index: " + index);
  var numTracks = document.querySelectorAll(".player").length;
  if (index - 1 < 0) {
    stopAllTracks();
    return;
  }
  var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
  stopAllTracks();
  var prevEmbed = document.querySelector(`[data-frame-index="${index - 1}"]`);
  if (prevEmbed.src.includes("spotify")) {
    previousTrackHandler(index - 1);
  } else if (prevEmbed.src.includes("spotify") && (index - 1 < 0)) {
    stopAllTracks();
    return;
  } else {
    playPauseHandler(index-1);
  }
}

function playAllHandler() {
    stopAllTracks();
    alltracks = document.querySelectorAll("[data-frame-index]");
    if (alltracks.length > 0) {
    if (autoplay.checked == false) {
      autoplay.click();
    }
    playPauseHandler(0);
  } else {
    noTracksMessageEL.classList.remove(HIDE_CLASS);
  }
}

function stopAllTracks(exception){
  console.log("Stopping All")
  alltracks = document.querySelectorAll("[data-frame-index]");
  console.log("Alltracks");
  console.log(alltracks);
  if (alltracks.length > 0) {
    alltracks.forEach(function (iframe, index) {
      if(index!=exception){
        var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
        var currentplayPause = document.querySelector(`[data-playid="${index}"]`);
        console.log(currentEmbed);
        if (currentEmbed.src.includes("soundcloud")) {
          scPause(index);
        } else if (currentEmbed.src.includes("youtube")) {
          console.log(index)
          ytPause(index);
        }
        currentplayPause.innerHTML=`<i class="material-icons">play_arrow</i>`
    }
    });
  }
}

function shareButtonHandler(index){
  var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
  console.log(currentEmbed.src)
  async function share() {
    try {
      await navigator.share({
        text: 'Sent from SoundRiver',
        url: currentEmbed.src
      })
    } catch (error) {
      console.log('Sharing failed!', error)
    }
  }
  share();
}

function eventButtonHandler(index){
  if(currentPlaylistObj.songs[index].sklink){
  window.open(
    currentPlaylistObj.songs[index].sklink, "_blank");
  } else {
    window.alert("No events found");
  }
}

function spotButtonHandler(index){
  if(currentPlaylistObj.songs[index].spLink){
  window.open(
    `https://open.spotify.com/track/${currentPlaylistObj.songs[index].spLink}`, "_blank");
    } else {
    window.alert("No events found");
  }
}

function soundHandler(index){
  if(currentPlaylistObj.songs[index].scLink){
  console.log(`http://www.soundcloud.com/${currentPlaylistObj.songs[index].scLink}`);  
  window.open(
    `http://www.soundcloud.com/${currentPlaylistObj.songs[index].scLink}`, "_blank");
  } else {
    window.alert("No events found");
  }
}

function youButtonHandler(index){
  if(currentPlaylistObj.songs[index].ytLink){
  window.open(
    `https://www.youtube.com/watch?v=${currentPlaylistObj.songs[index].ytLink}`, "_blank");
  } else {
    window.alert("No events found");
  }
}

function addPlaylistHandler(){
  currentPlaylistObj['name']=playlistInptEL.value;
  console.log("Current Playlist");
  console.log(currentPlaylistObj);
  playlistHistory.push(currentPlaylistObj);
  console.log("Playlist History");
  console.log(playlistHistory);
  storePlayistHistory();
  getPlaylistHistory();
  console.log("Playlist History after store and get");
  console.log(playlistHistory);
  renderPlaylistHistory();
}

function playlistHistoryHandler(name){
  var playlistToRender
  for (var index=0; index<playlistHistory.length; index++){
    if(playlistHistory[index].name==name){
      console.log("Found Playlist of name:" +name)
      currentPlaylistObj=playlistHistory[index];
      renderPlaylist(currentPlaylistObj);
    }
  }
}

//---------Render playlist------------
function renderPlaylist(playlistOBJ){
  console.log("Playlist OBJ to render:")
  console.log(playlistOBJ);
  currentPLUL.innerHTML="";
  playlistInptEL.value=playlistOBJ.name;
  console.log("Current list inner:" + currentPlaylistEL.innerHTML)
  console.log("Songs to Render");
  console.log(playlistOBJ.songs);
  console.log(playlistOBJ.songs.length)
  for(var index=0;index<playlistOBJ.songs.length;index++){
 

      console.log("HALP")
      console.log(playlistOBJ.songs[index]);
      song=playlistOBJ.songs[index];
      var songCard = document.createElement('div');
      var scIndex=document.querySelectorAll('iframe[class~="soundcloud"]').length
      var ytIndex=document.querySelectorAll('iframe[class~="youtube"]').length
      var playerHTML;
      console.log("SCIndex:");
      console.log(scIndex)
      songCard.classList.add('songCard');
      if (song.defaultPlayer=='soundcloud'){
        playerHTML=`<div class="player" data-index="${index}"><iframe data-sc-index="${scIndex}" class="soundcloud" data-frame-index="${index}" id="sc-${scIndex}" width="500" height="166" scrolling="no" frameborder="no" allow="autoplay"
        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com//${song.scLink}">
      </iframe></div>`
      } else if(song.defaultPlayer=='youtube'){
        playerHTML=`<div class="player" data-index="${index}"><iframe class="youtube" data-yt-index="${ytIndex}" data-frame-index="${index}" id="yt-${ytIndex}" width="560" height="315" src="https://www.youtube.com/embed/${song.ytLink}?enablejsapi=1&origin=https://alibakercodes.github.io/SoundRiver/" frameborder="0" allow="accelerometer; autoplay; gyroscope; picture-in-picture" style="border: solid 4px #37474F" allowfullscreen></iframe></div>`
      }
      songCard.innerHTML=`<li class="collection-item mainSong">
      <div><button title="Previous" type="button" class="previousTrack"><i class="material-icons">skip_previous</i></button></div>
      <div><button title="Play / Pause" type="button" data-playid="${index}" class="playTrack"><i class="material-icons">play_arrow</i></button></div>
      <!-- <div><button type="button" class="pauseTrack"><i class="material-icons">pause</i></button></div>   -->
      <div><button title="Next" type="button" class="nextTrack"><i class="material-icons">skip_next</i></button></div>
      <div class="artist-title"><span data-artist="artist">${song.artist}</span> - <span data-title="title">${song.title}</span></div>
      <div><button title="SoundCloud" type="button" class="sound"><i class="fa-brands fa-soundcloud fa-xl"></i></button></div>
      <div><button title="Spotify" type="button" class="spot"><i class="fa-brands fa-spotify fa-xl"></i></button></div>
      <div><button title="YouTube" type="button" class="you"><i class="fa-brands fa-youtube fa-xl"></i></button></div>
      <div><button title="SongKick" type="button" class="event"><i class="material-icons">event</i></button></div>
      <div><button title="Delete" type="button" class="remove"><i class="material-icons">delete_forever</i></button></div>
      <div><button title="Expand" type="button" class="expand"><i class="material-icons">keyboard_arrow_down</i></button></div>
    </li>
    <div class="collapsible hide">
      <li class="collection-item card-expand">
        ${playerHTML}
        <div><button type="button" class="share"><i class="material-icons">share</i></button></div>
        <div class="eventbrite-content">
          <table class="responsive highlight">
            <tbody>
                <tr><td><th>Artist</th></td><td>${song.artist}</td></tr>
                <tr><td><th>Homepage</th></td><td><a href="${song.hplink}">${song.hplink}/</a></td></tr>
                <tr><td><th>Buy</th></td><td><a href="${song.amlink}">${song.amlink}</a></td></tr>
            </tbody>
          </table>
        </div>
        <div><button title="Share" type="button" class="share"><i class="material-icons">share</i></button></div>
      </li>
    </div>`
    console.log(songCard.innerHTML)
    currentPLUL.append(songCard);
  };
  scEvents();
  ytListeners(); 
}


function renderPlaylistHistory(){
  playlistHistoryEl.innerHTML="";
  for (var index=0; index<playlistHistory.length;index++){
    var playlist=playlistHistory[index];
    var playlistLi=document.createElement('li');
    playlistLi.classList.add('playlistRow');
    playlistLi.innerHTML=`<a href="#" class="playlistCol">${playlist.name}</a>
  <div>
    <button title="Favorite" class="favoriteHistory"><span class="material-icons favIcon">
      favorite_border
    </span></button>
    <button title="Share" class="shareHistory"><span class="material-icons shareIcon">
      ios_share
    </span></button>
    <button title="Delete" class="removeHistory"><span class="material-icons deleteIcon">
      delete_outline
    </span></button>
  </div>`
    playlistHistoryEl.append(playlistLi)
  }
}

// ------------Event Listeners----------------------
function setEventListeners() {
  searchEL.addEventListener("click", formSubmitHandler);
  playAllEl.addEventListener("click", playAllHandler);
  addPlaylistEl.addEventListener("click",addPlaylistHandler)
  currentPlaylistEL.on("click", "button", function (event) {
    console.log("click");
    var target = $(event.currentTarget);
    var index = target.index(this);
    console.log(target);
    if (target.hasClass("playTrack")) {
      //Play Button Click
      console.log("Play Click");
      playPauseHandler($(".playTrack").index(this));
    }
    if (target.hasClass("nextTrack")) {
      //Next Track Button Click
      console.log("Next Click");
      nextTrackHandler($(".nextTrack").index(this));
    }
    if (target.hasClass("previousTrack")) {
      //Previous Track Button Click
      console.log("Previous Click");
      previousTrackHandler($(".previousTrack").index(this));
    }
    if (target.hasClass("expand")) {
      //Expand Button Click
      console.log("Expand Button Click");
      var ele = $(target).offsetParent().next();
      collapse(ele);
    }
    if (target.hasClass("remove")) {
      //Remove Button Click
      console.log("Remove Button Click");
      removeSong($(".remove").index(this));
      var ele = $(target).closest(".songCard").remove();
    }
    if (target.hasClass("share")) {
      //Share Button Click
      console.log("Share Button Click");
      shareButtonHandler($(".share").index(this));
    }
    if (target.hasClass("event")) {
      //Event Button Click
      console.log("Event Button Click");
      eventButtonHandler($(".event").index(this));
    }
    if (target.hasClass("sound")) {
      //you Button Click
      console.log("sound Button Click");
      soundHandler($(".sound").index(this));
    }
    if (target.hasClass("spot")) {
      //you Button Click
      console.log("spot Button Click");
      spotButtonHandler($(".spot").index(this));
    }
    if (target.hasClass("you")) {
      //you Button Click
      console.log("you Button Click");
      youButtonHandler($(".you").index(this));
    }
  });
  playlistHistoryEl2.on("click", "a", function (event) {
    event.preventDefault();
    console.log("History link click");
    var target = $(event.currentTarget);
    var index = target.index(this);
    console.log(target);
    console.log(target[0].innerText)
    playlistHistoryHandler(target[0].innerText)
  });
  playlistHistoryEl2.on("click", "button", function (event) {
    event.preventDefault();
    console.log("History button click");
    var target = $(event.currentTarget);
    var index = target.index(this);
    console.log(target);
    if (target.hasClass("removeHistory")) {
      //Remove Button Click
      console.log("History Remove Button Click");
      removeHistory($(".removeHistory").index(this));
      var ele = $(target).closest(".playlistRow").remove();
    }
  });
  bizEL.on("click", "a", function (event) {
    event.preventDefault();
    var target = $(event.currentTarget);
    var index = target.index(this);
    console.log(target);
    console.log("Biz Link Click");
    if (target.hasClass("xclass")) {
      //Biz Link Click
      console.log("Biz Link Click");
      var ele = $(target).offsetParent().next();
      console.log(ele);
      collapse(ele);
    }
  })
}

init();
