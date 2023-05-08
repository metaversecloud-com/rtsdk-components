// import moment from "moment";
// import { getAssetAndDataObject, World } from "../../../space-shooter/rtsdk";
import { createText } from "../text";
import { addFrame } from "../staticAssets";

export const leaderboardLength = 10;

export const showBoard = async ({
  InteractiveAsset,
  assetId,
  distBetweenRows,
  getAssetAndDataObject,
  keysArray,
  frameId,
  req,
  namePrefix,
  contentWidth,
  urlSlug,
  yOffset,
}) => {
  // Check to see if leaderboard already exists.

  const arcadeAsset = await getAssetAndDataObject(req);
  // const arcadeAsset = await getDroppedAsset(req);
  const assetPos = arcadeAsset.position;

  // const dataObject = arcadeAsset.dataObject;
  // const { highScores } = dataObject;
  // const highScores = null;
  const posOffset = { x: assetPos.x, y: assetPos.y + yOffset };

  addFrame({ InteractiveAsset, assetId, frameId, namePrefix, pos: posOffset, req, urlSlug });

  const prefix = namePrefix || "multiplayer_leaderboard";

  // Doing this because we don't yet have layering in SDK.
  setTimeout(() => {
    const createLeaderText = ({ pos, uniqueNameId, text }) => {
      createText({
        InteractiveAsset,
        pos,
        req,
        text: text || "-",
        textColor: "#000000",
        textSize: 12,
        textWidth: 300,
        uniqueName: `${prefix}_${assetId}_${uniqueNameId}`,
        urlSlug,
      });
    };

    const createHeaderText = ({ pos, uniqueNameId, text }) => {
      createText({
        InteractiveAsset,
        pos,
        req,
        text: text || "-",
        textColor: "#000000",
        textSize: 20,
        textWidth: 300,
        uniqueName: `${prefix}_${assetId}_${uniqueNameId}`,
        urlSlug,
      });
    };
    const numColumns = keysArray.length;
    const { x, y } = posOffset;
    const topOfLeaderboard = -50;

    // Create board header
    keysArray.forEach((key) => {
      const posX = x - contentWidth / 2 + (i * contentWidth) / (numColumns - 1);
      const keyText = typeof key === "string" ? key : Object.values(key)[0];
      createHeaderText({
        pos: { x: posX, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `header_${key}`,
        text: keyText,
      });
    });

    const valuesStart = -30;

    // Create board values
    for (var i = 0; i < leaderboardLength; i++) {
      keysArray.forEach((key) => {
        const posX = x - contentWidth / 2 + (i * contentWidth) / (numColumns - 1);
        createLeaderText({
          pos: { x: posX, y: valuesStart + y + i * distBetweenRows },
          uniqueNameId: `${key}_${i}`,
        });
      });

      // createLeaderText({
      //   pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
      //   uniqueNameId: `playerName`,
      // });

      // // Scores
      // createLeaderText({
      //   pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
      //   uniqueNameId: `score`,
      // });
    }

    // // High Score part of board
    // for (var i = 0; i < 3; i++) {
    //   // Player Names
    //   const { x, y } = posOffset;
    //   const topOfLeaderboard = -125;

    //   let scoreObj = { name: "-", date: "-", score: "-" };
    //   let scoreString = "-";
    //   if (highScores && highScores[i]) {
    //     scoreObj = highScores[i];
    //     scoreObj.date = moment(parseInt(highScores[i].date)).fromNow(); // Use moment to format
    //     scoreString = scoreObj.score.toString() || "0";
    //   }

    //   createLeaderText({
    //     pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
    //     uniqueNameId: `topPlayerName`,
    //     text: scoreObj.name,
    //   });

    //   createLeaderText({
    //     pos: { x: x, y: topOfLeaderboard + y + i * distBetweenRows },
    //     uniqueNameId: `topDate`,
    //     text: scoreObj.date,
    //   });

    //   // Scores
    //   createLeaderText({
    //     pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
    //     uniqueNameId: `topScore`,
    //     text: scoreString,
    //   });
    // }
  }, 500);
};

export const hideBoard = async ({ World, namePrefix, req }) => {
  const { assetId, urlSlug } = req.body;
  try {
    const world = World.create(urlSlug, { credentials: req.body });
    const prefix = namePrefix || "multiplayer_leaderboard";
    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
      isPartial: true,
      uniqueName: `${prefix}_${assetId}`,
    });
    if (droppedAssets && droppedAssets.length)
      droppedAssets.forEach((droppedAsset) => {
        try {
          droppedAsset.deleteDroppedAsset();
        } catch (e) {
          console.log("Error on delete dropped asset", e);
        }
      });
  } catch (e) {
    console.log("Error removing leaderboard", e?.response?.status || e?.data?.errors);
  }
};

export const resetBoard = () => {
  return;
};
