import { Community } from "@/atoms/communitiesAtom";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { CgCommunity } from "react-icons/cg";
import { FaReddit } from "react-icons/fa6";
import { RiCommunityLine } from "react-icons/ri";
import { TbBuildingCommunity } from "react-icons/tb";

type HeaderProps = {
  communityData: Community;
};

const Header: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, onJoinOrLeaveCommunity, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.mySnippets.find(
    (item) => item.communityID === communityData.id
  );

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="green.400" />
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue.currentCommunity?.imageURL ? (
            <Image
              borderRadius="full"
              boxSize="66px"
              alt="Community Image"
              position="relative"
              top={-3}
              color="blue.500"
              border="4px solid white"
              src={communityStateValue.currentCommunity.imageURL}
            />
          ) : (
            <Icon
              as={RiCommunityLine}
              fontSize={64}
              position="relative"
              top={-5}
              color="green.500"
              border="4px solid white"
              borderRadius="full"
            ></Icon>
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="16pt">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="10pt" color="gray.400">
                g/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              onClick={() => onJoinOrLeaveCommunity(communityData, isJoined)}
              isLoading={loading}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Header;
