var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import moment from "moment";
// import { getAssetAndDataObject, World } from "../../../space-shooter/rtsdk";
import { createText } from "../text";
import { addFrame } from "../staticAssets";
export const leaderboardLength = 10;
export const showLeaderboard = ({ InteractiveAsset, assetId, getAssetAndDataObject, req, urlSlug }) => __awaiter(void 0, void 0, void 0, function* () {
    // Check to see if leaderboard already exists.
    const arcadeAsset = yield getAssetAndDataObject(req);
    // const arcadeAsset = await getDroppedAsset(req);
    const assetPos = arcadeAsset.position;
    const dataObject = arcadeAsset.dataObject;
    const { highScores } = dataObject;
    // const highScores = null;
    const posOffset = { x: assetPos.x, y: assetPos.y + 400 };
    addFrame({ InteractiveAsset, assetId, frameId: "UaJENXLHNkuBI4pzFH50", pos: posOffset, req, urlSlug });
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
});
export const hideLeaderboard = ({ World, req }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { assetId, urlSlug } = req.body;
    try {
        const world = World.create(urlSlug, { credentials: req.body });
        const droppedAssets = yield world.fetchDroppedAssetsWithUniqueName({
            isPartial: true,
            uniqueName: `multiplayer_leaderboard_${assetId}`,
        });
        if (droppedAssets && droppedAssets.length)
            droppedAssets.forEach((droppedAsset) => {
                try {
                    droppedAsset.deleteDroppedAsset();
                }
                catch (e) {
                    console.log("Error on delete dropped asset", e);
                }
            });
    }
    catch (e) {
        console.log("Error removing leaderboard", ((_a = e === null || e === void 0 ? void 0 : e.response) === null || _a === void 0 ? void 0 : _a.status) || ((_b = e === null || e === void 0 ? void 0 : e.data) === null || _b === void 0 ? void 0 : _b.errors));
    }
});
export const resetLeaderboard = () => {
    return;
};
