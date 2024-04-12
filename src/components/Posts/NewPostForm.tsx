import { Alert, AlertIcon, Flex, Icon, Switch, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import TabItem from "./TabItem";
import TextInputs from "./PostForm/TextInputs";
import ImageUpload from "./PostForm/ImageUpload";
import { Post } from "@/atoms/postsAtom";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { firestore, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { User } from "firebase/auth";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import useSelectFile from "@/hooks/useSelectFile";

type NewPostFormProps = {
  user: User;
  communityImageURL?: string;
};

const formTabs: TabItems[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
];

export type TabItems = {
  title: string;
  icon: typeof Icon.arguments;
};

export const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
    aititle: "",
  });
  const [savedAIGeneratedImageURL, setSavedAIGeneratedImageURL] =
    useState<string>("");
  const [aiGeneratedReady, setAiGeneratedReady] = useState(false);

  const handleAiGenerated = (generated: boolean) => {
    setAiGeneratedReady(generated);
  };

  const [useHuggingFaceModel, setUseHuggingFaceModel] = useState(false);

  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [aiGeneratedImageURL, setAiGeneratedImageURL] = useState<string>("");
  const [aiGenerated, setAiGenerated] = useState(false);
  const handleAiGeneratedImageURL = (url: string) => {
    setAiGeneratedImageURL(url);
  };

  const handleCreatePost = async () => {
    const { communityID } = router.query;

    if (!communityID) {
      console.error("Community ID is undefined");
      return;
    }
    const newPost: Post = {
      communityId: communityID as string,
      communityImageURL: communityImageURL || "",
      creatorId: user.uid,
      creatorDisplayName: user.email!.split("@")[0],
      aititle: textInputs.aititle,
      title: textInputs.title,
      body: textInputs.body.replace(/\n/g, "<NEWLINE>"),
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
      aiGenerated: useHuggingFaceModel,
    };

    setLoading(true);
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
      } else if (aiGenerated) {
        // I want to check if the image is executed on the handleGenerateAI function on ImageUpload component and want to move ahead if the handleGenerateAI returns true.
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
          inputs: newPost.aititle,
        });
        const dataUrl = `data:image/jpeg;base64,${Buffer.from(
          imageData
        ).toString("base64")}`;
        const generatedImageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(generatedImageRef, dataUrl, "data_url");
        const generatedDownloadURL = await getDownloadURL(generatedImageRef);

        await updateDoc(postDocRef, {
          imageURL: generatedDownloadURL,
        });
      }

      router.back();
    } catch (error: any) {
      console.log("handleCreatePost error", error.message);
      setError(true);
    }
    setLoading(false);

    // router.back();
  };

  const onTextChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { name, value },
    } = event;
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item) => (
          <TabItem
            key={item.title}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            handleCreatePost={handleCreatePost}
            onChange={onTextChange}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            onSelectImage={onSelectFile}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            aititle={textInputs.aititle}
            onAiGeneratedImageURL={setSavedAIGeneratedImageURL}
            onAiGenerated={(generated) => setAiGenerated(generated)} // Callback function
          />
        )}
      </Flex>
      {error && (
        <Alert status="error">
          <AlertIcon />
          <Text>Error creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};
