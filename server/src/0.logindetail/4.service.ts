import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { inject } from "inversify";
import TYPE from "../ioc/types";
import { container } from "../ioc/container";

import { ILoginDetail } from "./0.model";
import { IServiceLoginDetail } from "./3.service.model";
import { IRepoLoginDetail } from "./5.repo.model";

interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    role: string;
    referenceId: number;
  };
}

export class ServiceLoginDetailImpl implements IServiceLoginDetail {
  private repoService!: IRepoLoginDetail;
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.repoService = container.get(TYPE.RepoLoginDetail);
    this.jwtSecret = process.env.JWT_SECRET || "your-default-secret-change-in-production";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
  }

  async getAll(): Promise<ILoginDetail[] | null> {
    const retObject = await this.repoService.getAll();
    return retObject;
  }

  async get(inLoginDetailId: number): Promise<ILoginDetail | null> {
    const retObject = await this.repoService.getById(inLoginDetailId);
    return retObject;
  }

  async getByName(inLoginDetailUsername: string): Promise<ILoginDetail | null> {
    const retObject = await this.repoService.getByName(inLoginDetailUsername);
    return retObject;
  }

  /**
   * Validates user credentials with BCrypt password comparison
   * Returns user object with JWT token if successful
   */
  async validate(
    username: string,
    password: string
  ): Promise<ILoginDetail | null> {
    const user = await this.repoService.getByName(username);

    if (!user) {
      return null;
    }

    // Check if password is already hashed (starts with $2b$ for BCrypt)
    const isPasswordHashed = user.password.startsWith("$2b$") || user.password.startsWith("$2a$");

    let isPasswordValid = false;

    if (isPasswordHashed) {
      // Compare with BCrypt for hashed passwords
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // LEGACY SUPPORT: Direct comparison for plaintext (for backward compatibility during migration)
      // ⚠️ This should be removed after all passwords are hashed
      isPasswordValid = user.password === password;

      // Auto-migrate: If plaintext password matches, hash it immediately
      if (isPasswordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.repoService.update(user.Id!, { ...user, password: hashedPassword });
        console.log(`Auto-migrated password for user: ${username}`);
      }
    }

    return isPasswordValid ? user : null;
  }

  /**
   * Generates JWT token for authenticated user
   */
  generateToken(user: ILoginDetail): string {
    const payload = {
      userId: user.Id,
      name: user.name,
      role: user.role,
      referenceId: user.referenceId,
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }

  /**
   * Verifies JWT token and returns payload
   */
  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  async create(inLoginDetailInfo: ILoginDetail): Promise<ILoginDetail | null> {
    // Hash password before creating new user
    if (inLoginDetailInfo.password) {
      inLoginDetailInfo.password = await bcrypt.hash(inLoginDetailInfo.password, 10);
    }

    const retObject = await this.repoService.create(inLoginDetailInfo);
    return retObject;
  }

  async update(
    inLoginDetailId: number,
    inLoginDetailInfo: ILoginDetail
  ): Promise<number> {
    // If password is being updated, hash it
    if (inLoginDetailInfo.password && !inLoginDetailInfo.password.startsWith("$2b$")) {
      inLoginDetailInfo.password = await bcrypt.hash(inLoginDetailInfo.password, 10);
    }

    const retObject = await this.repoService.update(
      inLoginDetailId,
      inLoginDetailInfo
    );
    return retObject;
  }

  async delete(inLoginDetailId: number): Promise<number> {
    const retObject = await this.repoService.delete(inLoginDetailId);
    return retObject;
  }
}
