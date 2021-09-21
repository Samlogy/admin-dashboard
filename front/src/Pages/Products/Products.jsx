import React, { useState, useEffect } from "react";
import { FormControl, FormLabel, Input, Select, Checkbox, Image,
  Spinner,
  Table, Thead, Tbody, Tfoot, Tr, Th, Td,
  useToast, useDisclosure,
  Flex, Stack, Box, Text, Button, ButtonGroup, Heading, Textarea, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  Menu, MenuList, MenuItem, MenuButton,
  Tag, TagLabel,
  Portal, Container
   } from "@chakra-ui/react"
   import { BiTrash, BiPencil, BiDetail } from "react-icons/bi"
   import { FaProductHunt, FaSortAmountUp, FaEllipsisV } from "react-icons/fa";
   import { ImPriceTags } from "react-icons/im";
   import { BsCardChecklist } from "react-icons/bs"
   import { MdDescription } from "react-icons/md";

import Layout from "../Layout.jsx"
import Features from "./Features.jsx"
import { load_products, create_product, edit_product, delete_product, filter_products } from "../../api"
import { View } from "../../Components"

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
  const uploadImage = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const url = `${proxy}/admin/products/uploadfiles`;

    if (
      e.currentTarget &&
      e.currentTarget.files &&
      e.currentTarget.files.length > 0
    ) {
      const file = e.currentTarget.files[0];

      // let formData = new FormData();
      const config = {
        headers: { "content-type": "multipart/form-data" }
      };
      // formData.append("file", file);
      // console.log('file: ', file)

      fetch(url, file, config)
      .then((res) => {
        if (res.data.success) {
          setProduct({...product, thumbnail: `/uploads/${res.data.fileName}` })
          return displayToast({ msg: 'Upload success: ', status: "success" })
        } else {
          return displayToast({ msg: 'Failed to Upload !', status: "error" })
        }
      })
      .catch((err) => displayToast({ msg: err.message, status: "error" }))
    }
  };
  const onLoad = async () => {
    setLoading(true);
      const result = await load_products();

      if (result.success) {
        setLoading(false);
        setProducts(result.data);
        return;
      }
      setLoading(false);
      displayToast({ msg: "an Error occured while loading products !", status: "error" })
  };
  const onCreate = async () => {
    const result = await create_product(product);
    // reset form
    setProduct({ name: "", description: "", price: "", amount: "", features: [] });

    if (result.success) {
      displayToast({ msg: result.message, status: "success" })
      // update state
      setAction({value: "products"})
      return;
    }
    displayToast({ msg: "an Error occured while adding a product !", status: "error" })
  };
  const onEdit = async (data) => {
    const result = await edit_product(data.productId, product);

    if (result.success) {
      // update products state
      displayToast({ msg: result.message, status: "success" })
      setAction({ value: "products" })
      return;
    }
    displayToast({ msg: "an Error occured while editing product !", status: "error" })
  };
  const onDelete = async (data) => {
    const result = await delete_product(data.productId);

    if (result.success) {
      // update state
      displayToast({ msg: result.message, status: "success" })
      setAction({ value: "products" })
      return;
    }
    displayToast({ msg: "an Error occured while deleting product !", status: "error" })
  };
  const onFilter = async (value) => {
    setFilter({ ...filter, queryString: value });
    setLoading(true);

    const result = await filter_products(value, filter.filterType);

    if (result.success) {
      setProducts(result.data);
      setLoading(false);
      return;
    }
    setLoading(false);
    displayToast({ msg: "an Error occured while filtering users !", status: "error" })
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

  useEffect(() => {
    onLoad();
  }, []);
    
    return (
      <Layout isFixedNav isVisible>
        <Container maxW="80em" py="39px" px={["16px","","","40px"]} m="0 auto" borderRadius="4px">
          <Heading as="h2" size="lg" textAlign="left" my="2rem"> Products Managment </Heading>

          <View if={action.value === "create"}>
            <FormProduct product={product} setProduct={setProduct} uploadImage={uploadImage} backToProducts={backToProducts} onCreate={onCreate} action={action}>
              <ProductDetails product={product} action={action} onOpen={onOpen} onDelete={onDelete} backToProducts={backToProducts} />
            </FormProduct>
          </View>
          
          <View if={action.value === "edit" && Object.keys(product).length > 0}>
            <FormProduct product={product} setProduct={setProduct} uploadImage={uploadImage} backToProducts={backToProducts} onEdit={onEdit} action={action}>
              <ProductDetails product={product} action={action} onOpen={onOpen} onDelete={onDelete} backToProducts={backToProducts} />
            </FormProduct>
          </View>

          <View if={action.value === "details"}>
            <ProductDetails product={product} action={action} onOpen={onOpen} onDelete={onDelete} backToProducts={backToProducts} />
          </View>

          <View if={action.value === "products"} display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <Button colorScheme="blue" variant="outline" w="6rem" alignSelf="flex-end" rightIcon={<FaProductHunt size="20" />} 
                  onClick={() => setAction({value: "create"})} > Create </Button>

            <ProductFilter filter={filter} onFilter={onFilter} setFilter={setFilter} />
            
            { loading ? 
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="lg" /> : 
                products.length > 0 ? 
                  <ProductList products={products} convertDate={convertDate} editProduct={editProduct} deleteProduct={deleteProduct} detailsProduct=  {detailsProduct} /> :
                    <Heading Heading as="h4" size="md" textAlign="center"> There is not any User </Heading>
            }
          </View>

          <View if={action.data}>
            <ModalBox data={action.data} isOpen={isOpen} onClose={onClose} />
          </View>
        </Container>
      </Layout>
    )
};

