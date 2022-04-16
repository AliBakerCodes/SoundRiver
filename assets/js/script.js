// -----------Main JavaScript. All Global JS goes here------------------------------
// ------------Query Selectors----------------------
var currentPlaylistEL = $('#currentPlaylist');
var searchEL = document.querySelector('#addBtn');
var artistInputEL=document.querySelector("#artistInput");
var titleInputEL = document.querySelector("#titleInput");
var playlistInptEL= document.querySelector('#playlistInput');

//-------------Variables----------------------------
const HIDE_CLASS = 'hide';
var currentPlaylistObj;
var currentSongObj;
var newSong;
var playlistHistory;

//-------------Objects------------------------------
function songObj(artist, title,scLInk,spLink,ytLink,ebLink, defaultPlayer) {
  this.artist = artist;
  this.title = title;
  this.scLInk = scLInk;
  this.spLink = spLink;
  this.ytLink = ytLink;
  this.ebLink = ebLink;
  this.defaultPlayer = defaultPlayer;
}

function playlistObj(name,songs) {
  this.name=name,
  this.songs=songs
}

// ------------Init Function------------------------
function init(){
    createPlaylist();
    setEventListeners();

}

//-------------Functions----------------------------
function collapse(ele){
    if (ele.hasClass(HIDE_CLASS)) {
        ele.removeClass(HIDE_CLASS);
    } else {
        ele.addClass(HIDE_CLASS);
    }
};
function createPlaylist(){
    var playlistName = playlistInptEL.value
    if(!playlistName){
      playlistName="Playlist1"
    }
    currentPlaylistObj= new playlistObj(playlistName)
    currentPlaylistObj.songs=[]
};

function createSong(artist, title,scLInk,spLink,ytLink,ebLink,defaultPlayer){
  newSong= new songObj(artist,title,scLInk,spLink,ytLink,ebLink,defaultPlayer);
  console.log("Creating Song");
  console.log(newSong);
};

function addSong(){
  currentPlaylistObj['songs'].push(newSong);
  console.log("Adding to Playlist");
  console.log(currentPlaylistObj);
};

function formSubmitHandler(event){
  var searchString =artistInputEL.value.replace(" ", "+");
  searchString=searchString+"+"+titleInputEL.value.replace(" ", "+");
  searchString =searchString.trim();
  console.log("Search String: " + searchString)
  // getTrack(searchString)
  createSong(artistInputEL.value,titleInputEL.value, "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com//kodak-black/super-gremlin&{auto_play}",
  "https://open.spotify.com/embed/track/1Y5Jvi3eLi4Chwqch9GMem?utm_source=generator","http://www.youtube.com/embed/kiB9qk4gnt4","https://www.eventbrite.com/e/kodak-black-tickets-312170720027")
  addSong();
};

function playPauseHandler(index){
  var frames = window.frames;
  console.log("Frames:");
  console.log(frames);
for (var i = 0; i < frames.length; i++) { 
  var sounds = frames[i].document.getElementsByTagName('iframe');
  // for(j=0; j<sounds.length; j++){
  //   sounds[j].pause();
  // }
  console.log("Frame");
  console.log(frames[i])
}
};

// ------------Event Listeners----------------------
function setEventListeners() {
    searchEL.addEventListener('click',formSubmitHandler);
    currentPlaylistEL.on("click", "button", function (event) {
    console.log("click");
      var target = $(event.currentTarget);
      var index = target.index(this)
      console.log(target);
      console.log("Index: " + index)
      if (target.hasClass("playTrack")) { //Play Button Click
        console.log("Play Click");
        console.log($(".playTrack").index(this));
        playPauseHandler(index);
        // scPlayPause($(".playTrack").index(this))

      };
      if (target.hasClass("expand")) { //Play Button Click
        console.log("Expand Button Click");
        var ele=$(target).offsetParent().next()
        console.log(ele);
        collapse(ele);
      }
    })
  
};

init();