// -----------Main JavaScript. All Global JS goes here------------------------------

// ------------Query Selectors----------------------
var currentPlaylist = $('#currentPlaylist')

//-------------Variables----------------------------
const HIDE_CLASS = 'hide';

// ------------Init Function------------------------
function init(){
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


// ------------Event Listeners----------------------
function setEventListeners() {
    currentPlaylist.on("click", "button", function (event) {
    console.log("click");
      var target = $(event.currentTarget);
      var index = target.index(this)
      console.log(target);
      console.log("Index: " + index)
    //   if (target.hasClass("playTrack")) { //Play Button Click
    //     console.log("Play Click");
    //     console.log($(".playTrack").index(this));
    //     // scPlayPause($(".playTrack").index(this))

    //   };
      if (target.hasClass("expand")) { //Play Button Click
        console.log("Expand Button Click");
        var ele=$(target).offsetParent().next()
        console.log(ele);
        collapse(ele);

      }
    }
  )
};

init();