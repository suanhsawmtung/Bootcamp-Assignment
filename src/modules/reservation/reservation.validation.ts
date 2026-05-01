import { body } from "express-validator";

export const reserveValidation = [
  body("ticketId").notEmpty().withMessage("Valid ticketId is required"),
  body("userId").notEmpty().withMessage("Valid userId is required"),
];

export const purchaseValidation = [
  body("ticketId").notEmpty().withMessage("Valid ticketId is required"),
  body("userId").notEmpty().withMessage("Valid userId is required"),
];
