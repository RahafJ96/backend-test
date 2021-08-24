'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const server = express();
server.use(cors());
server.use(express.json());
const mongoose = require('mongoose');

const PORT=process.env.PORT || 3001;

mongoose.connect('mongodb://localhost:27017/drink', {useNewUrlParser: true, useUnifiedTopology: true});

const drinksSchema = new mongoose.Schema({
    drinkName:String,
    drinkImg:String
});

  const ownerSchema = new mongoose.Schema({
    userEmail: String,
    drinks:[drinksSchema]
  });

  const ownerModel = mongoose.model('drink', ownerSchema);


//http://localhost:3001/
server.get('/',getHomeHandler);
//http://localhost:3001/getData
server.get('/getData',getDataHandler);
//http://localhost:3001/getDataFav
server.get('/getDataFav',getDataFavHandler);
//http://localhost:3001/addData
server.post('/addData',addDataHandler);
//http://localhost:3001/deleteData
server.delete('/deleteData/:idx',deleteDataHandler);
//http://localhost:3001/updateData
server.put('/updateData/:idx',updateDataHandler);

function getDataHandler(req,res){
    const url='https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic';
    axios.get(url).then(result=>{
        res.send(result.data.drinks)
    })
}

function getDataFavHandler(req,res){
    const { userEmail } = req.query;
    console.log(userEmail)
    ownerModel.findOne({ userEmail: userEmail }, (err, result) => {
        if (err) console.log(err);
        else {
            res.send(result.drinks);
        }
    });
}


function addDataHandler(req,res){
    const {userEmail,drinkObj}=req.body;
    console.log('in add', userEmail, drinkObj)
    ownerModel.findOne({userEmail:userEmail},(error,data)=>{
        if (error) console.log(error);
        else if (!data){
            const newOwner= new ownerModel({
                userEmail:userEmail,
                drinks:[drinkObj],
            });
            newOwner.save()
            console.log('inside if else',data);
        }
        else{
            data.drinks.unshift(drinkObj);
            data.save();
        }
    });
};

function deleteDataHandler(req,res){
    const {idx}=req.params;
    const {userEmail}=req.query;
    ownerModel.findOne({userEmail:userEmail},(error,data)=>{
        if (error) console.log(error);
        else{
            data.drinks.splice(idx,1);
            data.save().then(()=>{
                ownerModel.findOne({userEmail:userEmail},(error,data)=>{
                    res.send(data.drinks);
                })
            })
        }
    })
}

function updateDataHandler(req,res){
    const {idx}=req.params;
    const {userEmail,drinkObj}=req.body;
    ownerModel.findOne({userEmail:userEmail},(error,data)=>{
        if (error) console.log(error);
        else{
            data.drinks[idx]=drinkObj;
            data.save().then(()=>{
                ownerModel.findOne({userEmail:userEmail},(error,data)=>{
                    res.send(data.drinks)
                })

        })
        }
    })
}

function getHomeHandler(req,res){
    res.send('Hello, from the root route')
}

server.listen(PORT,()=>{
    console.log(`I'm Listening to port ${PORT}`);
})

