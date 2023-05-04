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
export const addFrame = ({ InteractiveAsset, assetId, pos, req, urlSlug }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const frameAsset = await
        InteractiveAsset({
            id: "UaJENXLHNkuBI4pzFH50",
            // id: "NpPd9WTiQMJxoOspx6w1",
            req,
            position: {
                x: pos ? pos.x : 0,
                y: pos ? pos.y : 0,
            },
            uniqueName: `multiplayer_leaderboard_${assetId}_frame`,
            urlSlug,
        });
        // frameAsset.updateScale(1.35);
    }
    catch (e) {
        console.log("Error adding frame", e);
    }
});
