// import { InteractiveAsset } from "../../space-shooter/rtsdk";

export const addFrame = async ({ InteractiveAsset, assetId, layers, namePrefix, pos, req, urlSlug }) => {
  try {
    const prefix = namePrefix || "multiplayer_leaderboard";
    const droppedAsset = await InteractiveAsset({
      id: "webImageAsset",
      req,
      position: {
        x: pos ? pos.x : 0,
        y: pos ? pos.y : 0,
      },
      uniqueName: `${prefix}_${assetId}_frame`,
      urlSlug,
    });

    if (droppedAsset) await droppedAsset.updateWebImageLayers(layers.bottom || "", layers.top || "");

    // frameAsset.updateScale(1.35);
    // const egg = await dropWebImageAsset({ ...req, body: newBody });
  } catch (e) {
    console.log("Error adding frame", e);
  }
};
