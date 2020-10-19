import { isSSR } from "../../utils";

class UserMediaService {
  getStream = async (constraints: MediaStreamConstraints): Promise<null | Error | MediaStream> => {
    if (isSSR()) { return null; }
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e) {
      throw new Error(e)
    }
  }
}

export const userMediaService = new UserMediaService();
