// import { Visitor } from "../../space-shooter/rtsdk";
// import "regenerator-runtime/runtime";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const roomBasedOn = "assetId";
export const getRoomAndUsername = ({ Visitor, query }) => __awaiter(void 0, void 0, void 0, function* () {
    const { isAdmin, username } = yield checkWhetherVisitorInWorld(Visitor, query);
    return { isAdmin, roomName: query[roomBasedOn], username };
});
const checkWhetherVisitorInWorld = (Visitor, query) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Check whether have access to interactive nonce, which means visitor is in world.
    const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = query;
    try {
        const visitor = yield Visitor.get(visitorId, urlSlug, {
            credentials: {
                assetId,
                interactiveNonce,
                interactivePublicKey,
                visitorId,
            },
        });
        if (!visitor || !visitor.username)
            throw "Not in world";
        const { privateZoneId, username, isAdmin } = visitor;
        if (!privateZoneId || privateZoneId !== assetId) {
            // Not in the private Zone.  Can watch ships fly around, but can't play.
            return { username: null, isAdmin };
        }
        else {
            return { isAdmin, username };
        }
    }
    catch (e) {
        // Not actually in the world.  Should prevent from seeing game.
        if (e && e.data && e.data.errors)
            console.log("Error getting visitor", (_a = e === null || e === void 0 ? void 0 : e.data) === null || _a === void 0 ? void 0 : _a.errors);
        else if (e)
            console.log("Error visitor", e);
        return { isAdmin: false, username: -1 };
    }
});
