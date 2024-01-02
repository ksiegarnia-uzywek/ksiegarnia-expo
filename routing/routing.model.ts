import { onCallGPTResponse } from "../utils/handleBarCodeScanned";

export enum AppRoutes {
  HOME = "Home",
  SCANNER = "Scanner",
  RESPONSE = "Response",
}

export type RootStackParamList = {
  Home: undefined;
  Scanner: undefined;
  Response: { response: onCallGPTResponse };
};
