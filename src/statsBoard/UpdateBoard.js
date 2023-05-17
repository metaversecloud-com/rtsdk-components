// import moment from "moment";
// import { throttle } from "throttle-debounce";
// import { getAssetAndDataObject } from "../../../space-shooter/rtsdk";
import { updateText } from "../text";
import { boardLength } from "./BoardManager";
// import { capitalize } from "../utils";

export const updateBoard = async ({
  World,
  // getAssetAndDataObject,
  boardArray,
  keysArray,
  namePrefix,
  // highScores,
  req,
}) => {
  // let sanitizedArray = [];
  // const date = new Date().valueOf();
  const { assetId, urlSlug } = req.body;
  const prefix = namePrefix || "multiplayer_board";
  const world = World.create(urlSlug, { credentials: req.body });
  const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
    isPartial: true,
    uniqueName: `${prefix}_${assetId}`,
  });
  if (!droppedAssets || !droppedAssets.length) return; // If no stats components, don't update anything.

  for (var i = 0; i < boardLength; i++) {
    keysArray.forEach((key) => {
      let text = "-";
      let keyKey = typeof key === "string" ? key : Object.keys(key)[0];
      if (boardArray[i]) text = boardArray[i].data[keyKey];

      updateText({
        World,
        req,
        text,
        uniqueName: `${prefix}_${assetId}_${keyKey}_${i}`,
      });
    });

    // if (leaderboardArray[i] && highScores) {
    //   let name = "-";
    //   let kills = "-";
    //   const score = leaderboardArray[i].data.score;
    //   const id = leaderboardArray[i].id;
    //   name = leaderboardArray[i].data.name;
    //   kills = score.toString() || "0";
    //   sanitizedArray.push({ id, score: kills, name, date });
    // }
  }

  // if (highScores) updateHighScores({ World, getAssetAndDataObject, req, sanitizedArray });
};

// const updateHighScores = async ({ World, getAssetAndDataObject, req, sanitizedArray }) => {
//   const arcadeAsset = await getAssetAndDataObject(req); // This seems to be creating issues with API
//   if (!arcadeAsset) return;
//   const { dataObject } = arcadeAsset;
//   const { highScores } = dataObject;

//   // Don't update high score if the lowest high score is higher than the top current score.
//   if (highScores && highScores[2] && sanitizedArray && sanitizedArray[0].score < highScores[2].score) return;

//   let newArray = highScores ? sanitizedArray.concat(highScores) : sanitizedArray;
//   let sortedArray = newArray.sort((a, b) => {
//     return b.score - a.score;
//   });

//   const objectArray = dedupe(sortedArray);
//   const highScoreArray = objectArray.slice(0, 3);
//   // If they are the same, no need to update object or text.
//   if (highScores === highScoreArray) return;

//   for (let i = 0; i < highScoreArray.length; i++) {
//     let name = "-";
//     let date = "-";
//     let scoreString = "-";
//     if (highScoreArray[i]) {
//       const score = highScoreArray[i].score;
//       name = highScoreArray[i].name;
//       scoreString = score.toString() || "0";
//       date = moment(parseInt(highScoreArray[i].date)).fromNow();
//     }

//     updateText({
//       World,
//       req,
//       text: name,
//       uniqueName: `multiplayer_leaderboard_${req.body.assetId}_topPlayerName_${i}`,
//     });

//     updateText({
//       World,
//       req,
//       text: date,
//       uniqueName: `multiplayer_leaderboard_${req.body.assetId}_topDate_${i}`,
//     });

//     updateText({
//       World,
//       req,
//       text: scoreString,
//       uniqueName: `multiplayer_leaderboard_${req.body.assetId}_topScore_${i}`,
//     });
//   }

//   try {
//     arcadeAsset.updateDroppedAssetDataObject({ highScores: highScoreArray });
//   } catch (e) {
//     console.log("Cannot update dropped asset", e);
//   }
// };

// // Convert to object to dedupe
// function dedupe(arr) {
//   var rv = {};
//   for (var i = 0; i < arr.length; ++i) {
//     const item = arr[i];
//     if (item) {
//       const id = item.id;
//       // Remove duplicate player IDs and prevent score of 0 from being in high score array.
//       if (!rv[id] && item.score) rv[id] = item;
//     }
//   }
//   const dedupedArray = Object.keys(rv).map((id) => rv[id]);
//   return dedupedArray.sort((a, b) => {
//     return b.score - a.score;
//   });
// }
