const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const Email = req.body.email;

    const data = {
        members:[
            {
                email_address: Email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    
    // replace the X in url with the number at last of your api-key
    const url = "https://usX.api.mailchimp.com/3.0/lists/your_list_id";

    const options = {
        method: "POST",
        auth: "any_string:enter_your_api_key_here"
    }

const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
        res.sendFile(__dirname+"/success.html");
    }else{
        res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data){
        console.log(JSON.parse(data));
    }); 
});
request.write(jsonData);
request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 4000, function(){
    console.log("app listening on port 4000");
});


