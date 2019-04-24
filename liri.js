//Read and set any environment variables with the .env package.
require("dotenv").config();

//Require data from File System npm package
var fs = require("fs");
// Requiring our spotify, OMDB, and bands in town modules exported from keys.js
var keys = require("./keys");
//Require data from Axios npm package
var axios = require("axios");
//Require data from moment npm package
var moment = require('moment');
//Require data from node-spotify npm package
var Spotify = require('node-spotify-api');
// Storing API keys in variables.
var spotify = new Spotify(keys.spotify);


//Creates initial user command.
var userCommand=process.argv[2];
//Creates user input.
var userInput=process.argv.splice(3,process.argv.length).join(' ');


//Program conditions 
switch (userCommand) {
    // help function to clarify commands used
    case "help":
    console.log("\n=====================LIRI-HELP====================");
    console.log("Please type one of these commands: \n"+
                    "'concert' | type node liri concert jayz \n"+
                    "'spotify' | type node liri spotify the motto \n"+
                    "'movie'   | type node liri movie the matrix \n"+
                    "'do-it'   | type search spotify using command from random.txt ");
    console.log('==================================================\n');

        break;
    case "concert":
        myConcert(userInput);
        break;
    case "spotify":
        mySpotify(userInput);
        break;
    case "movie":
        myMovies(userInput);
        break;
    case "do-it":
        doWhatItSays();
        break;
    //if anything else written
    default:
        console.log("Error, did not recognize input - Type 'node liri help' for help menu");
};


// Begin do-it function
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        //Return error if error occurs.
        if (error) {
            return console.log(error);
        }
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        
        // Each command is represented. Because of the format in the txt file, remove the quotes to run these commands. 
        if (dataArr[0] === "spotify") {
            var songcheck = dataArr[1].slice(1, -1);
            console.log("\n======================ALERT======================");
            console.log("Running external file song script...");
            console.log("Song Check: loading " + "'" + songcheck + "'" + " to spotify")
            mySpotify(songcheck);
        }
        if (dataArr[0] === "concert") {
            var venueName = dataArr[1].slice(1, -1);
            console.log("Venue Name: " + venueName)
            myConcert(venueName);
        } 
        if(dataArr[0] === "movie") {
            var movieName = dataArr[1].slice(1, -1);
            console.log("Movie Name: " + movieName)
            myMovies(movieName);
        }
    });
};





// Begin movie function
function myMovies(userInput) {
    var movie = userInput;
    if (!movie) {
        console.log("\n======================ALERT======================");
        console.log("You didn't run a movie query... loading 'The Matrix'");
        movie = "The Matrix";
    }
    var url = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(url).then(
        function (response) {
            // log object to see return
            // console.log(response.data)
                console.log("\n======================MOVIES=====================");
                console.log("Movie Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.imdbRating);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Actors: " + response.data.Actors);
                console.log("Plot: " + response.data.Plot);
                console.log("=================================================\n");
            //adds text to log.txt
                fs.appendFileSync('log.txt', "\r\n" + "\n=================MOVIE-SEARCH====================", 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Title: " + response.data.Title, 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Year: " + response.data.Year, 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "IMDB Rating: " + response.data.imdbRating, 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Country: " + response.data.Country, 'utf8');                
                fs.appendFileSync('log.txt', "\r\n" + "Language: " + response.data.Language, 'utf8');                
                fs.appendFileSync('log.txt', "\r\n" + "Actors: " + response.data.Actors, 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Plot: " + response.data.Plot, 'utf8');                
                fs.appendFileSync('log.txt', "\r\n" + "==================================================\n"+ "\r\n", 'utf8');
            
        }
    );
};


// Exporting the function which we will use in main.js
module.exports = myMovies;




// Begin concert function
function myConcert(userInput) {
    var artist = userInput;
    if (!artist) {
        console.log("\n======================ALERT=======================");
        console.log("You didn't run a concert query... loading 'JayZ'");
        artist = "JayZ";
    }
    var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsInTown.id;
    

    axios.get(url).then(
        function (response) {
            // log object to see return
            // console.log(response.data)
            for (var i = 0; i < response.data.length; i++) {
                console.log("\n=====================CONCERTS=====================");
                console.log("Name: " + response.data[i].lineup[0]);
                console.log("Concert Time: " + moment(response.data[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'));
                console.log("Concert Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country);
                console.log("Concert Venue: " + response.data[i].venue.name);
                console.log('==================================================\n');
                fs.appendFileSync('log.txt', "\r\n" + "\n==================CONCERT-SEARCH====================", 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Name: " + response.data[i].lineup[0], 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Venue Name: " + response.data[i].venue.name, 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region + ", " + response.data[i].venue.country, 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "Venue Time: " + moment(response.data[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'), 'utf8');
                fs.appendFileSync('log.txt', "\r\n" + "===================================================\n"+ "\r\n", 'utf8');
            }
        }
    );

};

// Exporting the function which we will use in main.js
module.exports = myConcert;




// Begin spotify function
function mySpotify(userInput) {
    var song = userInput;
    if (!song) {
        console.log("\n======================ALERT=======================");
        console.log("You didn't run an artist query... loading 'The Motto by Drake'");
        song = "the motto Drake" 
    }
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      // log object to see return
      // console.log(data.tracks.items[0]); 
      console.log("\n======================SONG========================");
      console.log("Artist(s) Name: "+ data.tracks.items[0].artists[0].name);
      console.log("Song Name: " + data.tracks.items[0].name);
      console.log("Album Name: "+ data.tracks.items[0].album.name);
      console.log("Spotify URL: " + data.tracks.items[0].href);
      console.log("Explicit: " + data.tracks.items[0].explicit);
      console.log('==================================================\n');
     //adds text to log.txt
        fs.appendFileSync('log.txt', "\r\n" + "\n===================SONG-SEARCH===================", 'utf8');
        fs.appendFileSync('log.txt', "\r\n" + "Artist(s): " + data.tracks.items[0].artists[0].name, 'utf8');
        fs.appendFileSync('log.txt', "\r\n" + "Song Name: " + data.tracks.items[0].name, 'utf8' );
        fs.appendFileSync('log.txt', "\r\n" + "Album: " + data.tracks.items[0].album.name, 'utf8');
        fs.appendFileSync('log.txt', "\r\n" + "Spotify URL: " + data.tracks.items[0].href, 'utf8' );
        fs.appendFileSync('log.txt', "\r\n" + "Explicit: " + data.tracks.items[0].explicit, 'utf8' );
        fs.appendFileSync('log.txt', "\r\n" + "==================================================\n"+ "\r\n", 'utf8');
      });
    }


// Exporting the function which we will use in main.js
module.exports = mySpotify;