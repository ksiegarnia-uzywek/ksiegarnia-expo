// export interface onCallGPTResponse {
//   response: string;
// }

// async function onCallGPT(imageUrl: string): Promise<onCallGPTResponse> {
//   const functionUrl = "url funkcji";

//   try {
//     const response = await fetch(functionUrl, {
//       method: "POST",
//       body: JSON.stringify({ data: { imageUrl: imageUrl } }),
//       headers: { "Content-Type": "application/json" },
//     });
//     const result = await response.json();
//     console.log(result.result);
//     return result.result as onCallGPTResponse;
//   } catch (error) {
//     console.error("Error calling onCallGPT: ", error);
//     throw error;
//   }
// }

// interface handleUploadImageProps {
//   image: string;
//   onSuccess: (response: onCallGPTResponse) => void;
//   onError: (error: Error) => void;
// }

// const handleUploadImage = async ({
//   image,
//   onSuccess,
//   onError,
// }: handleUploadImageProps) => {
//   try {
//     const result = await onCallGPT(image);
//     onSuccess(result);
//   } catch (error) {
//     onError(error as Error);
//   }
// };

// export default handleUploadImage;
