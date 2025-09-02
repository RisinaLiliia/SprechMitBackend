import { SessionsCollection } from "../models/sessionModel.js";
import { FIFTEEN_MINUTES, ONE_DAY } from "../constants/index.js";

export const createOrReplaceSession = async (
  userId,
  accessToken,
  refreshToken
) => {
  const now = Date.now();
  await SessionsCollection.deleteOne({ userId }).catch(console.error);

  return SessionsCollection.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(now + ONE_DAY),
  });
};
