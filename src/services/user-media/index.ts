class UserMediaService {
  getStream = async (constraints: MediaStreamConstraints): Promise<null | Error | MediaStream> => {
    if (!(process as any).browser) { return null; }
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (e) {
      throw new Error(e)
    }
  }
}

export const userMediaService = new UserMediaService();
