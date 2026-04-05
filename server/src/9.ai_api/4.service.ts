import axios from "axios";
import { injectable } from "inversify";
import { IServiceAI } from "./3.service.model";
import { IAICompareRequest, IAICompareResponse } from "./0.model";

@injectable()
export class ServiceAI implements IServiceAI {
  private ai_apiUrl = "http://localhost:4000";

  async compare(data: IAICompareRequest): Promise<IAICompareResponse> {
    try {
      const res = await axios.post(`${this.ai_apiUrl}/compare`, {
        text1: data.answer,
        text2: data.user_answer,
      });

      return res.data as IAICompareResponse;
    } catch (error: any) {
      throw new Error(`AI API error: ${error.message}`);
    }
  }
}