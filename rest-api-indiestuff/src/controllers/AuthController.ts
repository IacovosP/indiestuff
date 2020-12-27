import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { User } from "../entity/User";
import config from "../config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { email, password } = req.body.user;
    if (!(email && password)) {
      res.status(400).send();
    }

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (error) {
      res.status(401).send("Loging failed");
    }

    //Check if encrypted password match
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send("Loging checkIfUnencryptedPasswordIsValid failed");
      return;
    }

    //Sing JWT, valid for 1 hour
    const tokenResponse = {
      accessToken: jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }),
      refreshToken: jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET_KEY),
      username: user.username
    }

    //Send the jwt in the response
    res.send(tokenResponse);
  };

  static refreshToken = async (req: Request, res: Response) => {
    let { refresh_token } = req.body.tokenRequest;

    console.log("refresh token: "  + refresh_token);
    const jwtPayload = <any>jwt.verify(refresh_token, process.env.JWT_SECRET_KEY);

    //Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(jwtPayload.userId);
    } catch (error) {
      res.status(401).send("Refresh failed - couldn't find user");
    }

    //Sing JWT, valid for 1 hour
    const tokenResponse = {
      accessToken: jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }),
      username: user.username
    }

    //Send the jwt in the response
    res.send(tokenResponse);
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send("changePassword failed");
    }

    //Check if old password matchs
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send("checkIfUnencryptedPasswordIsValid failed");
      return;
    }

    //Validate de model (password lenght)
    user.password = newPassword;
    const errors = await validate(user);
    if (errors.length > 0) {
      res.status(400).send(errors);
      return;
    }
    //Hash the new password and save
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}
export default AuthController;
