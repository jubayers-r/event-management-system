import { Response } from "express";

// 200 series
const okResponse = (res: Response, message: string, data?: any) => {
  res.status(200).json({
    success: true,
    message: message,
    data: data,
  });
};

const postSuccessful = (res: Response, resource: string, data?: any) => {
  res.status(201).json({
    success: true,
    message: `${resource} successfully`,
    data: data,
  });
};

// 400 series
const badRequest = (res: Response, message: string) => {
  res.status(400).json({
    success: false,
    message: message,
  });
};

const unauthorizedRequest = (res: Response, resource: string) => {
  res.status(401).json({
    success: false,
    message: `Invalid ${resource}`,
  });
};

const forbiddenRequest = (res: Response) => {
  res.status(403).json({
    success: false,
    message: "Forbidden Request. You are not allowed to access the data.",
  });
};

const conflictResponse = (res: Response, message: string) => {
  return res.status(409).json({
    success: false,
    message: message,
  });
};

const notFound = (res: Response, resource: string) => {
  res.status(404).json({
    success: false,
    message: `${resource} not found`,
  });
};

// 500
const serverError = (res: Response, err: any) => {
  console.log("SERVER ERROR", err.message);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};

export {
  postSuccessful,
  okResponse,
  unauthorizedRequest,
  forbiddenRequest,
  conflictResponse,
  notFound,
  badRequest,
  serverError,
};