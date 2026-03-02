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
import { Calculator, CalendarView, SuggestionsList, ExportPanel } from '@/components/VacationPlanner';
import type { CalculatorState, AppliedSegment } from '@/components/VacationPlanner';

const presets: Record<string, number[]> = {
  '5+5+20': [5, 5, 20],
  '10+20': [10, 20],
  '30': [30],
};

export default function VacationPlanner() {
  const [state, setState] = useState<CalculatorState>({
    year: new Date().getFullYear(),
    preset: '5+5+20',
    customSplits: '',
    bankHours: 0,
    workHoursPerDay: 8,
  });

  const [results, setResults] = useState<Record<string, Suggestion[]>>({});
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState<Set<string>>(new Set());
  const [appliedSegments, setAppliedSegments] = useState<AppliedSegment[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const { generateSuggestions } = useVacationCalculator();
  const toast = useToast();

  const handleStateChange = (key: keyof CalculatorState, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateSuggestions = async () => {
    setLoading(true);
    try {
      // Fetch holidays
      const holidayData = await fetchHolidays(state.year, 'BR');
      const holidaySet = new Set(holidayData.map((h) => h.date));
      setHolidays(holidaySet);

      // Parse splits
      let splits = presets[state.preset] || [30];
      if (state.customSplits.trim()) {
        const custom = state.customSplits.split(',').map((s) => {
          const num = parseInt(s.trim(), 10);
          return isNaN(num) ? 0 : num;
        });
        if (custom.some((n) => n > 0)) {
          splits = custom;
        }
      }

      // Generate suggestions
      const suggestions = await generateSuggestions(
        state.year,
        splits,
        state.bankHours,
        state.workHoursPerDay
      );

      setResults(suggestions);
      toast({
        title: 'Sugestões geradas!',
        description: `${Object.values(suggestions).flat().length} opção(ões) disponível(is)`,
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
      daysTaken: suggestion.daysTaken,
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
          state={state}
          onChange={handleStateChange}
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
                year={state.year}
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
                year={state.year}
                onClearAll={handleClearAll}
              />
            </Box>
          </>
        )}
      </VStack>
    </Container>
  );
}
