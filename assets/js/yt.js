
  var tag = document.createElement('script');
  tag.id = 'iframe';
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  var ytIframeIds = [];
  var playerobjects=[];
  var ytIframes = document.querySelectorAll(".youtube");
  ytIframes.forEach(function(iframe) {
	  ytIframeIds.push(iframe.id);
});
var player;
  function onYouTubeIframeAPIReady() {
    ytIframeIds.forEach(function(iframeId) {
      console.log(iframeId)     
      player= new YT.Player(iframeId, {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    });
  }

  function onPlayerReady(event) {
    var iframeObject=event.target
    playerobjects.push(iframeObject)
  }
  function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
      color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
      color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
      color = "#33691E"; // playing = green
    } else if (playerStatus == 2) {
      color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
      color = "#AA00FF"; // buffering = purple
    } else if (playerStatus == 5) {
      color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
      document.getElementById('yt-0').style.borderColor = color;
    }
  }
  function onPlayerStateChange(event) {
    changeBorderColor(event.data);
  }

  function ytPlayPause(index){
    var ytFrame=document.querySelector(`[data-frame-index="${index}"]`)
    var ytIndex=ytFrame.getAttribute("data-yt-index");
    console.log(ytIndex)
    console.log(playerobjects)
    var targetPlayer=playerobjects[ytIndex]
    var playerStatus = targetPlayer.getPlayerState();
    console.log("Player Status: " + playerStatus);
    if (playerStatus == -1 || playerStatus == 2 || playerStatus == 5) {
      console.log("Play Video")
      targetPlayer.playVideo();
    } else {
      console.log("Pause Video")
      targetPlayer.pauseVideo();
    }
  }