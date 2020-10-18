class UserMediaService {
  getStream = async (constraints: MediaStreamConstraints): Promise<Error | MediaStream> => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e) {
      throw new Error(e)
    }
  }
}

export const userMediaService = new UserMediaService();
