// import { InteractiveAsset, World } from "../../space-shooter/rtsdk";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const createText = ({ InteractiveAsset, pos, req, text, textColor, textSize, textWidth, uniqueName, urlSlug, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const textAsset = yield InteractiveAsset({
            id: "rXLgzCs1wxpx96YLZAN5",
            req,
            position: pos,
            uniqueName,
            urlSlug,
        });
        yield textAsset.updateCustomTextAsset({
            textColor,
            textFontFamily: "Arial",
            textSize,
            textWeight: "normal",
            textWidth,
        }, text);
        return textAsset;
    }
    catch (e) {
        console.log("Error creating text", e.data ? e.data.errors : e);
    }
});
export const updateText = ({ World, req, text, textOptions = {}, uniqueName }) => {
    return new Promise((res, rej) => __awaiter(void 0, void 0, void 0, function* () {
        const { urlSlug } = req.body;
        try {
            if (!uniqueName)
                return;
            const world = World.create(urlSlug, { credentials: req.body });
            const droppedAssets = yield world.fetchDroppedAssetsWithUniqueName({
                uniqueName,
            });
            if (droppedAssets && droppedAssets[0]) {
                yield droppedAssets[0].updateCustomTextAsset(textOptions, text);
                res();
                // await droppedAssets[0].updateDroppedAssetDataObject(newDataObject);
            }
            else {
                throw "No dropped asset found";
            }
        }
        catch (e) {
            // Don't need this console log.  Include it for dx, but it'll hit pretty frequently.
            // console.log("Error updating text", e);
            console.log("Error updating text", e.data ? e.data.errors : e);
            rej();
        }
    }));
};
