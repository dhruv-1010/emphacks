const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(express.static(path.join(__dirname, '/public')));
const port = 8000 || 3000;
console.log("gaurav")
app.get("/",(req,res)=>{
    res.send("gaurav guzzar")
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
mongoose.connect('mongodb://127.0.0.1:27017/studybuddy').
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
        trim:true
    }
})

const study_model = mongoose.model('register', study_schema)
const dataToInsert = [
    {
        name: "Gaurav patel",
        email: "gauravgurjar8791@gmail.com",
        password: "23222",
        confirm_pass: "23222"
    }
];
study_model.insertMany(dataToInsert)
    .then(insertedData => {
        console.log('Inserted data:', insertedData);
    })
    .catch(error => {
        console.error('Error inserting data:', error);
    });

const bcrypt=require("bcrypt");
const { Int32 } = require('bson');


app.post("/login", async (req, res) => {
    console.log(req.body);
    
    let { email, password } = req.body;
    

    // Check if a user with the given email already exists
    try {
        const existingUser = await study_model.findOne({ email });


        if (!existingUser) {
            // User with the same email already not exists
            return    res.status(500).send('email id not exist');
        }
        const check=await bcrypt.compare(req.body.password,existingUser.password)
        console.log(req.body.password);
        if(!check){
            return res.status(200).send("password not match")
        }

        // User doesn't exist, proceed with registration
        
        console.log('User registered successfully');
        return res.redirect("/");
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).send('Error registering user');
    }
});
app.post("/register",async (req,res)=>{
    let { name, email,skill,contact,school,linkedin,leetcode, password} = req.body;
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
        console.log(password);
        await study_model.create({ name, email,skill,contact,school, leetcode,linkedin,password });
        console.log('Data inserted successfully');
        res.redirect("/");
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
    }
})


app.get("/show",async (req,res)=>{
    let study = await study_model.find({});
    //console.log(quotesprinted)
    res.render('show',{study});

})



app.post("/show", async (req, res) => {
    const { search } = req.body;
   
  
    
    const study = await study_model.find({ skill: search });

    
  
      if (study.length > 0) {
        // If users are found, render the 'show' view with the users data
        res.render('show', { study });
      } else {
        // If users are not found, you can render an error view or send an error response
        res.status(404).json({ message: 'Users not found' });
      }
   
  });
  app.get('/show/:id',async (req,res)=>{
    let {id}=req.params;
    let found = await study_model.findById(id)
    res.render("connect",{found})
    console.log(found);
})


app.get('/home',(req,res)=>{
    res.render('home');
});

app.get('/resource',(req,res)=>{
    res.render('register');
})