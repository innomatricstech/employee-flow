export const getChatId = (uid1, uid2) => {
  if (!uid1 || !uid2) return null;
  return [uid1, uid2].sort().join("_");
};
