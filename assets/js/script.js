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
//-------------Variables----------------------------
const HIDE_CLASS = "hide";
var currentPlaylistObj;
var currentSongObj;
var newSong;
var playlistHistory;
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
  createSong(
    artistInputEL.value,
    titleInputEL.value,
  );
  var artistString = artistInputEL.value.replace(" ", "+");
  artistString = artistString.trim();
  artistTitleString = artistInputEL.value.replace(" ", "+"); + "+" + titleInputEL.value.replace(" ", "+");
  artistTitleString = artistTitleString.trim();
  console.log("Artist Search String: " + artistString);
  await getMBID(artistString)
  addSong();
  newSong['scLink']='kodak-black/super-gremlin';
  newSong['defaultPlayer']='soundcloud'
  renderPlaylist(currentPlaylistObj);
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
    alltracks = document.querySelectorAll("iframe");
    if (alltracks.length > 0) {
    if (autoplay.checked == false) {
      autoplay.click();
    }
    var currentEmbed = document.querySelector(`[data-frame-index="0"]`);
    playPauseHandler(0);
  } else {
    noTracksMessageEL.classList.remove(HIDE_CLASS);
  }
}

function stopAllTracks(exception){
  console.log("Stopping All")
  alltracks = document.querySelectorAll("iframe");
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
//---------Render playlist------------
function renderPlaylist(playlistOBJ){
  console.log("Playlist OBJ to render:")
  console.log(playlistOBJ);
  currentPLUL.innerHTML="";
  console.log("Current list inner:" + currentPlaylistEL.innerHTML)
  console.log("Songs to Render");
  console.log(playlistOBJ.songs);
  console.log(playlistOBJ.songs.length)
  for(var index=0;index<playlistOBJ.songs.length;index++){
  //     console.log("Song: " + song.artist + " " + song.title);
  //     songs.forEach(element => {
  //         console.log(element)
  //     });
      console.log("HALP")
      console.log(playlistOBJ.songs[index]);
      song=playlistOBJ.songs[index];
      var songCard = document.createElement('div');
      var scIndex=document.querySelectorAll('iframe[class~="soundcloud"]').length
      console.log("SCIndex:");
      console.log(scIndex)
      songCard.classList.add('songCard');
      songCard.innerHTML=`<li class="collection-item mainSong">
      <div><button title="Previous" type="button" class="previousTrack"><i class="material-icons">skip_previous</i></button></div>
      <div><button title="Play / Pause" type="button" data-playid="${index}" class="playTrack"><i class="material-icons">play_arrow</i></button></div>
      <!-- <div><button type="button" class="pauseTrack"><i class="material-icons">pause</i></button></div>   -->
      <div><button title="Next" type="button" class="nextTrack"><i class="material-icons">skip_next</i></button></div>
      <div class="artist-title"><span data-artist="artist">${song.artist}</span> - <span data-title="title">${song.title}</span></div>
      <div><button title="SoundCloud" type="button" class="sound"><i class="fa-brands fa-soundcloud fa-xl"></i></button></div>
      <div><button title="Spotify" type="button" class="spot"><i class="fa-brands fa-spotify fa-xl"></i></button></div>
      <div><button title="YouTube" type="button" class="you"><i class="fa-brands fa-youtube fa-xl"></i></button></div>
      <div><button title="Eventbrite" type="button" class="event"><i class="material-icons">event</i></button></div>
      <div><button title="Delete" type="button" class="remove"><i class="material-icons">delete_forever</i></button></div>
      <div><button title="Expand" type="button" class="expand"><i class="material-icons">keyboard_arrow_down</i></button></div>
    </li>
    <div class="collapsible hide">
      <li class="collection-item card-expand">
        <div class="player"><iframe data-sc-index="${scIndex}" class="soundcloud" data-frame-index="${index}" id="sc-${scIndex}" width="500" height="166" scrolling="no" frameborder="no" allow="autoplay"
          src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com//${song.scLink}">
        </iframe></div>
        <div class="eventbrite-content">
          <table class="responsive highlight">
            <tbody>
                <tr><td><th>Artist</th></td><td>Kodak Black</td></tr>
                <tr><td><th>Homepage</th></td><td><a href="${song.hplink}">${song.hplink}/</a></td></tr>
                <tr><td><th>Buy</th></td><td><a href="${song.amlink}">${song.amlink}</a></td></tr>
            </tbody>
          </table>
        </div>
        <div><button title="Share" type="button" class="share"><i class="material-icons">share</i></button></div>
      </li>
    </div>`
    currentPLUL.append(songCard);
  };
  scEvents();
}


// ------------Event Listeners----------------------
function setEventListeners() {
  searchEL.addEventListener("click", formSubmitHandler);
  playAllEl.addEventListener("click", playAllHandler);
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
  });
}

init();
