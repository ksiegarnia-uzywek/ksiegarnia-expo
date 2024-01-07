import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRoutes, RootStackParamList } from "./routing/routing.model";
import CameraScreen from "./screens/Camera/CameraScreen";
import Home from "./screens/Home";
import Response from "./screens/Response";
import Scanner from "./screens/Scanner/Scanner";

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  // TODO: move routes to Router.tsx
  return (
    <Stack.Navigator>
      <Stack.Screen name={AppRoutes.HOME} component={Home} />
      <Stack.Screen name={AppRoutes.SCANNER} component={Scanner} />
      <Stack.Screen name={AppRoutes.RESPONSE} component={Response} />
      <Stack.Screen name={AppRoutes.CAMERASCREEN} component={CameraScreen} />
    </Stack.Navigator>
  );
}

export default () => {
  return (
    <NavigationContainer>
      <App />
    </NavigationContainer>
  );
};
