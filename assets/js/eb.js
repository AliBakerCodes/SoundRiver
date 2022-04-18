var MB_ARTIST_URL='https://musicbrainz.org/ws/2/artist?query='
var HEADERS = new Headers({
    "Accept"       : "application/json",
    "Content-Type" : "application/json",
    "User-Agent"   : "SR"
});

var getArtist = async function(searchString){
   console.log("Getting Artist:MB")
    var mbSearch = `${MB_ARTIST_URL}${searchString}&fmt=json`
    console.log("MB search string: " + mbSearch)
    var results= await getApi(mbSearch);
    console.log("Artist Results:")
    var artist=results.artists[0];
    consol.log(artist)
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