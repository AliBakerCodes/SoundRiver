
  var tag = document.createElement('script');
  tag.id = 'iframe';
  tag.src = 'https://www.youtube.com/iframe_api';
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
  var ytIframeIds = [];
  var playerobjects=[];
  var autoplay=document.querySelector('#autoplaySwitch').value;
var player;

  function onYouTubeIframeAPIReady() {
    var ytFrame=document.querySelectorAll(".youtube")
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
    console.log("Player Ready")
    var iframeObject=event.target
    playerobjects.push(iframeObject)
    console.log(iframeObject.i.attributes['data-yt-index'].value)
    playerobjects.sort((a, b) => {
      return Number(a.i.attributes['data-yt-index'].value) - Number(b.i.attributes['data-yt-index'].value);
    })
    console.log(playerobjects);
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
    var player=document.querySelector(`#${event.target.h.id}`)
    var index=player.getAttribute("data-frame-index")
    if(autoplay && event.data===0){
      nextTrackHandler(Number(index));
    }
  }

  function ytPlayPause(index){
    var ytFrame=document.querySelector(`[data-frame-index="${index}"]`)
    var ytIndex=ytFrame.getAttribute("data-yt-index");
    console.log("Youtube Index:" + ytIndex)
    console.log("Youtube Players")
    console.log(playerobjects)
    var targetPlayer=playerobjects[ytIndex];
    console.log("Target Player")
    console.log(targetPlayer);
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

  function ytPause(index){
    var ytFrame=document.querySelector(`[data-frame-index="${index}"]`)
    var ytIndex=ytFrame.getAttribute("data-yt-index");
    var targetPlayer=playerobjects[ytIndex];
    targetPlayer.pauseVideo();
    var playerStatus = targetPlayer.getPlayerState();
    console.log("Player Status: " + playerStatus);
  }

  function ytPlay(index){
    var ytFrame=document.querySelector(`[data-frame-index="${index}"]`)
    var ytIndex=ytFrame.getAttribute("data-yt-index");
    var targetPlayer=playerobjects[ytIndex];
    targetPlayer.playVideo();
    var playerStatus = targetPlayer.getPlayerState();
    console.log("Player Status: " + playerStatus);
  }

  function ytListeners(){
    playerobjects=[];  
    var youtube = document.querySelectorAll(".youtube");
    for (var i = 0; i < youtube.length; i++) {
      iframeId=youtube[i].id;
      player= new YT.Player(iframeId, {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }
  }