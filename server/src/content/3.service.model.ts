
  import { IContent } from "./0.model";

  export interface IServiceContent {
    getAll(inSubjectId: number): Promise<IContent[] | null>;
    get(inContentId: number): Promise<IContent | null>;
    create(inContentInfo: IContent): Promise<IContent | null>;
    update(inContentId: number, inContentInfo: IContent): Promise<number>;
    delete(inContentId: number): Promise<number>;
  }
  