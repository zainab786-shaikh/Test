import { inject } from "inversify";
import TYPE from "../ioc/types";
import { container } from "../ioc/container";

import { ILoginDetail } from "./0.model";
import { IServiceLoginDetail } from "./3.service.model";
import { IRepoLoginDetail } from "./5.repo.model";

export class ServiceLoginDetailImpl implements IServiceLoginDetail {
  private repoService!: IRepoLoginDetail;

  constructor() {
    this.repoService = container.get(TYPE.RepoLoginDetail);
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

  async create(inLoginDetailInfo: ILoginDetail): Promise<ILoginDetail | null> {
    const retObject = await this.repoService.create(inLoginDetailInfo);
    return retObject;
  }

  async update(
    inLoginDetailId: number,
    inLoginDetailInfo: ILoginDetail
  ): Promise<number> {
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
