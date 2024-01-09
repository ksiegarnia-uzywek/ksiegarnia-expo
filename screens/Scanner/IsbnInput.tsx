// import React, { Dispatch } from "react";
// import { Button, StyleSheet, TextInput, View } from "react-native";
// import handleBarCodeScanned, {
//   onCallGPTResponse,
// } from "../../utils/handleBarCodeScanned";

// interface Props {
//   isbn: string;
//   setIsbn: Dispatch<React.SetStateAction<string>>;
//   setScanned: Dispatch<React.SetStateAction<boolean>>;
//   setIsLoading: Dispatch<React.SetStateAction<boolean>>;
//   onSuccess: (response: onCallGPTResponse) => void;
//   onError: (error: Error) => void;
// }

// const IsbnInput: React.FC<Props> = ({
//   isbn,
//   setIsbn,
//   setScanned,
//   setIsLoading,
//   onSuccess,
//   onError,
// }) => {
//   const handleSubmit = () => {
//     if (isbn.trim()) {
//       setIsLoading(true);
//       handleBarCodeScanned({
//         isbn,
//         setIsbn,
//         setScanned,
//         onSuccess: (result) => {
//           setIsLoading(false);
//           onSuccess(result);
//         },
//         onError: (error) => {
//           setIsLoading(false);
//           onError(error);
//         },
//       });
//     } else {
//       alert("Please enter a valid ISBN");
//     }
//   };

//   return (
//     <View>
//       <TextInput
//         style={styles.input}
//         onChangeText={setIsbn}
//         value={isbn}
//         placeholder="Enter ISBN"
//         keyboardType="numeric"
//       />
//       <Button title="Submit" color={"#000"} onPress={handleSubmit} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     height: 40,
//     margin: 12,
//     borderWidth: 1,
//     padding: 10,
//   },
// });

// export default IsbnInput;
