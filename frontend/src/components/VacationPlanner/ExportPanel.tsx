import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  useToast,
  Stack,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import { getWhatsAppUrl } from '@/lib/whatsapp';

export interface AppliedSegment {
  id: string;
  start: string;
  end: string;
  daysTaken: number;
  gain: number;
}

export interface ExportPanelProps {
  appliedSegments: AppliedSegment[];
  year: number;
  onClearAll?: () => void;
}

export function ExportPanel({ appliedSegments, year, onClearAll }: ExportPanelProps) {
  const toast = useToast();

  if (appliedSegments.length === 0) {
    return (
      <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
        <Text color="gray.600" textAlign="center">
          Nenhum segmento aplicado. Clique em "Aplicar" numa sugestão.
        </Text>
      </Box>
    );
  }

  const totalDaysUsed = appliedSegments.reduce((acc, s) => acc + s.daysTaken, 0);
  const totalGain = appliedSegments.reduce((acc, s) => acc + s.gain, 0);
  const startDate = appliedSegments.length > 0 ? appliedSegments[0].start : '';
  const endDate = appliedSegments.length > 0 ? appliedSegments[appliedSegments.length - 1].end : '';

  const formatDatabaseDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const message =
    `*Planejamento de Férias ${year}*\n\n` +
    `📅 *Início:* ${formatDatabaseDate(startDate)}\n` +
    `📅 *Retorno:* ${formatDatabaseDate(endDate)}\n` +
    `🎉 *Extras:* ${totalGain} dias\n` +
    `📊 *Total:* ${totalDaysUsed} dias\n\n` +
    `Períodos:\n${appliedSegments
      .map((s, i) => {
        const start = format(parseISO(s.start), 'dd/MMM');
        const end = format(parseISO(s.end), 'dd/MMM/yy');
        return `${i + 1}. ${start} a ${end} (+${s.gain}d)`;
      })
      .join('\n')}\n\n` +
    `Gerado por: Vacation Planner 🎉`;

  const handleExportCSV = () => {
    const csv = [
      ['Período Início', 'Período Fim', 'Dias Consumidos', 'Ganho'],
      ...appliedSegments.map((s) => [s.start, s.end, s.daysTaken, s.gain]),
    ]
      .map((row) => row.map((col) => (typeof col === 'string' ? `"${col}"` : col)).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vacation-plan-${year}.csv`);
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'CSV exportado',
      description: 'Arquivo CSV foi baixado',
      status: 'success',
      duration: 3000,
    });
  };

  const handleShareWhatsApp = () => {
    const url = getWhatsAppUrl(message);
    window.open(url, '_blank');
    toast({
      title: 'Compartilhado',
      description: 'WhatsApp aberto para compartilhar seu plano',
      status: 'success',
      duration: 3000,
    });
  };

  const periodColors = ['purple.600', 'blue.600', 'indigo.600'];

  return (
    <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <Heading size="sm">📋 Seu Plano de Férias</Heading>

        {/* Summary bar - FolgaExtra style */}
        <Box
          bg="linear-gradient(135deg, #5B4FA0 0%, #7C5BC7 100%)"
          p={5}
          borderRadius="xl"
          boxShadow="0 4px 12px rgba(91, 79, 160, 0.3)"
        >
          <VStack spacing={3}>
            <HStack spacing={6} justify="space-around" w="full" wrap="wrap">
              <VStack spacing={0.5}>
                <Text fontSize="xs" color="white" opacity={0.8} textTransform="uppercase">
                  📅 Início
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {formatDatabaseDate(startDate)}
                </Text>
              </VStack>
              <VStack spacing={0.5}>
                <Text fontSize="xs" color="white" opacity={0.8} textTransform="uppercase">
                  📅 Retorno
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {formatDatabaseDate(endDate)}
                </Text>
              </VStack>
              <VStack spacing={0.5}>
                <Text fontSize="xs" color="white" opacity={0.8} textTransform="uppercase">
                  🎉 Extras
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="#FF6B6B">
                  {totalGain}
                </Text>
              </VStack>
              <VStack spacing={0.5}>
                <Text fontSize="xs" color="white" opacity={0.8} textTransform="uppercase">
                  📊 Total
                </Text>
                <Text fontSize="lg" fontWeight="bold" color="white">
                  {totalDaysUsed}
                </Text>
              </VStack>
            </HStack>
            {totalGain > 0 && (
              <Box w="full" textAlign="center" pt={2} borderTopWidth={1} borderColor="whiteAlpha.300">
                <Text fontSize="sm" color="#FF6B6B" fontWeight="bold">
                  ✨ {totalGain} dias de ganho! ✨
                </Text>
              </Box>
            )}
          </VStack>
        </Box>

        <Divider />

        {/* Period cards - FolgaExtra style */}
        <Box>
          <Text fontSize="sm" fontWeight="bold" mb={4} color="gray.700">
            Períodos de Férias
          </Text>
          <HStack spacing={3} wrap="wrap">
            {appliedSegments.map((s, idx) => {
              const start = format(parseISO(s.start), 'dd/MMM');
              const end = format(parseISO(s.end), 'dd/MMM/yy');
              const bgColor = periodColors[idx % periodColors.length];
              return (
                <Box key={idx}>
                  <VStack
                    spacing={1}
                    p={4}
                    bg={bgColor}
                    borderRadius="lg"
                    color="white"
                    align="center"
                    minW="100px"
                    boxShadow="0 2px 8px rgba(0, 0, 0, 0.15)"
                  >
                    <Text fontSize="xs" opacity={0.9} fontWeight="bold">
                      {idx + 1}° PERÍODO
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {s.daysTaken}
                    </Text>
                    <Text fontSize="xs" opacity={0.8}>
                      dias
                    </Text>
                  </VStack>
                  <Text fontSize="xs" mt={2} textAlign="center" color="gray.600" fontWeight="semibold">
                    {start} a {end}
                  </Text>
                  <Badge
                    colorScheme="red"
                    fontSize="xs"
                    mt={1}
                    display="block"
                    textAlign="center"
                    w="full"
                    py={1}
                  >
                    +{s.gain}d
                  </Badge>
                </Box>
              );
            })}
          </HStack>
        </Box>

        <Divider />

        {/* Action buttons */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
          <Button
            colorScheme="whatsapp"
            onClick={handleShareWhatsApp}
            flex={1}
            fontWeight="bold"
          >
            💬 Compartilhar WhatsApp
          </Button>
          <Button colorScheme="brand" variant="outline" onClick={handleExportCSV} flex={1}>
            📥 Exportar CSV
          </Button>
          <Button colorScheme="red" variant="ghost" onClick={onClearAll} flex={1}>
            🗑️ Limpar
          </Button>
        </Stack>

        <Text fontSize="xs" color="gray.500" textAlign="center">
          Seu plano foi gerado e está pronto para compartilhar!
        </Text>
      </VStack>
    </Box>
  );
}
