// 3.service.model.ts
import { IAICompareRequest, IAICompareResponse } from "./0.model";

export interface IServiceAI {
  compare(data: IAICompareRequest): Promise<IAICompareResponse>;
}