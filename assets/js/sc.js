var playerEL=$('#player');
var mainSong=$('.songCard');
var iframeElement   = document.querySelector('#cardFrame');
var iframeElementID = iframeElement.id;
var widget1         = SC.Widget(iframeElement);
var widget2         = SC.Widget(iframeElementID);

// ------Functions------


function scPlayPause(index){
    var playButton = $('.playTrack').eq(index).children('i');
    var scFrame = document.querySelector(`#currentPlaylist iframe:nth-of-type(${index+1})`);
    console.log(scFrame)
    var scWidget = SC.Widget(scFrame);
    console.log(playButton)
    if (playButton.innerHTML== "play_arrow") {
        playButton.innerHTML= "pause";
      } else {playButton.innerHTML ="play_arrow";
             };
    scWidget.toggle();
}

