import React, { useState } from "react";
import { Input, 
    Box, Text, IconButton,
    Tag, TagLabel, TagCloseButton,
    } from "@chakra-ui/react"
import { MdAddToPhotos } from "react-icons/md"

const Features = (props) => {
  const { value, onChange } = props;

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
  const displayFeatures = () => {
    return features.map((item, idx) => (
      <Box className="feature-item" key={idx}>
        <Tag size="md" key={idx} borderRadius="full" variant="solid" mr=".2rem" mb=".25rem"
            textColor="blue.700" bg="white" border="1px" borderColor="blue">
          <TagLabel> {item} </TagLabel>
          <TagCloseButton onClick={() => removeFeature(idx)}  />
        </Tag>
      </Box>
    ));
  };

  return (
    <>
      { features && features.length > 0 ? 
        <Box display="flex" flexDirection="row" flexWrap="wrap" mb=".5rem">
            { displayFeatures() }
        </Box> : <Text mb=".5rem" fontStyle="italic" textAlign="left"> features list empty ! </Text>
      }
        <Box display="flex" flexDirection="row" mb="1rem">
          <Input type="text" placeholder="New Feature..."
              value={feature} onChange={(e) => setFeature(e.target.value)} />

          <IconButton colorScheme="blue" aria-label="add feature" ml=".2rem" icon={<MdAddToPhotos size="20" />} 
                      onClick={() => addFeature()} />
        </Box>
    </>
  );
};

export default Features;