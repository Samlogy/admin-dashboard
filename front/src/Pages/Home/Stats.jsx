import React from 'react'
import { 
    Stat, StatLabel, StatNumber, StatHelpText, StatArrow, StatGroup, 
    useColorModeValue
    } from "@chakra-ui/react"

import { THEMES } from "../../utils/constants"

function Stats({ data }) {

    const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);

  return (
    <StatGroup display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-evenly" my="1rem">
      { data.map((el, idx) => 
          <Stat border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md"
                w="15rem" m="1rem" p="1rem" shadow="md"  _hover={{bg: bgClrHover}}>
            <StatLabel fontSize="1.1rem"> {el.label} </StatLabel>
            <StatNumber> {el.number} </StatNumber>
            <StatHelpText>
              <StatArrow type={el.arrowType} />
              {el.percent}
            </StatHelpText>
          </Stat>
        )
      }
  </StatGroup>
  );
}

export default Stats
