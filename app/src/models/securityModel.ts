// Libs
import ProtoMessages from "../proto/worker_pb";

import * as types from "../types/types";

// Class
class SecurityModel {
  public static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return false;
    return regex.test(email);
  }

  public static isValidProperty(property: string): boolean {
    if (!property) return false;
    return property.length > 2;
  }

  public static isValidWorker(worker: ProtoMessages.CreateReq): boolean {
    if (!SecurityModel.isValidProperty(worker.getCardid())) return false;
    if (!SecurityModel.isValidProperty(worker.getFirstname())) return false;
    if (!SecurityModel.isValidProperty(worker.getLastname())) return false;
    if (!SecurityModel.isValidEmail(worker.getEmail())) return false;

    return true;
  }

  public static workerToPublicWorker(
    worker: types.DbWorker
  ): ProtoMessages.Worker {
    return new ProtoMessages.Worker()
      .setId(worker.id)
      .setCardid(worker.card_id)
      .setEmail(worker.email)
      .setFirstname(worker.first_name)
      .setLastname(worker.last_name);
  }
}

// Code
export default SecurityModel;
