

// const SEARCH_URL = "http://api.serpstack.com/search?access_key=da3e5fe26d960036cfb8f0a85e16b0cb&query="


// var getTrack = async function(searchString) {
//     console.log("Getting Track:SoundCloud")
//     var soundSearch = `${SEARCH_URL}${searchString}+site:soundcloud.com`
//     console.log("Soundcloud search string: " + soundSearch)
//     var results= await getApi(soundSearch);
//     console.log(results);
// }



//   var getApi = function(apiUrl) {
//     return fetch(apiUrl).then(function (response) {
//       if (response.ok) {
//        const data = response.json();
//         if (data.length == 0) {
//           window.alert("No results returned");
//           return;
//         } else {
//           console.log(data)
//           return data;
//         }
//       } 
//     });
//   };