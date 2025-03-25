import { inject } from "inversify";
import TYPE from "../ioc/types";
import { container } from "../ioc/container";

import { ITeacher } from "./0.model";
import { IServiceTeacher } from "./3.service.model";
import { IRepoTeacher } from "./5.repo.model";

export class ServiceTeacherImpl implements IServiceTeacher {
  private repoService!: IRepoTeacher;

  constructor() {
    this.repoService = container.get(TYPE.RepoTeacher);
  }

  async getAll(
    inSchoolId: number,
    inStandardId: number
  ): Promise<ITeacher[] | null> {
    const retObject = await this.repoService.getAll(inSchoolId, inStandardId);
    return retObject;
  }

  async getByAdhaar(inAdhaar: string): Promise<ITeacher | null> {
    const retObject = await this.repoService.getByAdhaar(inAdhaar);
    return retObject;
  }

  async get(inTeacherId: number): Promise<ITeacher | null> {
    const retObject = await this.repoService.getById(inTeacherId);
    return retObject;
  }

  async create(inTeacherInfo: ITeacher): Promise<ITeacher | null> {
    const retObject = await this.repoService.create(inTeacherInfo);
    return retObject;
  }

  async update(inTeacherId: number, inTeacherInfo: ITeacher): Promise<number> {
    const retObject = await this.repoService.update(inTeacherId, inTeacherInfo);
    return retObject;
  }

  async delete(inTeacherId: number): Promise<number> {
    const retObject = await this.repoService.delete(inTeacherId);
    return retObject;
  }
}
