// import { Visitor } from "../../space-shooter/rtsdk";
// import "regenerator-runtime/runtime";

export const roomBasedOn = "assetId";

export const getRoomAndUsername = async ({ Visitor, query }) => {
  const { isAdmin, username, profileId } = await checkWhetherVisitorInWorld(Visitor, query);
  return { isAdmin, roomName: query[roomBasedOn], username, profileId };
};

const checkWhetherVisitorInWorld = async (Visitor, query) => {
  // Check whether have access to interactive nonce, which means visitor is in world.
  const { assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId } = query;

  try {
    const visitor = await Visitor.get(visitorId, urlSlug, {
      credentials: {
        assetId,
        interactiveNonce,
        interactivePublicKey,
        visitorId,
      },
    });
    if (!visitor || !visitor.username) throw "Not in world";

    const { privateZoneId, username, isAdmin, profileId } = visitor;

    if (!privateZoneId || privateZoneId !== assetId) {
      // Not in the private Zone.  Can watch ships fly around, but can't play.
      return { username: null, isAdmin };
    } else {
      return { isAdmin, username, profileId };
    }
  } catch (e) {
    // Not actually in the world.  Should prevent from seeing game.
    if (e && e.data && e.data.errors) console.log("Error getting visitor", e?.data?.errors);
    else if (e) console.log("Error visitor", e);
    return { isAdmin: false, username: -1 };
  }
};
