'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());

const PORT=process.env.PORT || 3001

//http://localhost:3001/
server.get('/',getHomeHandler);
//http://localhost:3001/getData
server.get('/getData',getDataHandler);

function getDataHandler(req,res){
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    axios.get(url).then(result=>{
        res.send(result.data.drinks)
    })
}



function getHomeHandler(req,res){
    res.send('Hello, from the root route')
}

server.listen(PORT,()=>{
    console.log(`I'm Listening to port ${PORT}`);
})

