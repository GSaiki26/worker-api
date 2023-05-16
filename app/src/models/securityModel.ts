// Libs
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

  public static isValidWorker(worker: types.ProtoCreateReq): boolean {
    if (!SecurityModel.isValidProperty(worker.cardId)) return false;
    if (!SecurityModel.isValidProperty(worker.firstName)) return false;
    if (!SecurityModel.isValidProperty(worker.lastName)) return false;
    if (!SecurityModel.isValidEmail(worker.email)) return false;

    return true;
  }

  public static workerToPublicWorker(worker: types.DbWorker): types.ProtoWorker {
    return {
      id: worker.id,
      cardId: worker.card_id,
      email: worker.email,
      firstName: worker.first_name,
      lastName: worker.last_name,
    }
  }
}

// Code
export default SecurityModel;
