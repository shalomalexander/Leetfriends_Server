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
// app.post('/api/register', routes.registerUser);
// app.post('/api/login', routes.loginUser);
// app.post('/api/refresh-token', routes.refreshToken);
// app.post('/api/create-clan', routes.createClan);
// app.post('/api/view-clan', routes.viewClan);
// app.post('/api/join-clan', routes.joinClan);
// app.post('/api/leave-clan', routes.leaveClan);
// app.post('/api/delete-clan', routes.deleteClan);

// app.get('/api/contest-ratings', routes.contestRatings);
// app.get('/api/user-details/:username', routes.userDetails);
// app.post('/api/add-user', routes.addUser);
// // app.post('/api/clash-of-leetcoders/update-user', routes.updateUser);
// // app.post('/api/clash-of-leetcoders/delete-user', routes.deleteUser);
// app.get('/api/get-all-clans/', routes.getAllClans);



app.listen(port, function() {
  console.log('Listening on port ' + port);
});