import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  VStack,
  Heading,
  Text,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';

export interface Suggestion {
  start: string;
  end: string;
  workingDaysConsumed: number;
  calendarSpan: number;
  gain: number;
  description?: string;
}

export interface SuggestionsListProps {
  results: Record<string, Suggestion[]>;
  onApply?: (suggestion: Suggestion, segmentId: string) => void;
  onCompare?: (suggestion: Suggestion, segmentId: string) => void;
}

export function SuggestionsList({ results, onApply, onCompare }: SuggestionsListProps) {
  if (Object.keys(results).length === 0) {
    return (
      <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
        <Text color="gray.600" textAlign="center">
          Nenhuma sugestão gerada. Ajuste os parâmetros e gere sugestões.
        </Text>
      </Box>
    );
  }

  return (
    <VStack spacing={8} align="stretch">
      {Object.entries(results).map(([segmentId, suggestions]) => (
        <Box key={segmentId} borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Heading size="sm">Segmento {segmentId} dias</Heading>
              <Badge colorScheme="blue">{suggestions.length} opção(ões)</Badge>
            </HStack>

            {suggestions.length === 0 ? (
              <Text fontSize="sm" color="gray.600">
                Nenhuma sugestão disponível para este segmento.
              </Text>
            ) : (
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg="gray.50">
                      <Th>Período</Th>
                      <Th isNumeric>Consumidos</Th>
                      <Th isNumeric>Dias (span)</Th>
                      <Th isNumeric>Ganho (dias)</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {suggestions.map((s, idx) => {
                      const start = format(parseISO(s.start), 'dd/MMM');
                      const end = format(parseISO(s.end), 'dd/MMM/yy');
                      const gainColor = s.gain > 0 ? 'green' : 'gray';

                      return (
                        <Tr key={idx} _hover={{ bg: 'gray.50' }}>
                          <Td>
                            <Text fontSize="sm" fontWeight="semibold">
                              {start} até {end}
                            </Text>
                            <Text fontSize="xs" color="gray.600">
                              {s.start} a {s.end}
                            </Text>
                          </Td>
                          <Td isNumeric>
                            <Badge colorScheme="purple">{s.workingDaysConsumed}d</Badge>
                          </Td>
                          <Td isNumeric>
                            <Badge colorScheme="blue">{s.calendarSpan}d</Badge>
                          </Td>
                          <Td isNumeric>
                            <Badge colorScheme={gainColor} fontSize="md" fontWeight="bold">
                              +{s.gain}d
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button
                                size="xs"
                                colorScheme="brand"
                                onClick={() => onApply?.(s, segmentId)}
                                fontWeight="bold"
                              >
                                ✓ Aplicar
                              </Button>
                              <Button
                                size="xs"
                                variant="outline"
                                colorScheme="brand"
                                onClick={() => onCompare?.(s, segmentId)}
                              >
                                📊 Info
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </Box>
            )}
          </VStack>
        </Box>
      ))}
    </VStack>
  );
}
