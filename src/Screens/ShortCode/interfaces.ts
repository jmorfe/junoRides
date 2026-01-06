export interface initBootInterface {
  auth: any,
  themeToggle: boolean,
  themeColor: boolean,
  deepLinkUrl: string
  currencies:object
  themeColors:object
  appStyle:object
  appData:object
}
export interface homeDataInterface {
  appMainData:object
  }
export interface IRootState {
  initBoot: initBootInterface;
  auth: userDataInterface;
  home:homeDataInterface
}

export interface userDataInterface {
  auth_token: string;
  userData: object;
}

