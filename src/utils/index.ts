export const isSSR = () => {
  return !(process as any).browser;
}