const ModalBox = ({ data, isOpen, onClose }) => {
  const { text, action, label } = data
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> { label && label } </ModalHeader>
        <ModalCloseButton />
        <ModalBody> { text && text } </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={action && action}>
            { label && label }
          </Button>
          <Button variant="outiline" colorScheme="blue" onClick={() => onClose()}> Cancel </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
};
const SubMenu = ({ productId, producIndex, producData, editProduct, deleteProduct, detailsProduct }) => {
  return <Menu>
          <MenuButton as={IconButton}
            icon={<FaEllipsisV />}>
          </MenuButton>

          <MenuList>
            <MenuItem color={COLORS.notif.warning}
                  icon={<BiPencil size="18" color={COLORS.notif.warning} />} 
                  onClick={() => editProduct(productId, producIndex, producData)}> Edit </MenuItem>

            <MenuItem color={COLORS.notif.error}
                  icon={<BiTrash size="18" color={COLORS.notif.error} />} 
                  onClick={() => deleteProduct(productId, producIndex)}> Delete </MenuItem>

            <MenuItem color={COLORS.notif.black}
                  icon={<BiDetail size="18" color={COLORS.notif.black} />} 
                  onClick={() => detailsProduct(producData)}> Details </MenuItem>
          </MenuList>
        </Menu>
};
const ProductFilter = ({ filter, onFilter, setFilter }) => {
  return (
    <Flex flexDirection="column" border="1px solid" borderColor="gray.200" p="2rem 1rem" borderRadius="md" width="500px" justifyContent="center" m="2rem auto">
      <Heading as="h3" size="md" mb="1rem" textAlign="center"> Products Filter </Heading>

      <Flex>
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
const ProductList = ({ products, convertDate, editProduct, deleteProduct, detailsProduct }) => {
  return (
    <>
    <Table variant="simple" border="1px solid" borderColor="gray.200" colorScheme="blue" size="sm" w="95%" mx="auto">
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
            <Td> <Checkbox colorScheme="blue" size="md" defaultIsChecked={false}></Checkbox> </Td>
            <Td> {el.name} </Td>
            <Td> {el.amount} </Td>
            <Td>
              {(el.features && el.features > 0) && el.features.map((item, idx) => (
                  <Flex flexDir="row" flexWrap="wrap" key={idx}>
                    <Tag size="md" key={idx} borderRadius="full" bg="white" border="1px solid" borderColor="blue" m=".25rem"
                        color="blue.700" variant="solid">
                      <TagLabel> {item} </TagLabel>
                    </Tag>
                  </Flex>
                )) }
            </Td>
            <Td> 
              <SubMenu productId={el._id} producIndex={idx} producData={el} editProduct={editProduct} deleteProduct={deleteProduct} detailsProduct={detailsProduct} />
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
const FormProduct = ({ product, setProduct, uploadImage, backToProducts, onCreate, onEdit, action, children }) => {
  let name, description, price, amount, features, thumbnail;
  if (action.value === "edit") {
    name = product.name; 
    description = product.description; 
    price = product.price; 
    amount = product.amount;
    features = product.features;
    thumbnail = product.thumbnail;
  }

  return (
    <>
      <Flex justifyContent="center">
        {children}

      <Box border="1px" borderColor="gray.200" borderStyle="solid" p="1rem" borderRadius="md" width="500px" ml="1rem">
        <Heading as="h3" size="md" my="1rem" textAlign="left">  
          {action.value === "edit" ? "Edit Product" : "New Product"}
        </Heading>

        <Stack>
          <Image boxSize="150px" borderRadius="md" mb="1rem" mr="auto" alt={product.name} fallbackSrc="https://via.placeholder.com/150"
                    src={thumbnail ? thumbnail : product.thumbnail} />
          <Input type="file" id="file" value={product.thumbnail} onChange={(e) => uploadImage(e)} />

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

      </Flex>

      <ButtonGroup mt="2rem" display="flex" flexDirection="row" justifyContent="center">
        { action.value ===  "edit" ?
          <Button leftIcon={<FaProductHunt size="20" />} w="150px" colorScheme="blue" variant="solid" onClick={() => onEdit(action.data)}>
            Edit Product
          </Button> : 
          <Button leftIcon={<FaProductHunt size="20" />} w="150px" colorScheme="blue" variant="solid" onClick={() => onCreate()}>
            New Product
          </Button>
        }
        <Button colorScheme="blue" variant="outline" onClick={() => backToProducts()}>
          Back to Products
        </Button>
      </ButtonGroup>
    </>
  );
};
const ProductDetails = ({ product, action, setAction, onOpen, onDelete, backToProducts }) => {    
  return <Flex flexDirection="column" justifyContent="center" alignContent="center"> 
          <Flex mr="1rem" mb="3rem" justifyContent="center">
            <Flex flexDirection="column" p="1rem" w="20rem" mr="1rem"
                border="1px solid" borderColor="gray.200" borderRadius="md">

              <Heading as="h3" size="md" textAlign="left" my="1rem">
                Product Details
              </Heading>

              <Flex my="1.25rem"> 
                <Image boxSize="150px" borderRadius="md" mb="1rem" mr="auto" alt={product.name} fallbackSrc="https://via.placeholder.com/150"
                    src={product.thumbnail} />
              </Flex>

              <Flex my="1.25rem"> 
                  <FaProductHunt size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> name : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {product.name} </Text>
              </Flex>

              <Flex my="1.25rem"> 
                  <MdDescription size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> Description : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {product.description} </Text>
              </Flex>

              <Flex my="1.25rem"> 
                  <ImPriceTags size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> Price : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {product.price} </Text>
              </Flex>

              <Flex my="1.25rem"> 
                  <FaSortAmountUp size="20" />  
                  <Text ml=".5rem" fontStyle="italic"> Amount : </Text>
                  <Text ml=".5rem" fontWeight="bold"> {product.amount} </Text>
              </Flex>

              <Flex my="1.25rem"> 
                  <BsCardChecklist size="20" />  
                  <Text ml=".25rem" fontStyle="italic"> Features : </Text>
                  <Flex flexWrap="wrap" ml=".5rem">
                    { (product.features && product.features.length > 0) &&
                        product.features.map((item, idx) => 
                          <Tag size="md" key={idx} borderRadius="full" variant="solid" mr=".2rem" mb=".25rem"
                              color="blue.700" bg="white" border="1px" borderColor="blue">
                            <TagLabel> {item} </TagLabel>
                          </Tag>
                        )
                    }
                  </Flex>
              </Flex>
              
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
          </Flex>

        { action.value === "details" && 
          <Button colorScheme="blue" variant="outline" w="120px" mx="auto" onClick={() => backToProducts()}>
              Back to Products
          </Button>
        }
        </Flex>
};

export default Products;
