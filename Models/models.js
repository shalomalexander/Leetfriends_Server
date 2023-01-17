const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  leetcodeUsername: { type: String, required: true, unique: true },
  members: { type: Array, items: { type: "string", uniqueItems: true } },
  isCreatedOn: { type: Date, default: Date.now },
});

// const ClanSchema = new mongoose.Schema({
//   clanName: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   clanRating: {
//     type: String,
//   },
//   totalMembers: {
//     type: Number,
//   },
//   clanMembers: {
//     type: Array,
//   },
//   clanAdmin: {
//     type: String,
//     required: true,
//   },
// });

const User = mongoose.model("User", UserSchema);
// const Clan = mongoose.model("Clan", ClanSchema);

module.exports = { User };
