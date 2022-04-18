var MB_MBID_URL='https://musicbrainz.org/ws/2/artist?query='
var MB_ARTIST_URL='https://musicbrainz.org/ws/2/artist/'
var HEADERS = new Headers({
    "Accept"       : "application/json",
    "Content-Type" : "application/json",
    "User-Agent"   : "SR"
});

var getMBID = async function(searchString){
  //  console.log("Getting Artist:MBID");
    var mbSearch = `${MB_MBID_URL}${searchString}&fmt=json`;
    // console.log("MB search string: " + mbSearch)
    var results= await getApi(mbSearch);;
    // console.log("MBID Results:");
    var artist=results.artists[0];
    // console.log(artist);
    newSong['mbid']=artist.id;
    // console.log(newSong.mbid);
    await getArtist(newSong.mbid);
    return
}

var getArtist = async function(mbid){
    console.log("Getting Artist:MB")
     var mbSearch = `${MB_ARTIST_URL}${mbid}?inc=url-rels&fmt=json`
     console.log("MB search string: " + mbSearch)
     var artist= await getApi(mbSearch);
    //  console.log("Artist Results:")
    //  console.log(artist)
     artist.relations.forEach(relation => {
        //  console.log(relation)
         var artistURL=relation.url.resource
         var artistURLType=relation.type
         if (artistURL.includes('songkick')){newSong['sklink']=relation.url.resource}
         if (artistURLType.includes('official homepage')){newSong['hplink']=relation.url.resource}
         if (artistURLType.includes('purchase for download')){newSong['amlink']=relation.url.resource}
     });
     
 }


  var getApi = function(apiUrl) {
    return fetch(apiUrl,{
        method  : 'GET', 
        headers : HEADERS
    }
        ).then(function (response) {
      if (response.ok) {
       const data = response.json();
        if (data.length == 0) {
          window.alert("No results returned");
          return;
        } else {
          console.log(data)
          return data;
        }
      } 
    });
  };