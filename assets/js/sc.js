// ------Functions------


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

function call(data){
    return data;
}
