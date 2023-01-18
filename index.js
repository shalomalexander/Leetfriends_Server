var express = require('express');
app = express();
routes = require('./Routes/routes');
cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv")

port = process.env.PORT || 3000;
dotenv.config()
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xumfyby.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

// Page Routes
app.get('/', routes.index);

// API Routes
app.get('/api/get-users-leetcode-profile', routes.getUsersLeetcodeProfileGuide);
app.get('/api/get-users-leetcode-profile/:username', routes.getUsersLeetcodeProfile);
app.post('/api/create-user', routes.createUser);
app.post('/api/add-member', routes.addMember);
app.post('/api/delete-member', routes.deleteMember)


app.listen(port, function() {
  console.log('Listening on port ' + port);
});