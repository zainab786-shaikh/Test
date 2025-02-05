import { inject } from "inversify";
import TYPE from "../ioc/types";
import { container } from "../ioc/container";

import { IProgress } from "./0.model";
import { IServiceProgress } from "./3.service.model";
import { IRepoProgress } from "./5.repo.model";

export class ServiceProgressImpl implements IServiceProgress {
  private repoService!: IRepoProgress;

  constructor() {
    this.repoService = container.get(TYPE.RepoProgress);
  }

  async getAll(
    inSchoolId: number,
    inStandardId: number,
    inStudentId: number
  ): Promise<IProgress[] | null> {
    const retObject = await this.repoService.getAll(
      inSchoolId,
      inStandardId,
      inStudentId
    );
    return retObject;
  }

  async get(inProgressId: number): Promise<IProgress | null> {
    const retObject = await this.repoService.getById(inProgressId);
    return retObject;
  }

  async create(inProgressInfo: IProgress): Promise<IProgress | null> {
    const retObject = await this.repoService.create(inProgressInfo);
    return retObject;
  }

  async update(
    inProgressId: number,
    inProgressInfo: IProgress
  ): Promise<number> {
    const retObject = await this.repoService.update(
      inProgressId,
      inProgressInfo
    );
    return retObject;
  }

  async delete(inProgressId: number): Promise<number> {
    const retObject = await this.repoService.delete(inProgressId);
    return retObject;
  }
}
