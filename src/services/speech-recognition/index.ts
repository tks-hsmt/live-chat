import { isSSR } from "../../utils";

class WebSpeechRecognition {

  private rec: null | SpeechRecognition = null;

  private handleSpeech = (message: string) => { };

  private endSpeech = () => { };

  constructor() {
    // SSR起動時には何もしない
    if (isSSR()) { return; }
    const IWindow: any = window;
    const BrowserSpeechRecognition =
      typeof IWindow !== 'undefined'
      && (IWindow.SpeechRecognition
        || IWindow.webkitSpeechRecognition
        || IWindow.mozSpeechRecognition
        || IWindow.msSpeechRecognition
        || IWindow.oSpeechRecognition)
    this.rec = new BrowserSpeechRecognition();
  }

  init = (handleSpeech: (message: string) => void, endSpeech: () => void) => {
    this.handleSpeech = handleSpeech;
    this.endSpeech = endSpeech;
  }

  start = () => {
    if (!this.rec) { return; }
    console.log('Speech Recognition start');
    this.rec.lang = 'ja';
    this.rec.addEventListener('result', this.resultListener);
    this.rec.addEventListener('end', this.endListener);
    this.rec.start();
  }

  stop = () => {
    if (!this.rec) { return; }
    console.log('Speech Recognition stop');
    this.rec.stop();
    this.rec.removeEventListener('result', this.resultListener);
    this.rec.removeEventListener('end', this.endListener);
    this.endSpeech();
  }

  private resultListener = ({ results }: SpeechRecognitionEvent) => {
    const message = results?.[0]?.[0].transcript;
    console.log(`message is ${message}`);
    if (!message) { return; }
    this.handleSpeech(message);
  };

  private endListener = () => {
    if (!this.rec) { return; }
    console.log('Speech Recognition end');
    this.rec.start();
  };
}

export const speechService = new WebSpeechRecognition();
