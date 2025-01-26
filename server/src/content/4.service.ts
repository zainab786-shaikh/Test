
  import { inject } from "inversify";
  import TYPE from "../ioc/types";
  import { container } from "../ioc/container";

  import { IContent } from "./0.model";
  import { IServiceContent } from "./3.service.model";
  import { IRepoContent } from "./5.repo.model";

  
  export class ServiceContentImpl implements IServiceContent {
    private repoService!: IRepoContent;

    constructor() {
      this.repoService = container.get(TYPE.RepoContent);
    }

    async getAll(inSubjectId: number): Promise<IContent[] | null> {
      const retObject = await this.repoService.getAll(inSubjectId);
      return retObject;
    }
      
    async get(inContentId: number): Promise<IContent | null> {
      const retObject = await this.repoService.getById(inContentId);
      return retObject;
    }

    async create(inContentInfo: IContent): Promise<IContent | null> {
      const retObject = await this.repoService.create(inContentInfo);
      return retObject;
    }

    async update(inContentId: number, inContentInfo: IContent): Promise<number> {
      const retObject = await this.repoService.update(inContentId, inContentInfo);
      return retObject;
    }

    async delete(inContentId: number): Promise<number> {
      const retObject = await this.repoService.delete(inContentId);
      return retObject;
    }
  }
  