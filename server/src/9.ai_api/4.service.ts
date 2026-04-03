import fetch from "node-fetch";
import { injectable } from "inversify";
import { IServiceAI } from "./3.service.model";
import { IAICompareRequest, IAICompareResponse } from "./0.model";

@injectable()
export class ServiceAI implements IServiceAI {
  private ai_apiUrl = "http://localhost:4000";

  async compare(data: IAICompareRequest): Promise<IAICompareResponse> {
    const res = await fetch(`${this.ai_apiUrl}/compare`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text1: data.answer,
        text2: data.user_answer,
      }),
    });

    if (!res.ok) {
      throw new Error(`AI API error: ${res.status}`);
    }

    const json = (await res.json()) as IAICompareResponse; // FIX
    return json;
  }
}