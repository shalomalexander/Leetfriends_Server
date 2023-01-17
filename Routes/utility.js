const axios = require("axios");

exports.fetchUserDetail = async (req, res) => {
  let username = req.username;
  const endpoint = "https://leetcode.com/graphql/";

  const graphqlQuery = {
    query: `
        query userProfile($username: String!) {
          matchedUser(username: $username) {
            contestBadge {
              name
              expired
              hoverText
              icon
            }
            username
            githubUrl
            twitterUrl
            linkedinUrl
              profile {
              ranking
              userAvatar
              realName
              aboutMe
              school
              websites
              countryName
              company
              jobTitle
              skillTags
              postViewCount
              postViewCountDiff
              reputation
              reputationDiff
              solutionCount
              solutionCountDiff
              categoryDiscussCount
              categoryDiscussCountDiff
            }
          }
        }
                `,
    variables: {
      username: `${username}`,
    },
  };
  return axios
    .post(endpoint, graphqlQuery)
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });
};

exports.fetchLeetcodeInfoOfUser = async (req, res) => {
  const endpoint = "https://leetcode.com/graphql/";

  const username = req.username;

  const graphqlQuery = {
    query: `
      query userContestRankingInfo($username: String!) {
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
          totalParticipants
          topPercentage
          badge {
            name
          }
        }
        userContestRankingHistory(username: $username) {
          attended
          trendDirection
          problemsSolved
          totalProblems
          finishTimeInSeconds
          rating
          ranking
          contest {
            title
            startTime
          }
        }
      }
              `,
    variables: {
      username: `${username}`,
    },
  };

  return axios
    .post(endpoint, graphqlQuery)
    .then((response) => {
      res = {
        username: username,
        ...response.data.data.userContestRanking,
        userContestRankingHistory: [
          response.data.data.userContestRankingHistory[
            response.data.data.userContestRankingHistory.length - 1
          ],
          response.data.data.userContestRankingHistory[
            response.data.data.userContestRankingHistory.length - 2
          ],
        ],
      };
      return res;
    })
    .catch((error) => {
      console.log(error);
    });
};
