gapi.load("client", loadClient);
  
function loadClient() {
    gapi.client.setApiKey("AIzaSyAERvzRTUCeRtSP34qM17Jsvp_KkO9rrYM");
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
                function(err) { console.error("Error loading GAPI client for API", err); });
}

const SEARCH_URL = "http://api.serpstack.com/search?access_key=da3e5fe26d960036cfb8f0a85e16b0cb&query="


var getTrack = async function(searchString) {
    console.log("Getting Track:SoundCloud")
    var soundSearch = `${SEARCH_URL}${searchString}+site:soundcloud.com&num=5`
    console.log("Soundcloud search string: " + soundSearch)
    var scResults= await getApi(soundSearch);
    console.log(scResults);
    console.log("Getting Track:YouTube")
    console.log("Youtube search string: " + searchString)
    ytResults= await getYouTube(searchString);
    console.log(ytResults);
    console.log("Getting Track:Spotify")
    var spSearch = `${SEARCH_URL}${searchString}+site:spotify.com&num=5`
    console.log("Spotify search string: " + spSearch)
    var spResults= await getApi(spSearch);
    console.log(spResults);
    console.log("SC Results URL: " + scResults.organic_results[0].url);
    newSong['scLink']=scURL(scResults.organic_results[0].url)
    console.log("SP Results URL: " + spResults.organic_results[0].url);
    newSong['spLink']=spURL(spResults.organic_results[0].url)
    console.log("YT Results URL: " +ytResults)
    newSong['ytLink']=ytResults
}

function scURL (url){
    var pathArray = url.split('/');
    var s=`${pathArray[3]}/${pathArray[4]}`
    console.log("SC URL:" + s);
    return s;
}

function spURL (url){
    var pathArray = url.split('/');
    var s=pathArray[4]
    console.log("SC URL:" + s);
    return s;
}

async function getYouTube(searchString){
    var arr_search = {
        "part": 'snippet',
        "type": 'video',
        "order": 'relevance',
        "maxResults": 5,
        "q": searchString
    };
    return gapi.client.youtube.search.list(arr_search)
    .then(function(response) {
        console.log(response);
        var results=response.result.items;
        if(results){
            return results[0].id.videoId;
        }
    });
}