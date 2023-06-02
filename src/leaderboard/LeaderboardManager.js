import moment from "moment";
// import { getAssetAndDataObject, World } from "../../../space-shooter/rtsdk";
import { createText } from "../text";
import { addFrame } from "../staticAssets";

export const leaderboardLength = 10;

export const showLeaderboard = async ({ InteractiveAsset, assetId, getAssetAndDataObject, req, urlSlug }) => {
  // TODO Check to see if leaderboard already exists.

  const arcadeAsset = await getAssetAndDataObject(req);
  // const arcadeAsset = await getDroppedAsset(req);
  const assetPos = arcadeAsset.position;

  const dataObject = arcadeAsset.dataObject;
  const { highScores } = dataObject;
  // const highScores = null;
  const posOffset = { x: assetPos.x - 400, y: assetPos.y };

  const layers = { bottom: "https://topiaimages.s3.us-west-1.amazonaws.com/Leaderboard.png", top: "" };
  addFrame({ InteractiveAsset, assetId, layers, pos: posOffset, req, urlSlug });

  // Doing this because we don't yet have layering in SDK.
  setTimeout(() => {
    const createLeaderText = ({ pos, index, uniqueNameId, text }) => {
      createText({
        InteractiveAsset,
        pos,
        req,
        text: text || "-",
        textColor: "#000000",
        textSize: 12,
        textWidth: 300,
        uniqueName: `multiplayer_leaderboard_${assetId}_${uniqueNameId}_${index}`,
        urlSlug,
      });
    };
    const distBetweenRows = 23;
    const distBetweenColumns = 150;

    for (var i = 0; i < leaderboardLength; i++) {
      // Player Names
      const { x, y } = posOffset;
      const topOfLeaderboard = -10;
      // const topOfLeaderboard = -160;

      createLeaderText({
        pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `playerName`,
        index: i,
      });

      // Scores
      createLeaderText({
        pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + i * distBetweenRows },
        uniqueNameId: `score`,
        index: i,
      });
    }

    for (var j = 0; j < 3; j++) {
      // Player Names
      const { x, y } = posOffset;
      const topOfLeaderboard = -125;

      let scoreObj = { name: "-", date: "-", score: "-" };
      let scoreString = "-";
      if (highScores && highScores[j]) {
        scoreObj = highScores[j];
        scoreObj.date = moment(parseInt(highScores[j].date)).fromNow(); // Use moment to format
        scoreString = scoreObj.score.toString() || "0";
      }

      createLeaderText({
        pos: { x: x - distBetweenColumns / 2, y: topOfLeaderboard + y + j * distBetweenRows },
        uniqueNameId: `topPlayerName`,
        text: scoreObj.name,
        index: j,
      });

      createLeaderText({
        pos: { x: x, y: topOfLeaderboard + y + j * distBetweenRows },
        uniqueNameId: `topDate`,
        text: scoreObj.date,
        index: j,
      });

      // Scores
      createLeaderText({
        pos: { x: x + distBetweenColumns / 2, y: topOfLeaderboard + y + j * distBetweenRows },
        uniqueNameId: `topScore`,
        text: scoreString,
        index: j,
      });
    }
  }, 500);
};

export const hideLeaderboard = async ({ World, req }) => {
  const { assetId, urlSlug } = req.body;
  try {
    const world = World.create(urlSlug, { credentials: req.body });
    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
      isPartial: true,
      uniqueName: `multiplayer_leaderboard_${assetId}`,
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

export const resetLeaderboard = () => {
  return;
};
