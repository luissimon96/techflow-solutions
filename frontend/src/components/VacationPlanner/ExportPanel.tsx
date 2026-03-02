import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Textarea,
  Heading,
  Text,
  Checkbox,
  useToast,
  Stack,
  Badge,
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
  const [inclBankHours, setInclBankHours] = useState(true);

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

  const message = `*Planejamento de Férias ${year} - TechFlow Solutions*\n\n${appliedSegments
    .map((s) => {
      const start = format(parseISO(s.start), 'dd/MMM/yy');
      const end = format(parseISO(s.end), 'dd/MMM/yy');
      return `📅 ${start} a ${end}\n   Dias consumidos: ${s.daysTaken}\n   Ganho: +${s.gain} dias`;
    })
    .join('\n\n')}\n\n${totalGain > 0
      ? `✨ *Total de ganho: ${totalGain} dias de férias!*\n`
      : ''
    }📊 Total de dias usados: ${totalDaysUsed}\n\nPlano gerado por: Vacation Planner 🎉`;

  const handleExportCSV = () => {
    const csv = [
      ['Período Início', 'Período Fim', 'Dias Consumidos', 'Dias (Span)', 'Ganho'],
      ...appliedSegments.map((s) => [s.start, s.end, s.daysTaken, String(parseISO(s.end).getTime() - parseISO(s.start).getTime()), s.gain]),
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

  return (
    <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <Heading size="sm">Plano de Férias</Heading>

        <Box borderWidth={1} borderRadius="md" p={4} bg="gray.50">
          <VStack spacing={3} align="stretch">
            {appliedSegments.map((s, idx) => {
              const start = format(parseISO(s.start), 'dd/MMM');
              const end = format(parseISO(s.end), 'dd/MMM/yy');
              return (
                <HStack key={idx} justify="space-between" fontSize="sm">
                  <Text>
                    {idx + 1}. {start} → {end}
                  </Text>
                  <HStack space={2}>
                    <Badge colorScheme="purple">{s.daysTaken}d</Badge>
                    <Badge colorScheme="green">+{s.gain}d</Badge>
                  </HStack>
                </HStack>
              );
            })}
          </VStack>
        </Box>

        <Box bg="blue.50" p={3} borderRadius="md" borderLeftWidth={4} borderLeftColor="blue.500">
          <HStack justify="space-between">
            <VStack align="flex-start" spacing={1}>
              <Text fontWeight="bold">Total de dias usados: {totalDaysUsed}</Text>
              {totalGain > 0 && (
                <Text fontWeight="bold" color="green.600">
                  ✨ Ganho total: +{totalGain} dias!
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>

        <Box>
          <Text fontWeight="bold" mb={2}>
            Mensagem para WhatsApp
          </Text>
          <Textarea
            value={message}
            isReadOnly
            minH="200px"
            fontSize="sm"
            fontFamily="mono"
            borderColor="gray.300"
          />
        </Box>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
          <Button colorScheme="whatsapp" onClick={handleShareWhatsApp} flex={1}>
            📱 Compartilhar no WhatsApp
          </Button>
          <Button colorScheme="brand" variant="outline" onClick={handleExportCSV} flex={1}>
            📥 Exportar CSV
          </Button>
          <Button
            colorScheme="red"
            variant="ghost"
            onClick={onClearAll}
            flex={1}
          >
            🗑️ Limpar tudo
          </Button>
        </Stack>

        <Text fontSize="xs" color="gray.500" textAlign="center">
          Seu plano foi gerado e está pronto para compartilhar ou exportar.
        </Text>
      </VStack>
    </Box>
  );
}
