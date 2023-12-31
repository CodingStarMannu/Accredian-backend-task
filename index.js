
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");


const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname, "build")));
app.use(cors());
app.use(bodyParser.json());


app.use('/', require('./routes'));



app.listen(port, (error) => {
    if (error) {
        console.log(`Error in creating server. Error is: ${error}`);
    }
    console.log(`Server is up and running on the port: ${port}`);
});