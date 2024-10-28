import { Request, Response } from "express";

import { Users } from "../entities/Users";
import { CreateUserDto, UpdateUserDto } from "../dtos/user.dto";
import { AppDataSource } from "../database";

const getRepository = AppDataSource.getRepository.bind(AppDataSource);

export class UserController {
  async read(req: Request, res: Response) {
    const users = await getRepository(Users).find();

    res.json(users);
  }

  async readOne(req: Request<{ id: string }>, res: Response) {
    const userID = parseInt(req.params.id);

    const user = await getRepository(Users).findOneBy({
      id: userID,
    });

    res.json(user);
  }

  async create(req: Request, res: Response) {
    try {
      const userRepository = getRepository(Users);
      const userData: CreateUserDto = req.body;

      const user = userRepository.create(userData);
      await userRepository.save(user);

      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        msg: "Error creating user",
      });
    }
  }

  async update(req: Request<{ id: string }>, res: Response) {
    try {
      const userRepository = getRepository(Users);
      const userId = parseInt(req.params.id);

      const validUpdateKeys = ["firstName", "lastName", "age"];
      const updateData = req.body;
      const validUpdateData: UpdateUserDto = Object.fromEntries(
        Object.entries(updateData).filter(([key]) =>
          validUpdateKeys.includes(key)
        )
      );
      if (Object.keys(validUpdateData).length < 1) {
        res.status(400).json({ err: "Invalid update" });
        return;
      }

      await userRepository.update(userId, validUpdateData);
      const updatedUser = await userRepository.findOneBy({ id: userId });

      res.status(200).json({
        status: "success",
        data: updatedUser,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        msg: "Error updating user",
      });
    }
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    try {
      const userID = parseInt(req.params.id);
      const userRepository = getRepository(Users);

      await userRepository.delete(userID);

      res.json({
        status: "success",
        msg: "User deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        msg: "Error Deleting user",
      });
    }
  }
}
