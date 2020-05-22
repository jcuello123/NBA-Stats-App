const express = require('express');
const app = express();
const fetch = require('node-fetch');
const exphbs = require('express-handlebars');
const path = require('path');

//Initialize player data
var playerData = {};

async function initPlayerData() {
    try {
        const response = await fetch('https://nba-players.herokuapp.com/players-stats/irving/kyrie');
        const image = 'https://nba-players.herokuapp.com/players/irving/kyrie';
        const data = {
            stats: await response.json(),
            image_link: image
        };
        playerData = data;
    } catch (err) {
        console.log(err)
    }
}

initPlayerData();

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Handlebars view
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

//Render
app.get('/', (req, res) => {
    res.render('index', { data: playerData });
});

//Routes
app.get('/', (req, res) => {
    res.send('allo');
})

app.get('/players/:firstName/:lastName', async(req, res) => {
    const firstName = req.params.firstName;
    const lastName = req.params.lastName;

    try {
        const response = await fetch(`https://nba-players.herokuapp.com/players-stats/${lastName}/${firstName}`);
        const image = `https://nba-players.herokuapp.com/players/${lastName}/${firstName}`;
        const data = {
            stats: await response.json(),
            image_link: image
        };
        playerData = data;
        res.redirect('/');
    } catch (err) {
        console.log(err)
    }
});

//Server start & port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});