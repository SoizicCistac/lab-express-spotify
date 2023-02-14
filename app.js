require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/artist-search', async (req, res) => {
    // console.log("artist search: ", req.query.artist)
    await spotifyApi
        .searchArtists(req.query.artist)
        .then(data => {
            console.log("data received from API:", data.body)
            res.render('artist-search-result', {artistSearch : data.body.artists.items})
            
            console.log(data.body.artists.items[0].images[0].url)
            
            // data.body.artists.items.forEach(artist => {
            //     console.log(artist.images)
            // });
        })
        .catch(err => console.log(err))

})

app.get('/albums/:id', async (req, res) => {
    await spotifyApi
        .getArtistAlbums(req.params.id, { limit: 10, offset: 20 })
        .then(data => {
            res.render('albums', {albums : data.body.items})
            console.log(data.body.items)
        })
        .catch(err => console.log(err))
})

app.get('/tracks/:id', async (req, res) => {
    await spotifyApi
        .getAlbumTracks(req.params.id, { limit: 5, offset: 1 })
        .then(data => {
            res.render('tracks', {tracks : data.body.items})
            console.log("tracks", data.body)
        })
        .catch(err => console.log(err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
