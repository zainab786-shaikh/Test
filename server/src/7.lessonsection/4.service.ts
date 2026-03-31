import { inject } from "inversify";
import TYPE from "../ioc/types";
import { container } from "../ioc/container";

import { ILessonSection } from "./0.model";
import { IServiceLessonSection } from "./3.service.model";
import { IRepoLessonSection } from "./5.repo.model";

export class ServiceLessonSectionImpl implements IServiceLessonSection {
  private repoService!: IRepoLessonSection;

  constructor() {
    this.repoService = container.get(TYPE.RepoLessonSection);
  }

  async getAll(
    inSubjectId: number,
    inLessonId: number
  ): Promise<ILessonSection[] | null> {
    const retObject = await this.repoService.getAll(inSubjectId, inLessonId);
    return retObject;
  }

  async get(inLessonSectionId: number): Promise<ILessonSection | null> {
    const retObject = await this.repoService.getById(inLessonSectionId);
    return retObject;
  }
  async getByPath(inLessonSectionPath: string): Promise<ILessonSection | null> {
    const retObject = await this.repoService.getByPath(inLessonSectionPath);
    return retObject;
  }

  async create(
    inLessonSection: Partial<ILessonSection>
  ): Promise<ILessonSection | null> {
    const retObject = await this.repoService.create(inLessonSection);
    return retObject;
  }

  async update(
    inLessonSectionId: number,
    inLessonSectionInfo: ILessonSection
  ): Promise<number> {
    const retObject = await this.repoService.update(
      inLessonSectionId,
      inLessonSectionInfo
    );
    return retObject;
  }

  async updateByPath(
    inLessonSectionPath: string,
    inLessonSectionInfo: ILessonSection
  ): Promise<number> {
    const retObject = await this.repoService.updateByPath(
      inLessonSectionPath,
      inLessonSectionInfo
    );
    return retObject;
  }

  async delete(inLessonSectionId: number): Promise<number> {
    const retObject = await this.repoService.delete(inLessonSectionId);
    return retObject;
  }

  async deleteByPath(inLessonSectionPath: string): Promise<number> {
    const retObject = await this.repoService.deleteByPath(inLessonSectionPath);
    return retObject;
  }
}
