export function fileStorageUpload(
  @UploadedFile() file: any,
  @Body() { id }: { id },
  @Res() res: any,
): Promise<IFileStorageDto> {
  try {
    if (!id) {
      return ExceptionHandler('Object ID is required', 400);
    }

    const data = new FileStorageDto();

    let user: TDto;
    if (await this.service.isExist(id)) {
      user = await this.service.fetch(id);
      if (user.photo) {
        data.id = user.photo.id;
      }
    }

    data.file = file;
    data.ownerId = id;
    data.object = 'profile';
    data.type = 'photo';

    const uploadResult = await this.fileService.upload(data, ...(roles.read || roles.default));

    if (user) {
      user.photo = uploadResult;

      await this.service.update(id, user);
    }

    return res.status(200).json(uploadResult);
  } catch (e) {
    return ExceptionHandler(e);
  }
}
