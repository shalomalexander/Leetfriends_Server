const axios = require("axios");

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
  res.send("Welcome to Leetfriends. Kindly pass a leetcode username as parameter. eg:- /api/get-users-leetcode-profile/USERNAME");
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
