export const getImagePath = (path: string) => {
  return path?.includes("dist") ? path.slice(5) : path;
};
