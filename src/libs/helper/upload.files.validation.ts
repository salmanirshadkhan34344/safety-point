import { HttpException, HttpStatus } from "@nestjs/common";
import { extname } from 'path';
import { FileExtensionsEnum } from "../enum/global.enum";


export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|SAG|GPG|PNG|JPEG|GIF)$/)) {
    return callback(new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: [`only allow  ${FileExtensionsEnum.Image} `],
      error: "Bad Request",
    }, HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};

export const imageAndVideoFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|mp4|avi|mov|webm|MP4|AVI|MOV|WEBM|SAG|GPG|PNG|JPEG|GIF)$/)) {
    return callback(new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: [`only allow ${FileExtensionsEnum.All}`],
      error: "Bad Request",
    }, HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};


export const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  var fileNameNew = `${name.replace(/-|\s/g, "-")}-${randomName.replace(/-|\s/g, "-")}${fileExtName}`;
  callback(null, fileNameNew.toLowerCase());
};


export const videosFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(mp4|avi|mov|webm|MP4|AVI|MOV|WEBM)$/)) {
    return callback(new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: [`only allow ${FileExtensionsEnum.Video}`],
      error: "Bad Request",
    }, HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};

export const imageFileValidate = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg|mp4|avi|mov|webm|MP4|AVI|MOV|WEBM|SAG|GPG|PNG|JPEG|GIF)$/)) {
    return callback(new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: [`only allow ${FileExtensionsEnum.Image}`],
      error: "Bad Request"
    }, HttpStatus.BAD_REQUEST), false);
  }
  callback(null, true);
};
