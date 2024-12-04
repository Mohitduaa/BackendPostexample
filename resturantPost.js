const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4000;

const MONGO_URI = "mongodb+srv://duamohit10:rcmCMgg5rjRrbiNu@mohit.dh99d.mongodb.net/?retryWrites=true&w=majority&appName=Mohit";
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
// app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const UserSchema = new mongoose.Schema({
    userName:String,
    email:{type:String,unique:true},
    password:String,
    orders:[{type:mongoose.Schema.Types.ObjectId,ref:'Order'}]
})

const OrderSchema = new mongoose.Schema({
    items:[{food:String,quanity:Number,price:Number}],
    total:Number,
    orderedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    status:{type:String,default:'Pending'}

})
const User=mongoose.model('User',UserSchema)
const Order=mongoose.model('Order',OrderSchema)

app.post('/register',async (req,res)=>{
    try{
        const user=new User(req.body)
        await user.save();
        res.status(201).send("user registration sucessfully")
    }
    catch(error){
        res.status(500).send(error.message)
    }
})

// login a user
app.post('/login',async(req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email,password:req.body.password})
        if(user){
            res.status(200).send("Login sucessfully")
        }
        else{
            res.status(400).send("Invalid password")

        }
    }
    catch(error){
        res.status(500).send(error.message)
    }
})

// order method
app.post('/order',async (req,res)=>{
    if(req.body.userId){
        try{
            const order =new Order({...req.body,orderedBy:req.body.userId})
            await order.save();
            res.status(200).send("ordered Received")
        }
        catch(error){
            res.status(500).send(error.message)

        }
    }
    else{
        res.status(400).send("user is required otherwise is not a valid id")

    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
