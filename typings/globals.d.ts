declare interface Window {}

declare module "*.css" {
  const styles: any;
  export = styles;
}
