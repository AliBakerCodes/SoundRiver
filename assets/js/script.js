// -----------Main JavaScript. All Global JS goes here------------------------------
// ------------Query Selectors----------------------
var currentPlaylistEL = $("#currentPlaylist");
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
function songObj(artist, title, scLInk, spLink, ytLink, ebLink, defaultPlayer, mbid, sklink,hplink, amlink) {
  this.artist = artist;
  this.title = title;
  this.scLInk = scLInk;
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
  scEvents();
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
  artist, title, scLInk, spLink, ytLink, ebLink, defaultPlayer, mbid, sklink, hplink, amlink
) {
  newSong="";
  newSong = new songObj(
    artist, title, scLInk, spLink, ytLink, ebLink, defaultPlayer, mbid, sklink, hplink, amlink
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
  currentPlaylistObj.splice(index,1);
  console.log("Removing Song from playlist");
  console.log(currentPlaylistObj);
}

function formSubmitHandler(event) {
  createSong(
    artistInputEL.value,
    titleInputEL.value,
  );
  var artistString = artistInputEL.value.replace(" ", "+");
  artistString = artistString.trim();
  artistTitleString = artistInputEL.value.replace(" ", "+"); + "+" + titleInputEL.value.replace(" ", "+");
  artistTitleString = artistTitleString.trim();
  console.log("Artist Search String: " + artistString);
  getMBID(artistString);
  // addSong();
}

function playPauseHandler(index) {
  var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
  console.log(currentEmbed);
  stopAllTracks();
  if (currentEmbed.src.includes("soundcloud")) {
    scPlayPause(index);
  } else if (currentEmbed.src.includes("youtube")) {
    ytPlayPause(index);
  }
}
function nextTrackHandler(index) {
  console.log("Next Track Index: " + index);
  var numTracks = document.querySelectorAll(".player").length;
  console.log(numTracks);
  if (index + 1 > numTracks - 1) {
    return;
  }
  var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
  console.log(currentEmbed);
  stopAllTracks();
  var nextEmbed = document.querySelector(`[data-frame-index="${index + 1}"]`);
  console.log("Next Embed");
  console.log(nextEmbed);
  if (nextEmbed.src.includes("soundcloud")) {
    scPlay(index + 1);
  } else if (nextEmbed.src.includes("youtube")) {
    ytPlay(index + 1);
  } else if (nextEmbed.src.includes("spotify")) {
    nextTrackHandler(index + 1);
  }
}

function previousTrackHandler(index) {
  console.log("Previous Track Index: " + index);
  var numTracks = document.querySelectorAll(".player").length;
  console.log(numTracks);
  if (index - 1 < 0) {
    return;
  }
  var currentEmbed = document.querySelector(`[data-frame-index="${index}"]`);
  console.log(currentEmbed);
  stopAllTracks();
  var prevEmbed = document.querySelector(`[data-frame-index="${index - 1}"]`);
  console.log(prevEmbed);
  if (prevEmbed.src.includes("soundcloud")) {
    scPlay(index - 1);
  } else if (prevEmbed.src.includes("youtube")) {
    ytPlay(index - 1);
  } else if (prevEmbed.src.includes("spotify")) {
    previousTrackHandler(index - 1);
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
    console.log(currentEmbed);
    if (currentEmbed.src.includes("soundcloud")) {
      scPlay(0);
    } else if (currentEmbed.src.includes("youtube")) {
      ytPlay(0);
    }
  } else {
    noTracksMessageEL.classList.remove(HIDE_CLASS);
  }
}

function stopAllTracks(){
  console.log("Stopping All")
  alltracks = document.querySelectorAll("iframe");
  console.log("Alltracks");
  console.log(alltracks);
  if (alltracks.length > 0) {
    alltracks.forEach(function (iframe, index) {
      var currentEmbed = document.querySelector(
        `[data-frame-index="${index}"]`
      );
      console.log(currentEmbed);
      if (currentEmbed.src.includes("soundcloud")) {
        scPause(index);
      } else if (currentEmbed.src.includes("youtube")) {
        ytPause(index);
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
      console.log(ele);
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
  });
}

init();
