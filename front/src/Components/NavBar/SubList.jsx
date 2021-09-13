import React from "react";
import { Link,
  List, ListItem, ListIcon,
  useColorModeValue,
} from "@chakra-ui/react"

import { THEMES } from "../../utils/constants"

const SubList = (props) => {

    const data = props.data;

    const bgClrHover = useColorModeValue(THEMES.light.bgHover, THEMES.dark.bgHover);
    const bgClr = useColorModeValue(THEMES.light.bg, THEMES.dark.bg);

    return  (
            <List ml="1.25rem">
              { data && data.map((el, idx) => 
                <Link href={el.url} style={{textDecoration: "none"}}>
                    <ListItem p=".5rem" borderRadius="md" bg={bgClr} 
                            _hover={{ bg: bgClrHover, fontWeight: "medium"}}>
                        <ListIcon as={el.icon} color="blue.500" size="20" />
                        {el.label}
                    </ListItem>
                </Link>)
              }
            </List>
          )
}

export default SubList;