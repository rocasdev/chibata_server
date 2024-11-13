import {
  User,
  UserAttributes,
  UserCreationAttributes,
} from "../models/user.model";
import { Role } from "../models/role.model";
import "../models/relations";
import { sequelize } from "../db/db";
import bcrypt from "bcrypt";
import { BPT_SALT } from "../config/constants";
import { Sequelize } from "sequelize";
import ObjectID from "bson-objectid";
import { Organization } from "../models/organization.model";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants";

class UserService {
  constructor() {
    console.log("UserService instance created");
  }

  static async createUser(userData: UserCreationAttributes) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(ObjectID().toHexString(), "hex");
      userData.pass = await bcrypt.hash(userData.pass, BPT_SALT);
      const user = User.build({ ...userData, user_id: oid });
      const newUser = await user.save({ transaction: t });
      await t.commit();
      return newUser;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot create user:", err);
      throw new Error(`Error creating user: ${err.message}`);
    }
  }

  static async findAllUsers(page: number = 1, limit: number = 10) {
    try {
      const offset = (page - 1) * limit;
      const { count, rows: users } = await User.findAndCountAll({
        attributes: {
          include: [[Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"]],
          exclude: ["pass"],
        },
        include: [
          {
            model: Role,
            attributes: ["name", "path"],
          },
        ],
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      const totalPages = Math.ceil(count / limit);

      return { users, currentPage: page, totalPages, totalItems: count };
    } catch (err: any) {
      console.error("Cannot find all users:", err);
      throw new Error(`Error fetching all users: ${err.message}`);
    }
  }

  static async findUserById(id: string) {
    try {
      const oid = Buffer.from(id, "hex");
      const user = await User.findByPk(oid, {
        attributes: {
          include: [[Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"]],
          exclude: ["pass"],
        },
        include: {
          model: Role,
          attributes: ["name", "path"],
        },
      });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      return user;
    } catch (err: any) {
      console.error("Cannot find user by id:", err);
      throw new Error(`Error fetching user by ID: ${err.message}`);
    }
  }

  static async generatePasswordResetToken(userId: string) {
    try {
      const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "10m" });
      return token;
    } catch (err: any) {
      console.error("Cannot generate password reset token:", err);
      throw new Error(`Error generating password reset token: ${err.message}`);
    }
  }

  static async validatePasswordResetToken(token: string) {
    try {
      if (!token) return false;
      jwt.verify(token, JWT_SECRET); // Solo verifica el token
      return true;
    } catch (err: any) {
      console.error("Cannot validate password reset token:", err);
      return false; // Devuelve falso si el token es inválido o expirado
    }
  }

  static async resetPasswordByToken(token: string, newPassword: string) {
    try {
      const decodedToken: any = jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.userId;
      const oid = Buffer.from(userId, "hex");
      const user = await User.findByPk(oid);
      if (!user) {
        throw new Error(`User with id ${userId} not found or token not valid`);
      }

      const hashedPassword = await bcrypt.hash(newPassword, BPT_SALT);
      await user.update({ pass: hashedPassword });
      return user;
    } catch (err: any) {
      console.error("Cannot reset password by token:", err);
      throw new Error(`Error resetting password by token: ${err.message}`);
    }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({
        where: { email: email },
        attributes: {
          include: [[Sequelize.fn("HEX", Sequelize.col("user_id")), "user_id"]],
        },
        include: {
          model: Role,
          attributes: ["name", "path"],
        },
      });
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return user;
    } catch (err: any) {
      console.error("Cannot find user by email:", err);
      throw new Error(`Error fetching user by email: ${err.message}`);
    }
  }

  static async findUserOrganizations(id: string): Promise<Organization[]> {
    try {
      const oid = Buffer.from(id, "hex");
      const user: any = await User.findByPk(oid, {
        include: [
          {
            model: Organization,
          },
        ],
      });

      const organizations = user.Organizations.map((org: any) => {
        return {
          organization_id: org.organization_id.toString("hex"),
          name: org.name,
        };
      });

      console.log(organizations);
      return organizations;
    } catch (err: any) {
      console.error("Cannot find user organizations:", err);
      throw new Error(`Error fetching user organizations: ${err.message}`);
    }
  }

  static async updateUser(id: string, u: Partial<UserAttributes>) {
    const t = await sequelize.transaction();
    try {
      const oid = Buffer.from(id, "hex");
      const user = await User.findByPk(oid, { transaction: t });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      await user.update(u, { transaction: t });
      await t.commit();
      await user.reload({
        include: {
          model: Role,
          attributes: ["name", "path"],
        },
      });

      return user;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot update user:", err);
      throw new Error(`Error updating user: ${err.message}`);
    }
  }

  static async toggleUserState(id: string) {
    const t = await sequelize.transaction();
    const oid = Buffer.from(id, "hex");
    try {
      const user = await User.findByPk(oid, { transaction: t });
      if (!user) {
        throw new Error(`User with id ${id} not found`);
      }
      user.setDataValue("is_active", !user.getDataValue("is_active"));
      await user.save({ transaction: t });
      await t.commit();
      return user;
    } catch (err: any) {
      await t.rollback();
      console.error("Cannot toggle user state:", err);
      throw new Error(`Error toggling user state: ${err.message}`);
    }
  }

  static async countUsers() {
    try {
      const count = await User.count();
      return count;
    } catch (err: any) {
      console.error("Cannot count users:", err);
      throw new Error(`Error counting users: ${err.message}`);
    }
  }

  static async authenticate(email: string, password: string) {
    try {
      const user = await this.findUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.pass))) {
        return;
      }
      return user;
    } catch (err: any) {
      console.error("User Service | Cannot authenticate user:", err);
      throw new Error(
        `User Service | Error authenticating user: ${err.message}`
      );
    }
  }
}

export { UserService };
