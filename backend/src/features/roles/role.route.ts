import { Router } from "express";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { roleInputSchema, roleParamsSchema } from "./role.dto";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createRole, deleteRole, getRole, updateRole } from "./role.controller";

export const roleRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Role
 *   description: Role Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Admin"
 *         description:
 *           type: string
 *           example: "User with full system access"
 *       required:
 *         - name
 */

/**
 * @swagger
 * /role:
 *   post:
 *     summary: Create a new role
 *     tags: [Role]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Validation failed
 *       500:
 *         description: Role creation failed
 */
roleRouter.post(
  "/",
  requestValidateRequest({ body: roleInputSchema }),
  catchAsyncMiddleware(createRole, {
    message: "Role creation failed!",
    status: 500,
  })
);

/**
 * @swagger
 * /role/role/{id}:
 *   patch:
 *     summary: Update existing role
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Role'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Role update failed
 */
roleRouter.patch(
  "/role/:id",
  requestValidateRequest({ body: roleInputSchema, params: roleParamsSchema }),
  catchAsyncMiddleware(updateRole, {
    message: "Role Updation failed!",
    status: 500,
  })
);

/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Role]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Role deletion failed
 */
roleRouter.delete(
  "/:id",
  requestValidateRequest({ params: roleParamsSchema }),
  catchAsyncMiddleware(deleteRole, {
    message: "Role Delete failed!",
    status: 500,
  })
);

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Get all roles
 *     tags: [Role]
 *     responses:
 *       200:
 *         description: List of all roles
 *       500:
 *         description: Role fetch failed
 */
roleRouter.get(
  "/",
  catchAsyncMiddleware(getRole, {
    message: "role fetch failed!",
    status: 500,
  })
);
