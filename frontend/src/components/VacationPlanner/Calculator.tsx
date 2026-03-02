import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Spinner,
  Stack,
  Divider,
  Tooltip,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';

export interface CalculatorState {
  year: number;
  preset: string;
  customSplits: string; // comma-separated numbers
  bankHours: number;
  workHoursPerDay: number;
}

export interface CalculatorProps {
  state: CalculatorState;
  onChange: (key: keyof CalculatorState, value: any) => void;
  onGenerateSuggestions: () => Promise<void>;
  loading: boolean;
  presets: Record<string, number[]>;
}

export function Calculator({
  state,
  onChange,
  onGenerateSuggestions,
  loading,
  presets,
}: CalculatorProps) {
  return (
    <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <Box>
          <FormControl>
            <FormLabel fontWeight="bold">Ano</FormLabel>
            <NumberInput
              value={String(state.year)}
              onChange={(val) => onChange('year', Number(val) || new Date().getFullYear())}
              min={2020}
              max={2030}
            >
              <NumberInputField />
            </NumberInput>
          </FormControl>
        </Box>

        <Divider />

        <Box>
          <FormControl>
            <HStack mb={2}>
              <FormLabel fontWeight="bold" mb={0}>
                Distribuição de férias
              </FormLabel>
              <Tooltip
                label="Selecione um preset ou defina uma distribuição customizada (ex.: 5,5,20)"
                placement="top"
              >
                <InfoIcon boxSize={4} color="gray.500" />
              </Tooltip>
            </HStack>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Box flex={1}>
                <FormLabel fontSize="sm" color="gray.600">
                  Presets
                </FormLabel>
                <Select
                  value={state.preset}
                  onChange={(e) => onChange('preset', e.target.value)}
                >
                  {Object.keys(presets).map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box flex={1}>
                <Tooltip
                  label="Formato: números separados por vírgula (ex.: 5,5,20)"
                  placement="top"
                >
                  <FormLabel fontSize="sm" color="gray.600">
                    Custom
                  </FormLabel>
                </Tooltip>
                <Input
                  placeholder="ex.: 5,5,20"
                  value={state.customSplits}
                  onChange={(e) => onChange('customSplits', e.target.value)}
                />
              </Box>
            </Stack>
          </FormControl>
        </Box>

        <Divider />

        <Box>
          <FormControl>
            <HStack mb={2}>
              <FormLabel fontWeight="bold" mb={0}>
                Banco de horas
              </FormLabel>
              <Tooltip
                label="Horas de banco convertidas para dias úteis (ex.: 8h = 1 dia)"
                placement="top"
              >
                <InfoIcon boxSize={4} color="gray.500" />
              </Tooltip>
            </HStack>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Box flex={1}>
                <FormLabel fontSize="sm" color="gray.600">
                  Horas
                </FormLabel>
                <NumberInput
                  value={String(state.bankHours)}
                  onChange={(val) => onChange('bankHours', Number(val) || 0)}
                  min={0}
                  max={240}
                  step={8}
                >
                  <NumberInputField />
                </NumberInput>
              </Box>

              <Box flex={1}>
                <FormLabel fontSize="sm" color="gray.600">
                  Horas por dia útil
                </FormLabel>
                <NumberInput
                  value={String(state.workHoursPerDay)}
                  onChange={(val) => onChange('workHoursPerDay', Number(val) || 8)}
                  min={6}
                  max={12}
                >
                  <NumberInputField />
                </NumberInput>
              </Box>
            </Stack>
          </FormControl>
        </Box>

        <Divider />

        <Button
          colorScheme="brand"
          size="lg"
          onClick={onGenerateSuggestions}
          isDisabled={loading}
          w="full"
        >
          {loading ? <Spinner size="sm" mr={2} /> : null}
          {loading ? 'Gerando sugestões...' : 'Gerar Sugestões'}
        </Button>
      </VStack>
    </Box>
  );
}
