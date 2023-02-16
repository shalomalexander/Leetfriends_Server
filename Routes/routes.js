const axios = require("axios");
const { User } = require("../Models/models");
const {
  fetchUserDetail,
  getUsersLeetcodeProfileUtility,
} = require("./utility");

exports.index = (req, res) => {
  res.status(200);
  res.send("Welcome to root URL of Server");
};

exports.getUsersLeetcodeProfile = async (req, res) => {
  let username = req.params.username;
  const endpoint = "https://leetcode.com/graphql/";

  const graphqlQuery = {
    query: `
      query userPublicProfile($username: String!) {
        matchedUser(username: $username) {
            username
            profile {
                ranking
                realName
                aboutMe
                countryName
                reputation
            }
            problemsSolvedBeatsStats {      
                difficulty      
                percentage    
            }    
            submitStatsGlobal {      
                acSubmissionNum {        
                    difficulty        
                    count      
                }    
            }  
        }
        allQuestionsCount {    
            difficulty    
            count  
        }
        userContestRanking(username: $username) { 
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
        }
      }`,
    variables: {
      username: `${username}`,
    },
  };

  await axios
    .post(endpoint, graphqlQuery)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getUsersLeetcodeProfileGuide = (req, res) => {
  res.status(200);
  res.send(
    "Welcome to Leetfriends => eg:- /api/get-users-leetcode-profile/USERNAME"
  );
};

exports.createUser = async (req, res) => {
  const { leetcodeUsername } = req.body;
  try {
    const response = await User.create({ leetcodeUsername: leetcodeUsername });
    res.send({ status: "SUCCESS", message: "User created" });
  } catch (err) {
    res.send({ status: "FAIL", message: "User could not be created" });
  }
};

exports.addMember = async (req, res) => {
  const leetcodeUsername = req.body.leetcodeUsername;
  const member = req.body.member.toUpperCase();

  // Check to see if the member leetcode account is valid
  try {
    const memberObject = await fetchUserDetail({ username: member });
    if (memberObject.data.matchedUser) {
      // Check if member already exists in the array
      const UserModel = await User.findOne({
        leetcodeUsername: leetcodeUsername,
      });

      if (UserModel.members.includes(member)) {
        res.send({ status: "FAIL", message: "Member already exists" });
        return;
      }

      try {
        await User.updateOne(
          { leetcodeUsername: leetcodeUsername },
          {
            $push: { members: member },
          }
        );
        res.send(res.send({ status: "SUCCESS", message: "Member added" }));
      } catch (err) {
        res.send({ status: "FAIL", message: "Member could not be added" });
      }
    } else {
      res.send({
        status: "FAIL",
        message: "The leetcode username doesn't not exist",
      });
    }
  } catch (err) {
    res.send({
      status: "FAIL",
      message: "There was some error",
    });
  }
};

exports.deleteMember = async (req, res) => {
  const { leetcodeUsername, member } = req.body;

  try {
    const response = await User.updateOne(
      { leetcodeUsername: leetcodeUsername },
      { $pull: { members: member } }
    );

    res.send({
      status: "SUCCESS",
      message: "The leetcode username removed",
      response: response,
    });
  } catch (err) {
    res.send({
      status: "FAIL",
      message: "The leetcode username could not be removed",
    });
  }
};

exports.getAllMembersLeetcodeProfile = async (req, res) => {
  const membersList = req.body;

  const membersLeetcodeProfilePromise = membersList.map((ele) =>
    getUsersLeetcodeProfileUtility({ username: ele.member })
  );

  const membersLeetcodeProfile = await Promise.all(
    membersLeetcodeProfilePromise
  );

  // Remove the user who are not matched
  let filteredMembersLeetcodeProfile = membersLeetcodeProfile.filter(
    (ele) => ele?.data?.matchedUser !== null
  );

  filteredMembersLeetcodeProfile = filteredMembersLeetcodeProfile.map((ele) => {
    if (ele?.data.userContestRanking === null) {
      return { data: { ...ele.data, userContestRanking: { rating: 0 } } };
    }
    return ele;
  });

  res.send({ status: "SUCCESS", response: filteredMembersLeetcodeProfile });
};

// userContestRankingHistory(username: $username) {
//     attended
//     trendDirection
//     problemsSolved
//     rating
//     ranking
//     contest {
//         title
//         startTime
//     }
// }
