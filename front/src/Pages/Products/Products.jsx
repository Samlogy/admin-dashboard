import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Input, Select, Checkbox, 
  Spinner,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td,
  useToast, useDisclosure,
  Flex, Stack, Box, Text, Button, ButtonGroup, Heading, Textarea, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Tag, TagLabel,
   } from "@chakra-ui/react"
   import { BiBlock, BiTrash, BiPencil, BiDetail, BiUser } from "react-icons/bi"
   import { AiOutlineUserAdd } from "react-icons/ai"
   import { FaProductHunt, FaSortAmountUp } from "react-icons/fa";
   import { ImPriceTags } from "react-icons/im";
   import { BsCardChecklist } from "react-icons/bs"
   import { MdDescription } from "react-icons/md";

import NavBar from "../../Components/NavBar/NavBar.jsx"
import Features from "./Features.jsx"

const proxy = "http://localhost:5000"

const Products = () => {
  const [product, setProduct] = useState({ 
        name: "", description: "", price: "", amount: "", features: ["qsdqs", "sqdsq","qsdqs", "sqdsq","qsdqs", "sqdsq","qsdqs", "sqdsq","qsdqs", "sqdsq","qsdqs", "sqdsq","qsdqs", "sqdsq","qsdqs", "sqdsq","qsdqs", "sqdsq",]  
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
  const onEdit = async (e, data) => {
    e.preventDefault()

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

  const deleteproduct = (userId, userIndex) => {
    setAction({ 
      data: { text: "Are you sure to delete this user ?", 
      action: () => onDelete(userId, userIndex), label: "Delete" } 
    }); 
    onOpen()
  };
  const editProduct = (userId, userIndex, userData) => {
    setAction({ value: "edit", data: {userId, userIndex}}); 
    setProduct(userData)
  };
  const detailsProduct = (userData) => {
    setAction({ value: "details" }); 
    setProduct(userData)
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
  const displayProductsList = (products) => {
       
    return (
      <>
      <Table variant="simple" border="1px" borderWidth="solid" borderColor="gray.200" colorScheme="blue" size="sm" w="95%" mx="auto">
        <Thead>
          <Tr>
            <Th p="1rem"> <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox> </Th>
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
                <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox>
              </Td>
              <Td> {el.name} </Td>
              <Td> {el.amount} </Td>
              <Td> {el.features && el.features > 0 && el.features.map(item => item) } </Td>
              <Td>
              <ButtonGroup variant="outline" colorScheme="blue" ml="0" spacing="6" display={"flex"} flexDirection="column" 
                          justifyContent="center" alignItems="center" >
                <IconButton colorScheme="blue" aria-label="edit user" my=".25rem" icon={<BiPencil />} 
                        onClick={() =>  editProduct(el._id, idx, el)} />

                <IconButton colorScheme="blue" aria-label="delete user" my=".25rem"  icon={<BiTrash />}
                        onClick={() => deleteproduct(el._id, idx)} />

                <IconButton colorScheme="blue" aria-label="details user" my=".25rem" icon={<BiDetail />}
                        onClick={() => detailsProduct(el)} />
              </ButtonGroup>
            </Td>
              <Td> {el.createdAt && convertDate(el.createdAt)} </Td>
              <Td> {el.editedAt ? convertDate(el.editedAt) : "not updated "} </Td>
            </Tr>
          )
        }
        </Tbody>

        <Tfoot>
          <Tr>
            <Th p="1rem"> <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox> </Th>
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
    //  const { name, description, price, amount, features } = data;

    return <Flex flexDirection="column" justifyContent="center" alignContent="center"> 
            <Box display="flex" flexDirection="row" mr="1rem" mb="3rem" justifyContent="center">
              <Flex flexDirection="column" p="1rem" w="20rem" mr="1rem"
                  border="1px" borderColor="gray.200" borderStyle="solid" borderRadius="md">

                <Heading as="h3" size="md" textAlign="left" my="1rem">
                  Product Details
                </Heading>

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
                    {/* <Button colorScheme="blue" my=".25rem"
                            onClick={() =>  {setAction({ value: "edit", data: {userId: el._id, userIndex: idx}}); setProduct(el)}}>
                            Edit
                    </Button>

                    <Button colorScheme="blue" aria-label="delete user" my=".25rem" ml="0" icon={<BiTrash />} 
                            onClick={() => { 
                                setAction({ data: { text: "Are you sure to delete this user ?", action: () => onDelete(el._id, idx), label: "Delete" } }); 
                                onOpen()}
                                }>
                                Delete
                    </Button>
                    */}
                  </ButtonGroup>
                </Stack>
                }  
            </Box>

          { action.value === "details" && 
            <Button colorScheme="blue" variant="outline" w="120px" mx="auto" onClick={() =>  backToProducts()}>
                Back to Users
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
          <Button leftIcon={<AiOutlineUserAdd size="20" />} w="150px" colorScheme="blue" variant="solid" onClick={() => onCreate()}>
            New User
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
      <>
        <Flex flexDirection="row" border="1px" borderColor="gray.200" borderStyle="solid" p="2rem" borderRadius="md" width="500px" my="2rem">
        <Input type="text" placeholder={`Filter by ${filter.filterType}`}
          value={filter.queryString}
          onChange={(e) => onFilter(e.target.value)} />

        <Select w="100px" value={filter.filterType}
                onChange={(e) => setFilter({ ...filter, filterType: e.target.value })}>
          <option value="name"> Name </option>
        </Select>
      </Flex>
      </>
    );
  };
  const displayEditProduct = (data) => {
    const { name, description, price, amount, features } = data;

    return (
      <>
        <Box display="flex" flexDirection="row" justifyContent="center" >
        {displayProductDetails()}

        <Box border="1px" borderColor="gray.200" borderStyle="solid" p="1rem" borderRadius="md" width="500px" ml="1rem">
          <Heading as="h3" size="md" my="1rem" textAlign="left"> Edit User </Heading>

          <Stack>
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

            <FormControl id="Features" mb="1rem">
              <FormLabel> Features </FormLabel>
              <Textarea type="text" placeholder="Features" name="Features" id="Features" 
                    value={features ? features : product.features} 
                    onChange={(e) => setProduct({ ...product, features: e.target.value })} />
            </FormControl>
          </Stack>
        </Box>

        </Box>

        <ButtonGroup mt="2rem" display="flex" flexDirection="row" justifyContent="center">
          <Button leftIcon={<AiOutlineUserAdd size="20" />} w="150px" colorScheme="blue" variant="solid" 
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
        <Flex flexDirection="column" width="100wh" p="1rem">
            <Heading as="h2" size="md" textAlign="left" my="2rem"> Product Managment </Heading>

            {
              action.value === "create" ? displayAddProduct() :

              action.value === "edit" ? Object.keys(product).length > 0 && displayEditProduct(product)  :

              action.value === "details" ? displayProductDetails() :

              action.value === "products" ? 
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Button colorScheme="blue" onClick={() => setAction({ value: "create" })} w="100px"> Create </Button>

                    {displayProductsFilter()}
                    
                    { loading ? 
                      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                      products.length > 0 ? displayProductsList(products) :
                      <Heading as="h4" size="md" textAlign="center"> There is not any User </Heading>
                    }
                  </Box> : ""
            }   

            { action.data && displayModal(action.data && action.data) }
        </Flex>
      </>
    )
};

export default Products;
