// import moment from "moment";
// import { getAssetAndDataObject, World } from "../../../space-shooter/rtsdk";
import { createText } from "../text";
import { addFrame } from "../staticAssets";
import { capitalize } from "../utils";

export const boardLength = 10;

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
  xOffset,
  yOffset,
}) => {
  // Check to see if stats board already exists.

  const arcadeAsset = await getAssetAndDataObject(req);
  // const arcadeAsset = await getDroppedAsset(req);
  const assetPos = arcadeAsset.position;

  // const dataObject = arcadeAsset.dataObject;
  // const { highScores } = dataObject;
  // const highScores = null;
  const x = xOffset ? assetPos.x + xOffset : assetPos.x;
  const y = yOffset ? assetPos.y + yOffset : assetPos.y;
  const posOffset = { x, y };

  await addFrame({ InteractiveAsset, assetId, frameId, namePrefix, pos: posOffset, req, urlSlug });

  const prefix = namePrefix || "multiplayer_board";

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
        textWidth: contentWidth / keysArray.length,
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
        textSize: 19,
        textWidth: contentWidth / keysArray.length,
        uniqueName: `${prefix}_${assetId}_${uniqueNameId}`,
        urlSlug,
      });
    };
    const numColumns = keysArray.length;
    const { x, y } = posOffset;
    const topOfLeaderboard = -110;

    // Create board header
    keysArray.forEach((key, index) => {
      const posX = x - contentWidth / 2 + (index * contentWidth) / (numColumns - 1);
      let keyKey = typeof key === "string" ? key : Object.keys(key)[0];
      let keyText = typeof key === "string" ? key : Object.values(key)[0];
      keyText = capitalize(keyText);
      const pos = { x: posX, y: topOfLeaderboard + y };

      createHeaderText({
        pos,
        uniqueNameId: `header_${keyKey}`,
        text: keyText,
      });
    });

    const valuesStart = topOfLeaderboard + 35;

    // Create board values
    for (var i = 0; i < boardLength; i++) {
      keysArray.forEach((key, index) => {
        const posX = x - contentWidth / 2 + (index * contentWidth) / (numColumns - 1);
        const pos = { x: posX, y: valuesStart + y + i * distBetweenRows };
        let keyKey = typeof key === "string" ? key : Object.keys(key)[0];
        // const keyText = typeof key === "string" ? key : Object.values(key)[0];
        createLeaderText({
          pos,
          uniqueNameId: `${keyKey}_${i}`,
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
    const prefix = namePrefix || "multiplayer_board";
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
