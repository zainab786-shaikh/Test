import { inject } from "inversify";
import TYPE from "../ioc/types";
import { container } from "../ioc/container";

import { ILesson } from "./0.model";
import { IServiceLesson } from "./3.service.model";
import { IRepoLesson } from "./5.repo.model";

export class ServiceLessonImpl implements IServiceLesson {
  private repoService!: IRepoLesson;

  constructor() {
    this.repoService = container.get(TYPE.RepoLesson);
  }

  async getAll(inSubjectId: number): Promise<ILesson[] | null> {
    const retObject = await this.repoService.getAll(inSubjectId);
    return retObject;
  }

  async get(inLessonId: number): Promise<ILesson | null> {
    const retObject = await this.repoService.getById(inLessonId);
    return retObject;
  }

  async getByPath(inPath: string): Promise<ILesson | null> {
    const retObject = await this.repoService.getByPath(inPath);
    return retObject;
  }

  async create(inLessonInfo: Partial<ILesson>): Promise<ILesson | null> {
    const retObject = await this.repoService.create(inLessonInfo);
    return retObject;
  }

  async update(inLessonId: number, inLessonInfo: ILesson): Promise<number> {
    const retObject = await this.repoService.update(inLessonId, inLessonInfo);
    return retObject;
  }

  async updateByPath(inPath: string, inLessonInfo: ILesson): Promise<number> {
    const retObject = await this.repoService.updateByPath(inPath, inLessonInfo);
    return retObject;
  }

  async delete(inLessonId: number): Promise<number> {
    const retObject = await this.repoService.delete(inLessonId);
    return retObject;
  }

  async deleteByPath(inPath: string): Promise<number> {
    const retObject = await this.repoService.deleteByPath(inPath);
    return retObject;
  }
}
