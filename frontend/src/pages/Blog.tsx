import { Box, Container, Heading, Text, SimpleGrid, VStack, Image, Stack, Badge } from '@chakra-ui/react';

const posts = [
  {
    title: 'Transformação Digital: O que é e como implementar',
    excerpt:
      'Descubra como a transformação digital pode revolucionar sua empresa e quais são os primeiros passos para implementá-la.',
    image: '/blog/digital-transformation.jpg',
    date: '15/03/2024',
    category: 'Transformação Digital',
  },
  {
    title: 'Tendências em Desenvolvimento Web para 2024',
    excerpt:
      'Conheça as principais tendências em desenvolvimento web que estão moldando o futuro da internet e como elas podem beneficiar seu negócio.',
    image: '/blog/web-development.jpg',
    date: '10/03/2024',
    category: 'Desenvolvimento Web',
  },
  {
    title: 'Como a Inteligência Artificial está mudando os negócios',
    excerpt:
      'Aprenda como a IA está transformando diferentes setores e como sua empresa pode se beneficiar dessas tecnologias.',
    image: '/blog/artificial-intelligence.jpg',
    date: '05/03/2024',
    category: 'Inteligência Artificial',
  },
];

export default function Blog() {
  return (
    <Box py={20}>
      <Container>
        <VStack spacing={12}>
          <Box textAlign="center">
            <Heading mb={4}>Blog</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Artigos e insights sobre tecnologia, transformação digital e inovação
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {posts.map((post, index) => (
              <Box
                key={index}
                borderRadius="lg"
                overflow="hidden"
                boxShadow="md"
                _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
                transition="all 0.2s"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  fallbackSrc="https://picsum.photos/400/300?grayscale"
                  height="200px"
                  width="100%"
                  objectFit="cover"
                />
                <Stack p={6} spacing={4}>
                  <Badge colorScheme="brand" alignSelf="start">
                    {post.category}
                  </Badge>
                  <Heading size="md">{post.title}</Heading>
                  <Text color="gray.600">{post.excerpt}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {post.date}
                  </Text>
                </Stack>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
} 