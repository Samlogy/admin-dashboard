import React, { useState } from "react";
import { Input, Flex,
    Box, Text, IconButton,
    Tag, TagLabel, TagCloseButton,
    } from "@chakra-ui/react"
import { MdAddToPhotos } from "react-icons/md"

import { View } from "../../Components";

const Features = ({ value, onChange }) => {
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState((value && value.length > 0) ? [...value] : []);

  const addFeature = () => {
    if (feature === "") return;
    // create a regular expression to reject what is not permitted
      setFeatures((prevState) => {
        if (prevState) {
          // onChange && onChange([...prevState, feature]);
          return [...prevState, feature];
        }
        // onChange && onChange([feature]);
        return [feature];
      });

    setFeature("");
  };
  const removeFeature = (featureIndex) => {
    // setFeatures((prevState) => prevState.filter((item, idx) => idx !== featureIndex));
      setFeatures((prevState) => { 
        return prevState.filter((item, idx) => idx !== featureIndex)
      })
  };

  return (
    <>
      <View if={features && features.length > 0} display="flex" flexDirection="row" flexWrap="wrap" mb=".5rem">
        { features.map((item, idx) => (
            <Flex flexDir="row" flexWrap="wrap" key={idx}>
              <Tag size="md" key={idx} borderRadius="full" bg="white" border="1px solid" borderColor="blue" m=".25rem"
                  color="blue.700" variant="solid">
                <TagLabel> {item} </TagLabel>
                <TagCloseButton onClick={() => removeFeature(idx)} />
              </Tag>
            </Flex>
          )) }
      </View>

      <View if={!features || features.length === 0}>
        <Text mb=".5rem" fontStyle="italic" textAlign="left"> Features list empty ! </Text>
      </View>

        <Flex mb="1rem">
          <Input type="text" placeholder="New Feature..."
              value={feature} onChange={(e) => setFeature(e.target.value)} />

          <IconButton colorScheme="blue" aria-label="add feature" ml=".2rem" icon={<MdAddToPhotos size="20" />} 
                      onClick={() => addFeature()} />
        </Flex>
    </>
  );
};



export default Features;