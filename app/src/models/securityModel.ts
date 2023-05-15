// Libs
import * as WorkerTypes from "../types/workerTypes";

// Class
class SecurityModel {
  public static isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  public static isValidProperty(property: string): boolean {
    return property.length > 2;
  }

  public static isValidWorker(worker: WorkerTypes.CreateReq): boolean {
    if (!worker.cardId) return false;
    if (!worker.firstName) return false;
    if (!worker.lastName) return false;
    if (!worker.email) return false;

    return true;
  }
}

// Code
export default SecurityModel;
