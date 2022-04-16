// ------Variables-----
var autoplay=document.querySelector('#autoplaySwitch').value;
// ------Functions------
var scIframeIds = [];
var scplayerobjects=[];
function scEvents(){
    var scIframes = document.querySelectorAll(".soundcloud");
    scIframes.forEach(function(iframe) {
        scIframeIds.push(iframe.id);
  });
  scIframeIds.forEach(function(iframeId){
    var scWidget = SC.Widget(iframeId);
    scWidget.bind(SC.Widget.Events.FINISH, function() {        
    console.log("Bound SC Finish for: " +iframeId);
    console.log("Autoplay is " + autoplay)
    index=document.querySelector(`#${iframeId}`).getAttribute('data-frame-index')
    console.log('SC widget Index is:' + index)
    if(autoplay){
        nextTrackHandler(index);
    }
})});
}

function scPlayPause(index){
    var scFrame = document.querySelector(`[data-frame-index="${index}"]`);
    console.log("SCFrame")
    console.log(scFrame)
    var scWidget = SC.Widget(scFrame.id);
    scWidget.isPaused(function(pause){
        console.log(pause);
        if (pause == false){
          console.log('pause');
          scWidget.pause();
        }else{
          console.log('play');
          scWidget.play();
        }
    })
};

function scPause(index){
    var scFrame = document.querySelector(`[data-frame-index="${index}"]`);
    var scWidget = SC.Widget(scFrame.id);
    scWidget.pause();
}

function scPlay(index){
    var scFrame = document.querySelector(`[data-frame-index="${index}"]`);
    var scWidget = SC.Widget(scFrame.id);
    scWidget.play();
}


