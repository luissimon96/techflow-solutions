import React, { useState } from 'react';
import {
  Container,
  VStack,
  Heading,
  Box,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useVacationCalculator, Suggestion } from '@/hooks/useVacationCalculator';
import { fetchHolidays } from '@/lib/holidays';
import {
  Calculator,
  CalendarView,
  SuggestionsList,
  ExportPanel,
} from '@/components/VacationPlanner';
import type { AppliedSegment } from '@/components/VacationPlanner';
import {
  VacationOptions,
  Holiday,
  WorkingDays,
  SearchPeriod,
  LocationInfo,
} from '@/types/vacation';

const presets: Record<string, number[]> = {
  '5+5+20': [5, 5, 20],
  '10+20': [10, 20],
  '30': [30],
};

export default function VacationPlanner() {
  const defaultWorking: WorkingDays = {
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false,
  };

  const [options, setOptions] = useState<VacationOptions>({
    totalDays: 30,
    splits: [5, 5, 20],
    preset: '5+5+20',
    customSplits: '',
    bankDays: 0,
    workHoursPerDay: 8,
    searchPeriod: { type: '12months' },
    workingDays: defaultWorking,
    location: {},
    customHolidays: [],
  });

  const [results, setResults] = useState<Record<string, Suggestion[]>>({});
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [appliedSegments, setAppliedSegments] = useState<AppliedSegment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const { generateSuggestions } = useVacationCalculator(
    [],
    () => [],
    () => []
  );
  const toast = useToast();

  const handleOptionsChange = (opts: Partial<VacationOptions>) => {
    setOptions((prev) => ({ ...prev, ...opts }));
  };

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      // fetch just national holidays for earlier calendar visualization
      const year = new Date().getFullYear();
      const holidayData = await fetchHolidays(year, 'BR');
      setHolidays(new Set(holidayData.map((h) => h.date)));

      // compute splits array
      let splits = presets[options.preset] || [30];
      if (options.customSplits.trim()) {
        const custom = options.customSplits
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n) && n > 0);
        if (custom.length) splits = custom;
      }
      const optsForCalc = { ...options, splits };

      const suggestions = await generateSuggestions(optsForCalc);
      setResults(suggestions);
      toast({
        title: 'Sugestões geradas!',
        description: `${suggestions.length} opção(ões) disponível(is)`,
        status: 'success',
        duration: 4000,
      });
    } catch (err) {
      toast({
        title: 'Erro ao gerar sugestões',
        description: 'Verifique os parâmetros e tente novamente',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationSegment = (suggestion: Suggestion, segmentId: string) => {
    const newSegment: AppliedSegment = {
      id: segmentId,
      start: suggestion.start,
      end: suggestion.end,
      daysTaken: suggestion.workingDaysConsumed,
      gain: suggestion.gain,
    };

    setAppliedSegments((prev) => {
      // Remove if already applied for this segment
      const filtered = prev.filter((s) => s.id !== segmentId);
      return [...filtered, newSegment];
    });

    toast({
      title: 'Período aplicado!',
      description: `${suggestion.start} até ${suggestion.end}`,
      status: 'success',
      duration: 2000,
    });
  };

  const handleCompareSegment = (suggestion: Suggestion, segmentId: string) => {
    // Already handled in ExportPanel via WhatsApp
  };

  const handleClearAll = () => {
    setAppliedSegments([]);
    toast({
      title: 'Limpado',
      description: 'Todos os períodos foram removidos',
      status: 'info',
      duration: 2000,
    });
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            📅 Planejador de Férias
          </Heading>
          <Heading as="h2" size="sm" color="gray.600" fontWeight="normal">
            Otimize seus dias de férias emendando feriados e fins de semana
          </Heading>
        </Box>

        <Divider />

        {/* Calculator Section */}
        <Calculator
          options={options}
          onOptionsChange={handleOptionsChange}
          onGenerateSuggestions={handleGenerateSuggestions}
          loading={loading}
          presets={presets}
        />

        {Object.keys(results).length > 0 && (
          <>
            <Divider />

            {/* Calendar View */}
            <Box>
              <Heading size="md" mb={4}>
                📆 Calendário
              </Heading>
              <CalendarView
                year={new Date().getFullYear()}
                month={selectedMonth}
                holidays={holidays}
              />
              <Box mt={2} textAlign="center">
                <Box
                  fontSize="sm"
                  color="gray.500"
                  onClick={() => setSelectedMonth((m) => (m - 1 < 0 ? 11 : m - 1))}
                >
                  Navegue pelos meses para ver feriados
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Suggestions Section */}
            <Box>
              <Heading size="md" mb={4}>
                ✨ Sugestões Otimizadas
              </Heading>
              <SuggestionsList
                results={results}
                onApply={handleApplicationSegment}
                onCompare={handleCompareSegment}
              />
            </Box>

            <Divider />

            {/* Export Panel */}
            <Box>
              <Heading size="md" mb={4}>
                📊 Seu Plano
              </Heading>
              <ExportPanel
                appliedSegments={appliedSegments}
                year={new Date().getFullYear()}
                onClearAll={handleClearAll}
              />
            </Box>
          </>
        )}
      </VStack>
    </Container>
  );
}
