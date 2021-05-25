const express = require('express');
const fs = require('fs');
// const { userInfo } = require('node:os');
const app = express()
// const path = require('path');
const posts = require('./posts.json')
let PORT = 5000


app.use(express.json()) // for parsing application/json

// request to home page
app.get('/', (req, res) => {
    res.send('Hello World!')
})


//get all posts
app.get('/posts', (req,res) => {
    res.send({posts})
})


// get a single post
app.get('/posts/:id', (req,res) => {
    // set id variable 
    let id = req.params.id;
    //find user in array
    //returns first elemen tin array that matches conditions
    let foundPosts = posts.find((post) =>{
        return String(post.id) === id
    })
    if(foundPosts){
        return res.status(200).json({post: foundPosts})
    }
    else{
        return res.status(404).json({message: 'user not found'})
    }

})


// request to post to  page
app.post('/posts', (req, res) => {
    //adding new element to our local copy of the posts.json
    posts.push(req.body);
   

    //stringify json 
    let stringData = JSON.stringify(posts,null,2);

    // write to local file
    fs.writeFile('posts.json',stringData, (err) => {
        if(err){
            //internal server error code is 500 
            return res.status(500).json({message: err})
        }
    })    
    return res.status(200).json({message: "new post has been uploaded"}) 
})

//update a single post
app.put('/posts/:id', (req, res) => {
    // searching for id
    let id = req.params.id
    let new_post = req.body
    
    //checking if id to be updated exists 
    let foundPosts = posts.find((post) =>{
        if (String(post.id) === id){
            // get index of posts and set to new post
            posts[posts.indexOf(post)] = new_post
            console.log("trying to put in new posts")
            return true;  
        }
    })

    if(foundPosts){
      
        let stringData = JSON.stringify(posts,null,2);
            
        // write to local file
        fs.writeFile('posts.json',stringData, (err) => {
            if(err){
                //internal server error code is 500 
                return res.status(500).json({message: err})
            }
        })   
      
        return res.status(200).json({message: "new post has been updated"})
   
    }
    else{
        return res.status(404).json({message: 'user not found'})
    }
})



  app.listen(PORT, function(err){
      if (err) console.log(err);
      console.log("Server listening on PORT", PORT);
  });

  
