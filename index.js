const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')));
const port = 3000;
const CommunityDB = require('./models/communityDB');
const PostDB = require('./models/postDB');


app.get("/home",(req,res)=>{
    res.render("home")
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.listen(port,(req,res)=>{
    console.log("connected succesfully")
})


// mongodb
mongoose.connect('mongodb+srv://dhruvsingh235443:4Xltnili772nDW9s@cluster0.iv8mwez.mongodb.net/?retryWrites=true&w=majority').
then(()=>{
    console.log('DB CONNECTED');})
.catch((err)=>{
    console.log('error');
})
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const study_schema = new mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    skill:{
        type:String,
        trim:true
    },
    contact:{
        type:String,
        trim:true
    },
    time:{ 
        type:String,
        trim:true
    },
    linkedin:{
        type:String,
        trim:true
    },
    leetcode:{
        type:String,
        trim:true
    },
    
    school:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        trim:true,
        required:true
    }
})

const study_model = mongoose.model('register', study_schema)
// study_model.insertMany(studyDB);


const obj = {logo:"https://www.google.com/url?sa=i&url=https%3A%2F%2F99designs.com%2Finspiration%2Flogos%2Fcommunity&psig=AOvVaw33N5E_v970iBh8osVC89mx&ust=1692646025684000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOCElvr764ADFQAAAAAdAAAAABAh",
name:"HappyHours",
description:"A community for of experienced devs",
posts:["64e26580ea43b589e5f17276","64e26580ea43b589e5f17277","64e26580ea43b589e5f17278"]
}
// CommunityDB.insertMany(obj);











const bcrypt=require("bcrypt");
const { Int32 } = require('bson');


app.post("/login", async (req, res) => {    
    let { email, password } = req.body;
    

    // Check if a user with the given email already exists
    try {
        const existingUser = await study_model.findOne({ email });


        if (!existingUser) {
            // User with the same email already not exists
            return    res.status(500).send('email id not exist');
        }
        const check=await bcrypt.compare(req.body.password,existingUser.password)
        if(!check){
            return res.status(200).send("password not match")
        }

        // User doesn't exist, proceed with registration
        
        console.log('User registered successfully');
        return res.render("/",{existingUser});
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).send('Error registering user');
    }
});
app.post("/register",async (req,res)=>{
    let { name, email,skill,contact,school,time,linkedin,leetcode, password} = req.body;
    const existingUser = await study_model.findOne({ email });
    if(existingUser){
       return  res.send("email id already exist");
    }
    if(req.body.password!=req.body.confirm_pass){
         return res.send("password are not matching");
    }
    
   
    
    // Insert data into the MongoDB database
    try {
        password= await bcrypt.hash(password,10);
        await study_model.create({ name, email,skill,contact,school,time, leetcode,linkedin,password });
        console.log('Data inserted successfully');
        res.redirect("/login");
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
    }
})




app.get("/show",async (req,res)=>{
    let study = await study_model.find({});
    res.render('show',{study});

})



app.post("/show", async (req, res) => {
    const { search } = req.body;
    const study = await study_model.find({ name: search });
      if (study.length > 0) {
        // If users are found, render the 'show' view with the users data
        res.render('show', { study });
      } else {
        // If users are not found, you can render an error view or send an error response
      }
   
  });
app.get('/show/:id',async (req,res)=>{
    let {id}=req.params;
    let found = await study_model.findById(id)
    res.render("connect",{found})
})

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/home",(req,res)=>{
    res.render("home")
})
app.get('/community', async (req, res) => {
    try {
        let comObj = await CommunityDB.find({});
        let postObj = await PostDB.find({});
        res.render('community', { comObj: comObj, postObj: postObj }); // Pass both arrays as an object
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});


const mongoose2 = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: String,
  datePosted: {
    type: Date,
    default: Date.now
  }
});

const Gig = mongoose2.model('Gig', gigSchema);

module.exports = Gig;
// obj ={title:'internship', description:'remote internship in Mumbai',price:499,location:"Mumbai,india"}
// Gig.create(obj)

app.get("/jobs",async (req,res)=>{
    let intern = await Gig.find({});
    res.render('job',{intern});

})
app.get('/posts/:id',async (req,res)=>{
    let {id} = req.params;
    let post = await PostDB.findById(id);
    res.render('blog',{post});
})
