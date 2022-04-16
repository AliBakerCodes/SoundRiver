// ------Functions------


function scPlayPause(index){
    var playButton = $('.playTrack').eq(index).children('i');
    var scFrame = document.querySelector(`[data-frame-index="${index}"]`);
    console.log("SCFrame")
    console.log(scFrame)
    var scWidget = SC.Widget(scFrame.id);
    scWidget.toggle();
}

