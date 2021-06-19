import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Input, Select, Checkbox, Image,
  Spinner,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td,
  useToast, useDisclosure,
  Flex, Stack, Box, Text, Button, ButtonGroup, Heading, Textarea, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Menu, MenuList, MenuItem, MenuButton,
  Tag, TagLabel,
  Portal,
   } from "@chakra-ui/react"
   import { BiBlock, BiTrash, BiPencil, BiDetail } from "react-icons/bi"
   import { FaProductHunt, FaSortAmountUp, FaEllipsisV } from "react-icons/fa";
   import { ImPriceTags } from "react-icons/im";
   import { BsCardChecklist } from "react-icons/bs"
   import { MdDescription } from "react-icons/md";

import NavBar from "../../Components/NavBar/NavBar.jsx"
import Features from "./Features.jsx"

const proxy = "http://localhost:5000"

const COLORS = {
  notif: {
    success: "#38A169",
    error: "#E53E3E",
    info: "#3182ce",
    warning: "#D69E2E",
    secondary: "#718096",
    black: "#000000cc"
  },
};

const Products = () => {
  const [product, setProduct] = useState({ 
        name: "", description: "", price: "", amount: "", features: [], thumbnail: "" 
        });
  const [action, setAction] = useState({ value: "products", data: null })
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({ queryString: "", filterType: "name" });
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()


  // API calls
  const getProducts = async () => {
    setLoading(true);
    try {
      const url = `${proxy}/admin/products/getProducts`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        setLoading(false);
        setProducts(result.data);
        console.log(result.message);
        return;
      }
      console.log("an Error occured while loading products !");
    } catch (err) {
      console.log("Error: ", err.message);
    }
  };
  const onCreate = async () => {
    try {
      // data validation (yup)
      const url = `${proxy}/admin/products/createProduct`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(product)
      });
      // reset form
      setProduct({ name: "", description: "", price: "", amount: "", features: [] });

      if (res.ok) {
        const result = await res.json();
        displayToast({ msg: result.message, status: "success" })
        // update state
        // setProducts((prevState) => {
        //   return [result.data, ...prevState]
        // })

        setAction({value: "products"})
        return;
      }
      displayToast({ msg: "an Error occured while adding a product !", status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onEdit = async (data) => {
    try {
      // data validation
      const url = `${proxy}/admin/products/editProduct/${data.productId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "PUT",
        body: JSON.stringify(product)
      });

      if (res.ok) {
        const result = await res.json();
        console.log("edited product data: ", result.data);
        // update products state
        displayToast({ msg: result.message, status: "success" })
        setAction({ value: "products" })
        return;
      }
      displayToast({ msg: "an Error occured while editing product !", status: "error" })
    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onDelete = async (data) => {
    try {
      const url = `${proxy}/admin/products/deleteProduct/${data.productId}`;
      const res = await fetch(url, {
        method: "DELETE"
      });

      if (res.ok) {
        const result = await res.json();

        // remove product data from products
        // const new_products_list = products.filter((el) => el._id !== product);
        // setProducts(new_products_list);

        displayToast({ msg: result.message, status: "success" })
        setAction({ value: "products" })
        return;
      }
      displayToast({ msg: "an Error occured while deleting product !", status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    try {
      const url = `${proxy}/admin/products/filterProducts?queryString=${value}&filterType=${filter.filterType}`;
      const res = await fetch(url);

      if (res.ok) {
        const result = await res.json();
        setProducts(result.data);
        setLoading(false);
        return;
      }
      displayToast({ msg: "an Error occured while filtering users !", status: "error" })

    } catch (err) {
      displayToast({ msg: err.message, status: "error" })
    }
  };

  // functions
  const convertDate = (date) => {
    const new_date = new Date(date).toLocaleDateString("en-US").split(/:| /)[0];
    return new_date;
  };
  const backToProducts = () => {
    setAction({value: "products"})
    setProduct({ name: "", description: "", price: "", amount: "", features: [] })
  };

  const deleteProduct = (productId, productIndex) => {
    setAction({ 
      data: { text: "Are you sure to delete this Product ?", 
      action: () => onDelete(productId, productIndex), label: "Delete" } 
    }); 
    onOpen()
  };
  const editProduct = (productId, productIndex, productData) => {
    setAction({ value: "edit", data: {productId, productIndex}}); 
    setProduct(productData)
  };
  const detailsProduct = (productData, productIndex) => {
    setAction({ value: "details", data:{ productIndex: productIndex } }); 
    setProduct(productData)
  };

  /* Components */
  const displayToast = (data) => {
    const { msg, status } = data
    return toast({
      title: msg,
      status: status,
      variant: "top-accent",
      position: "bottom-right", // "top-right"
      duration: 5000,
      isClosable: true,
    })
  };
  const displayModal = (data) => {
    const { text, action, label } = data
    return  <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader> { label && label } </ModalHeader>
                <ModalCloseButton />
                <ModalBody> { text && text } </ModalBody>

                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={action && action}>
                    { label && label }
                  </Button>
                  <Button variant="outiline" colorScheme="blue" onClick={() => { backToProducts(); onClose()}}> Cancel </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
  };
  const displaySubMenu = (productId, producIndex, producData) => {
    return <Menu>
            <MenuButton as={IconButton}
              icon={<FaEllipsisV />}>
            </MenuButton>
            <MenuList>
              <MenuItem textColor={COLORS.notif.warning}
                    icon={<BiPencil size="18" color={COLORS.notif.warning} />} 
                    onClick={() => editProduct(productId, producIndex, producData)}> Edit </MenuItem>

              <MenuItem textColor={COLORS.notif.error}
                    icon={<BiTrash size="18" color={COLORS.notif.error} />} 
                    onClick={() => deleteProduct(productId, producIndex)}> Delete </MenuItem>

              <MenuItem textColor={COLORS.notif.black}
                    icon={<BiDetail size="18" color={COLORS.notif.black} />} 
                    onClick={() => detailsProduct(producData)}> Details </MenuItem>
            </MenuList>
          </Menu>
  };
  const displayProductsList = (products) => {
       
    return (
      <>
      <Table variant="simple" border="1px" borderWidth="solid" borderColor="gray.200" colorScheme="blue" size="sm" w="95%" mx="auto">
        <Thead>
          <Tr>
            {/* { selectable &&
              <Th p="1rem"> 
                <Checkbox isChecked={localSelected.length === itemsIds.length}
                          onChange={(e) => setCheckedItems(e.target.checked)} />
              </Th>
            } */}
            <Th p="1rem"> Name </Th>
            <Th p="1rem"> Amount </Th>
            <Th p="1rem"> Features </Th>
            <Th p="1rem"> Actions </Th>
            <Th p="1rem"> Created </Th>
            <Th p="1rem"> Last Edit </Th>
          </Tr>
        </Thead>
        
        <Tbody>
          { products.map((el, idx) => 
            <Tr index={idx}>
              <Td>
                {/* <Checkbox defaultIsChecked={selected.includes(el._id)}
                          isChecked={localSelected.includes(el._id)}
                          onChange={(e) => setCheckedItem(el._id, e.target.checked)} /> */}
              </Td>
              <Td> {el.name} </Td>
              <Td> {el.amount} </Td>
              <Td> {el.features && el.features > 0 && el.features.map(item => item) } </Td>
              <Td>
                { displaySubMenu(el._id, idx, el) }
            </Td>
              <Td> {el.createdAt && convertDate(el.createdAt)} </Td>
              <Td> {el.editedAt ? convertDate(el.editedAt) : "not updated "} </Td>
            </Tr>
          )
        }
        </Tbody>

        <Tfoot>
          <Tr>
          {/* { selectable &&
              <Th p="1rem"> 
                <Checkbox isChecked={localSelected.length === itemsIds.length}
                          onChange={(e) => setCheckedItems(e.target.checked)}
                        />
              </Th>
            } */}
            <Th p="1rem"> Name </Th>
            <Th p="1rem"> Amount </Th>
            <Th p="1rem"> Features </Th>
            <Th p="1rem"> Actions </Th>
            <Th p="1rem"> Created </Th>
            <Th p="1rem"> Last Edit </Th>
          </Tr>
        </Tfoot>
      </Table>
     
      </>
    )
  };
  const displayProductDetails = () => {    
    return <Flex flexDirection="column" justifyContent="center" alignContent="center"> 
            <Box display="flex" flexDirection="row" mr="1rem" mb="3rem" justifyContent="center">
              <Flex flexDirection="column" p="1rem" w="20rem" mr="1rem"
                  border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

                <Heading as="h3" size="md" textAlign="left" my="1rem">
                  Product Details
                </Heading>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                  <Image boxSize="150px" borderRadius="md" mb="1rem" mr="auto" alt={product.name} fallbackSrc="https://via.placeholder.com/150"
                      src={product.thumbnail} />
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <FaProductHunt size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> name : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {product.name} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <MdDescription size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> Description : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {product.description} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <ImPriceTags size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> Price : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {product.price} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <FaSortAmountUp size="20" />  
                    <Text ml=".5rem" fontStyle="italic"> Amount : </Text>
                    <Text ml=".5rem" fontWeight="bold"> {product.amount} </Text>
                </Box>

                <Box display="flex" flexDirection="row" my="1.25rem"> 
                    <BsCardChecklist size="20" />  
                    <Text ml=".25rem" fontStyle="italic"> Features : </Text>
                    <Box display="flex" flexDirection="row" flexWrap="wrap" ml=".5rem">
                      { (product.features && product.features.length > 0) &&
                          product.features.map((item, idx) => 
                            <Tag size="md" key={idx} borderRadius="full" variant="solid" mr=".2rem" mb=".25rem"
                                textColor="blue.700" bg="white" border="1px" borderColor="blue">
                              <TagLabel> {item} </TagLabel>
                            </Tag>
                            )
                      }
                    </Box>
                </Box>
                
              </Flex>
            
              { action.value === "details" &&
                <Stack display="flex" flexDirection="column" p="1rem" w="20rem" ml="1rem"
                      border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

                    <Heading as="h4" size="md" textAlign="center" my="1rem">
                      Product ACTIONS
                    </Heading>
              
                  <ButtonGroup variant="outline" colorScheme="blue" spacing="6" display={"flex"} flexDirection="column" 
                              justifyContent="center" alignItems="center" >
                    <Button colorScheme="blue" my=".25rem"
                            onClick={() =>  setAction({ value: "edit", 
                                                          data: {productId: product._id, productIndex: action.data}
                                                        }) }>
                            Edit
                    </Button>

                    <Button colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" icon={<BiTrash />} 
                            onClick={() => { 
                                setAction({ 
                                      data: { text: "Are you sure to delete this product ?", 
                                      action: () => onDelete(product._id, action.data), 
                                      label: "Delete" } 
                                      }); 
                                onOpen()
                                }
                                }>
                                Delete
                    </Button>
                   
                  </ButtonGroup>
                </Stack>
                }  
            </Box>

          { action.value === "details" && 
            <Button colorScheme="blue" variant="outline" w="120px" mx="auto" onClick={() =>  backToProducts()}>
                Back to Products
            </Button>
          }
          </Flex>
  };
  const displayAddProduct = () => {
    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="center" >
        {displayProductDetails()}

        <Box border="1px" borderColor="gray.200" borderStyle="solid" p="1rem" borderRadius="md" width="500px" ml="1rem">
          <Heading as="h3" size="md" my="1rem" textAlign="left"> Add new Product </Heading>

          <Stack>
              <Image boxSize="150px" borderRadius="md" mb="1rem" mr="auto" alt={product.name} fallbackSrc="https://via.placeholder.com/150"
                      src={product.thumbnail} />
              <Input type="file" id="file" 
                      value={product.thumbnail} onChange={(e) => setProduct({ ...product, thumbnail: e.target.value })} />

            <FormControl id="fullName" mb="1rem">
              <FormLabel> Product Name </FormLabel>
              <Input type="text" placeholder="Product Name" name="Name" id="fullName"
                    value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            </FormControl>

            <FormControl id="description" mb="1rem">
              <FormLabel> Description </FormLabel>
              <Textarea placeholder="Description" name="description" id="description" 
                        value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </FormControl>

            <FormControl id="price" mb="1rem">
              <FormLabel> Price </FormLabel>
              <Input type="number" placeholder="Price" name="price" id="price" 
                      value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            </FormControl>

            <FormControl id="amount" mb="1rem">
              <FormLabel> Amount </FormLabel>
              <Input type="number" placeholder="Amount" name="amount" id="amount" 
                    value={product.amount} onChange={(e) => setProduct({ ...product, amount: e.target.value })} />
            </FormControl>

            <FormControl id="features" mb="1rem">
              <FormLabel> Features </FormLabel>
              <Features value={product.features && product.features}
                        onChange={(e) => setProduct({ ...product, features: e.target.value })} />
            </FormControl>
          </Stack>
        </Box>

        </Box>

        <ButtonGroup mt="2rem" display="flex" flexDirection="row" justifyContent="center">
          <Button leftIcon={<FaProductHunt size="20" />} w="150px" colorScheme="blue" variant="solid" onClick={() => onCreate()}>
            New Product
          </Button>
          <Button colorScheme="blue" variant="outline" onClick={() => backToProducts()}>
            Back to Products
          </Button>
        </ButtonGroup>
      </>
    );
  };
  const displayProductsFilter = () => {
    return (
      <Flex flexDirection="column" border="1px" borderColor="gray.200" borderStyle="solid" py="2rem" px="1rem" borderRadius="md" width="500px"  my="2rem" justifyContent="center" mx="auto">
        <Heading as="h3" size="md" mb="1rem" textAlign="center"> Products Filter </Heading>

        <Flex flexDirection="row">
          <Input type="text" placeholder={`Filter by ${filter.filterType}`}
            value={filter.queryString} ml=".5rem"
            onChange={(e) => onFilter(e.target.value)} />

          <Select value={filter.filterType} mr=".5rem" w="7rem"
                  onChange={(e) => setFilter({ ...filter, filterType: e.target.value })}>
            <option value="name"> Name </option>
          </Select>
        </Flex>
      </Flex>
    );
  };
  const displayEditProduct = (data) => {
    const { name, description, price, amount, features, avatar } = data;

    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="center" >
        {displayProductDetails()}

        <Box border="1px" borderColor="gray.200" borderStyle="solid" p="1rem" borderRadius="md" width="500px" ml="1rem">
          <Heading as="h3" size="md" my="1rem" textAlign="left"> Edit User </Heading>

          <Stack>
            <Image boxSize="150px" borderRadius="md" mb="1rem" mr="auto" alt={product.name} fallbackSrc="https://via.placeholder.com/150"
                      src={product.thumbnail} />
            <Input type="file" id="file" 
                      value={product.thumbnail} onChange={(e) => setProduct({ ...product, thumbnail: e.target.value })} />
            <FormControl id="name" mb="1rem">
              <FormLabel> Product Name </FormLabel>
              <Input type="text" placeholder="Product Name" name="name"
                  id="name" value={name ? name : product.fullName} onChange={(e) => setProduct({ ...product, name: e.target.value })} />
            </FormControl>

            <FormControl id="description" mb="1rem">
              <FormLabel> Description </FormLabel>
              <Textarea type="text" placeholder="Description" name="description" id="description" 
                    value={description ? description : product.description} 
                    onChange={(e) => setProduct({ ...product, description: e.target.value })} />
            </FormControl>

            <FormControl id="email" mb="1rem">
              <FormLabel> Price </FormLabel>
              <Input type="number" placeholder="Price" name="price"
                  id="price" value={price ? price : product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />
            </FormControl>

            <FormControl id="password" mb="1rem">
              <FormLabel> Amount </FormLabel>
              <Input type="number" placeholder="Amount" name="amount"
                  id="amount" value={amount ? amount : product.amount} onChange={(e) => setProduct({ ...product, amount: e.target.value })} />
            </FormControl>

            <FormControl id="features" mb="1rem">
              <FormLabel> Features </FormLabel>
              <Features value={features && features}
                        onChange={(e) => setProduct({ ...product, features: e.target.value })} />
            </FormControl>
          </Stack>
        </Box>

        </Box>

        <ButtonGroup mt="2rem" display="flex" flexDirection="row" justifyContent="center">
          <Button leftIcon={<FaProductHunt size="20" />} w="150px" colorScheme="blue" variant="solid" 
                  onClick={() => onEdit(action.data && action.data)}>
            Edit User
          </Button>
          <Button colorScheme="blue" variant="outline" onClick={() => backToProducts()}>
            Back to Products
          </Button>
        </ButtonGroup>
      </>
    );
  };

  useEffect(() => {
    getProducts();
  }, []);
    
    return (
      <>
      <NavBar />
      <Flex flexDirection="column" width="100wh">
            <Heading as="h2" size="lg" textAlign="left" my="2rem"> Products Managment </Heading>

            {
              action.value === "create" ? displayAddProduct() :

              action.value === "edit" ? Object.keys(product).length > 0 && displayEditProduct(product)  :

              action.value === "details" ? displayProductDetails() :

              action.value === "products" ? 
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <Button colorScheme="blue" variant="outline" w="6rem" alignSelf="flex-end" rightIcon={<FaProductHunt size="20" />} 
                      onClick={() => setAction({value: "create"})} > Create </Button>

                    {displayProductsFilter()}
                    
                    { loading ? 
                      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                      products.length > 0 ? displayProductsList(products) :
                      <Heading as="h4" size="md" textAlign="center"> There is not any User </Heading>
                    }
                  </Box> : ""
            }   
            
            <Portal> 
              { action.data && displayModal(action.data && action.data) }
            </Portal>
        </Flex>
      </>
    )
};

export default Products;
