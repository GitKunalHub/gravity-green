import { firestore, storage } from "@/firebase/clientApp";
import { Button, Flex, Image, Input, Skeleton, Stack } from "@chakra-ui/react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import React, { useRef, useState } from "react";

type ImageUploadProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (value: string) => void;
  setSelectedFile: (value: string) => void;
  aititle: string;
  onAiGeneratedImageURL: React.Dispatch<React.SetStateAction<string>>;
  onAiGenerated: (generated: boolean) => void; // Callback function
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  onSelectImage,
  setSelectedFile,
  setSelectedTab,
  aititle,
  onAiGeneratedImageURL,
  onAiGenerated,
}) => {
  const [loading, setLoading] = useState(false);
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const [showAIGeneratedImage, setShowAIGeneratedImage] = useState(false);
  const [aiGeneratedImageURL, setAIGeneratedImageURL] = useState<string>();
  const [savedAIGeneratedImageURL, setSavedAIGeneratedImageURL] =
    useState<React.SetStateAction<string>>("");

  const handleBackToPost = () => {
    if (showAIGeneratedImage && aiGeneratedImageURL) {
      setSavedAIGeneratedImageURL(aiGeneratedImageURL);
    }
    if (onAiGeneratedImageURL) {
      onAiGeneratedImageURL(savedAIGeneratedImageURL);
    }
    setSelectedTab("Post");
  };

  const handleGenerateAI = async () => {
    // For demonstration purposes, let's assume aiGeneratedImageURL is the Firebase path to the generated image
    setLoading(true);
    const query = async (data: any) => {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_TOKEN}`,
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.arrayBuffer();
      return Buffer.from(result);
    };

    const imageData = await query({
      inputs: aititle,
    });
    const dataUrl = `data:image/jpeg;base64,${Buffer.from(imageData).toString(
      "base64"
    )}`;
    const aiGeneratedImageURL = dataUrl;
    setAIGeneratedImageURL(aiGeneratedImageURL);
    setShowAIGeneratedImage(true);
    onAiGenerated(true);
    setLoading(false);
  };

  return (
    <Flex direction="column" justify="center" align="center" width="100%">
      {showAIGeneratedImage && aiGeneratedImageURL ? (
        <>
          <Image src={aiGeneratedImageURL} maxWidth="400px" maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={handleBackToPost}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => {
                setAIGeneratedImageURL("");
                onAiGenerated(false);
              }}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : savedAIGeneratedImageURL ? (
        <>
          <Image src={aiGeneratedImageURL} maxWidth="400px" maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={handleBackToPost}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => {
                setAIGeneratedImageURL("");
                onAiGenerated(false);
              }}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : selectedFile ? (
        <>
          <Image src={selectedFile} maxWidth="400px" maxHeight="400px" />
          <Stack direction="row" mt={4}>
            <Button height="28px" onClick={() => setSelectedTab("Post")}>
              Back to Post
            </Button>
            <Button
              variant="outline"
              height="28px"
              onClick={() => setSelectedFile("")}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <>
          {loading ? (
            <Skeleton height="400px" width="400px" />
          ) : (
            <>
              {" "}
              <Flex
                justify="center"
                align="center"
                p={20}
                border="1px dashed"
                borderColor="gray.200"
                width="100%"
                borderRadius={4}
              >
                <Button
                  variant="outline"
                  height="28px"
                  onClick={() => selectedFileRef.current?.click()}
                >
                  Upload
                </Button>
                <Button
                  height="28px"
                  onClick={handleGenerateAI}
                  disabled={showAIGeneratedImage}
                >
                  AI-Generated
                </Button>
                <input
                  ref={selectedFileRef}
                  type="file"
                  onChange={onSelectImage}
                  hidden
                />
              </Flex>
            </>
          )}
        </>
      )}
    </Flex>
  );
};
export default ImageUpload;
