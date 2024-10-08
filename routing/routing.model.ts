import { onCallGPTResponse } from "../utils/handleBarCodeScanned";

export enum AppRoutes {
  HOME = "Home",
  // SCANNER = "Scanner",
  RESPONSE = "Response",
  CAMERASCREEN = "CameraScreen",
}

export type RootStackParamList = {
  Home: undefined;
  // Scanner: undefined;
  Response: { response: onCallGPTResponse };
  CameraScreen: undefined;
};
