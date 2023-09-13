// import { InteractiveAsset } from "../../space-shooter/rtsdk";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const addFrame = ({ InteractiveAsset, assetId, layers, namePrefix, pos, req, urlSlug }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prefix = namePrefix || "multiplayer_leaderboard";
        const droppedAsset = yield InteractiveAsset({
            id: "webImageAsset",
            req,
            position: {
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
            },
            uniqueName: `${prefix}_${assetId}_frame`,
            urlSlug,
        });
        if (droppedAsset)
            yield droppedAsset.updateWebImageLayers(layers.bottom || "", layers.top || "");
        // frameAsset.updateScale(1.35);
        // const egg = await dropWebImageAsset({ ...req, body: newBody });
    }
    catch (e) {
        console.log("Error adding frame", e);
    }
});
