import { inject } from "inversify";
import TYPE from "../ioc/types";
import { container } from "../ioc/container";

import { IStandardSubject } from "./0.model";
import { IServiceStandardSubject } from "./3.service.model";
import { IRepoStandardSubject } from "./5.repo.model";

export class ServiceStandardSubjectImpl implements IServiceStandardSubject {
  private repoService!: IRepoStandardSubject;

  constructor() {
    this.repoService = container.get(TYPE.RepoStandardSubject);
  }

  async getAll(inStandardId: number): Promise<IStandardSubject[] | null> {
    const retObject = await this.repoService.getAll(inStandardId);
    return retObject;
  }

  async get(inStandardSubjectId: number): Promise<IStandardSubject | null> {
    const retObject = await this.repoService.getById(inStandardSubjectId);
    return retObject;
  }

  async create(
    inStandardSubjectInfo: IStandardSubject
  ): Promise<IStandardSubject | null> {
    const retObject = await this.repoService.create(inStandardSubjectInfo);
    return retObject;
  }

  async update(
    inStandardSubjectId: number,
    inStandardSubjectInfo: IStandardSubject
  ): Promise<number> {
    const retObject = await this.repoService.update(
      inStandardSubjectId,
      inStandardSubjectInfo
    );
    return retObject;
  }

  async delete(inStandardSubjectId: number): Promise<number> {
    const retObject = await this.repoService.delete(inStandardSubjectId);
    return retObject;
  }
}
