import fs from "fs/promises";
import path from "path";

const deleteOldAvatar = async (req, res, next) => {
  try {
    const { avatarURL } = req.user;
    const avatarPath = path.resolve("public", avatarURL);
    await fs.unlink(avatarPath);
    next();
  } catch (_) {
    next();
  }
};

export default deleteOldAvatar;
