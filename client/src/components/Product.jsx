import React, { useEffect, useState } from 'react';
import { Box, Center, Image, Flex, Badge, Text } from "@chakra-ui/react";
import { MdStar } from "react-icons/md";

export default function Product() {
  const [product, setProduct] = useState({ title: '', imgURL: '', priceTxt: '' });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://localhost:3001/scrape?url=URL_TO_SCRAPE');
      const data = await response.json();
      setProduct(data);
    }

    fetchData();
  }, []);

  return (
    <Center h="100vh">
      <Box
        h="auto"
        maxW="220px"
        transform="rotate(0deg)"
        _hover={{ transform: "rotate(-4deg)" }}
        transition="transform 0.2s"
        cursor="pointer"
      >
        <Image borderRadius="md" src={product.imgURL} h="120px" w="200px" />
        <Text mt={2} fontSize="md" fontWeight="semibold" lineHeight="short">
          {product.title}
        </Text>
        <Text mt={2} fontSize="xs" fontWeight="800">{product.priceTxt}</Text>
        <Flex mt={2} align="center">
          <Box as={MdStar} color="orange.400" />
          <Text ml={1} fontSize="xs">
            <b>4.84</b> (190)
          </Text>
        </Flex>
      </Box>
    </Center>
  );
}
