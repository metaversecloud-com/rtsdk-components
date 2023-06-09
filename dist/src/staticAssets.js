// import { InteractiveAsset } from "../../space-shooter/rtsdk";
export const addFrame = ({ InteractiveAsset, assetId, frameId, namePrefix, pos, req, urlSlug }) => {
    try {
        const prefix = namePrefix || "multiplayer_leaderboard";
        // const frameAsset = await
        InteractiveAsset({
            id: frameId,
            // id: "NpPd9WTiQMJxoOspx6w1",
            req,
            position: {
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
            },
            uniqueName: `${prefix}_${assetId}_frame`,
            urlSlug,
        });
        // frameAsset.updateScale(1.35);
    }
    catch (e) {
        console.log("Error adding frame", e);
    }
};
