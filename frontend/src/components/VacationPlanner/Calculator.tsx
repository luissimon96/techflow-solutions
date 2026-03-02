import React, { useState } from 'react';
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
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import {
  VacationOptions,
  Holiday,
  WorkingDays,
  SearchPeriod,
  LocationInfo,
} from '@/types/vacation';

// helper to format working days to string
function workingDaysToString(w: WorkingDays) {
  return ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
    .map((d, i) => (Object.values(w)[i] ? d : '_'))
    .join(' ');
}

export interface CalculatorProps {
  options: VacationOptions;
  onOptionsChange: (opts: Partial<VacationOptions>) => void;
  onGenerateSuggestions: () => Promise<void>;
  loading: boolean;
  presets: Record<string, number[]>;
}

export function Calculator({
  options,
  onOptionsChange,
  onGenerateSuggestions,
  loading,
  presets,
}: CalculatorProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tempHolidays, setTempHolidays] = useState<string>('');

  const applyCustomHolidays = () => {
    const list: Holiday[] = tempHolidays
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((date) => ({ date, name: 'Personalizado' }));
    onOptionsChange({ customHolidays: list });
    onClose();
  };

  const handleWorkingDayToggle = (day: keyof WorkingDays) => {
    onOptionsChange({
      workingDays: { ...options.workingDays, [day]: !options.workingDays[day] },
    });
  };

  return (
    <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        {/* Search period */}
        <Box>
          <FormControl>
            <FormLabel fontWeight="bold">Período de busca</FormLabel>
            <RadioGroup
              value={options.searchPeriod.type}
              onChange={(v) =>
                onOptionsChange({
                  searchPeriod: { ...options.searchPeriod, type: v as SearchPeriod['type'] },
                })
              }
            >
              <HStack spacing={4}>
                <Radio value="12months">12 meses</Radio>
                <Radio value="custom">Customizado</Radio>
              </HStack>
            </RadioGroup>
            {options.searchPeriod.type === 'custom' && (
              <HStack mt={2} spacing={4} wrap="wrap">
                <Box>
                  <FormLabel fontSize="sm" color="gray.600">
                    Início
                  </FormLabel>
                  <Input
                    type="date"
                    value={options.searchPeriod.start || ''}
                    onChange={(e) =>
                      onOptionsChange({
                        searchPeriod: { ...options.searchPeriod, start: e.target.value },
                      })
                    }
                  />
                </Box>
                <Box>
                  <FormLabel fontSize="sm" color="gray.600">
                    Fim
                  </FormLabel>
                  <Input
                    type="date"
                    value={options.searchPeriod.end || ''}
                    onChange={(e) =>
                      onOptionsChange({
                        searchPeriod: { ...options.searchPeriod, end: e.target.value },
                      })
                    }
                  />
                </Box>
              </HStack>
            )}
          </FormControl>
        </Box>

        <Divider />

        {/* Location */}
        <Box>
          <FormControl>
            <FormLabel fontWeight="bold">Localização</FormLabel>
            <HStack spacing={4} wrap="wrap">
              <Box flex={1} minW="120px">
                <FormLabel fontSize="sm" color="gray.600">
                  Estado
                </FormLabel>
                <Select
                  placeholder="Selecione"
                  value={options.location.state || ''}
                  onChange={(e) =>
                    onOptionsChange({
                      location: { ...options.location, state: e.target.value || undefined },
                    })
                  }
                >
                  <option value="SP">São Paulo</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="BA">Bahia</option>
                  {/* expand as needed */}
                </Select>
              </Box>
              <Box flex={1} minW="120px">
                <FormLabel fontSize="sm" color="gray.600">
                  Cidade
                </FormLabel>
                <Input
                  placeholder="Opcional"
                  value={options.location.city || ''}
                  onChange={(e) =>
                    onOptionsChange({
                      location: { ...options.location, city: e.target.value || undefined },
                    })
                  }
                />
              </Box>
            </HStack>
          </FormControl>
        </Box>

        <Divider />

        {/* Working days */}
        <Box>
          <FormControl>
            <HStack mb={2}>
              <FormLabel fontWeight="bold" mb={0}>
                Dias úteis
              </FormLabel>
              <Tooltip
                label="Marque quais dias da semana contam como dia útil"
                placement="top"
              >
                <InfoIcon boxSize={4} color="gray.500" />
              </Tooltip>
            </HStack>
            <CheckboxGroup
              value={Object.keys(options.workingDays).filter(
                (k) => options.workingDays[k as keyof WorkingDays]
              )}
            >
              <HStack spacing={2} wrap="wrap">
                {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as Array<keyof WorkingDays>).map(
                  (d) => (
                    <Checkbox
                      key={d}
                      isChecked={options.workingDays[d]}
                      onChange={() => handleWorkingDayToggle(d)}
                    >
                      {d.toUpperCase().slice(0, 2)}
                    </Checkbox>
                  )
                )}
              </HStack>
            </CheckboxGroup>
            <Box fontSize="sm" color="gray.500" mt={1}>
              {workingDaysToString(options.workingDays)}
            </Box>
          </FormControl>
        </Box>

        <Divider />

        {/* Splits */}
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
                  value={options.preset}
                  onChange={(e) => onOptionsChange({ preset: e.target.value })}
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
                  value={options.customSplits}
                  onChange={(e) => onOptionsChange({ customSplits: e.target.value })}
                />
              </Box>
            </Stack>
          </FormControl>
        </Box>

        <Divider />

        {/* Bank hours */}
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
                  value={String(options.bankHours)}
                  onChange={(val) => onOptionsChange({ bankHours: Number(val) || 0 })}
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
                  value={String(options.workHoursPerDay)}
                  onChange={(val) =>
                    onOptionsChange({ workHoursPerDay: Number(val) || 8 })
                  }
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

        {/* Custom holidays button */}
        <Box>
          <Button onClick={onOpen}>Feriados personalizados ({options.customHolidays.length})</Button>
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

      {/* Modal for custom holidays */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Feriados personalizados</ModalHeader>
          <ModalBody>
            <Textarea
              placeholder="Insira datas no formato yyyy-MM-dd, separadas por vírgula ou nova linha"
              value={tempHolidays}
              onChange={(e) => setTempHolidays(e.target.value)}
              rows={6}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="brand" onClick={applyCustomHolidays}>
              Aplicar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
