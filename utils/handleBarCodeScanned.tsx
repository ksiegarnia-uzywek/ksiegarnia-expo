import { Dispatch } from "react";

export interface onCallGPTResponse {
  response: string;
  data: { bookInfo: any; prices: any };
}

async function onCallGPT(isbn: string): Promise<onCallGPTResponse> {
  const functionUrl =
    "https://us-central1-ksiegarniauzywek.cloudfunctions.net/onCallGPT";

  try {
    const response = await fetch(functionUrl, {
      method: "POST",
      body: JSON.stringify({ data: { isbn: isbn } }),
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();
    console.log(result.result);
    return result.result as onCallGPTResponse;
  } catch (error) {
    console.error("Error calling onCallGPT: ", error);
    throw error;
  }
}

interface HandleBarCodeScannedProps {
  isbn: string;
  setIsbn: Dispatch<React.SetStateAction<string>>;
  setScanned: Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (response: onCallGPTResponse) => void;
  onError: (error: Error) => void;
}

const handleBarCodeScanned = async ({
  isbn,
  setIsbn,
  setScanned,
  onSuccess,
  onError,
}: HandleBarCodeScannedProps) => {
  setScanned(true);
  setIsbn(isbn);

  try {
    const result = await onCallGPT(isbn);
    onSuccess(result);
  } catch (error) {
    onError(error as Error);
  }
};

export default handleBarCodeScanned;
