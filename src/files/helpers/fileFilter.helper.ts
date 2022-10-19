export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callBack: Function,
) => {
  if (!file) return callBack(new Error('File is empty'), false);

  const fileExeption = file.mimetype.split('/')[1];
  const validExeptions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExeptions.includes(fileExeption)) {
    return callBack(null, true);
  }

  callBack(null, false);
};
