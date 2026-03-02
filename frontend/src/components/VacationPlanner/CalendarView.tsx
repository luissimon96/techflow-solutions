import React, { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWeekend, isSameMonth } from 'date-fns';
import {
  Box,
  Grid,
  GridItem,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Select,
  Heading,
} from '@chakra-ui/react';

const MONTH_NAMES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

const DAY_NAMES = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export interface CalendarViewProps {
  year: number;
  month: number;
  holidays: Set<string>;
  selectedStart?: string;
  selectedEnd?: string;
  onSelect?: (start: string, end: string) => void;
}

export function CalendarView({
  year,
  month,
  holidays,
  selectedStart,
  selectedEnd,
  onSelect,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [selectMode, setSelectMode] = useState<'start' | 'end' | null>(null);
  const [tempStart, setTempStart] = useState<string | null>(selectedStart || null);
  const [tempEnd, setTempEnd] = useState<string | null>(selectedEnd || null);

  const monthStart = startOfMonth(new Date(year, currentMonth, 1));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fill in days from previous/next month for grid alignment
  const firstDayOfWeek = monthStart.getDay();
  const prevMonthDays = Array(firstDayOfWeek).fill(null).map(() => null);

  const allDays = [...prevMonthDays, ...days];

  const monthName = `${MONTH_NAMES[currentMonth]} ${year}`;

  const handleDayClick = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');

    if (selectMode === 'start') {
      setTempStart(dateStr);
      setSelectMode('end');
    } else if (selectMode === 'end') {
      if (tempStart && dateStr >= tempStart) {
        setTempEnd(dateStr);
        if (onSelect) {
          onSelect(tempStart, dateStr);
        }
        setSelectMode(null);
      } else {
        setTempStart(dateStr);
      }
    } else {
      setTempStart(dateStr);
      setSelectMode('start');
    }
  };

  const isInRange = (day: Date) => {
    if (!tempStart || !tempEnd) return false;
    const dateStr = format(day, 'yyyy-MM-dd');
    return dateStr >= tempStart && dateStr <= tempEnd;
  };

  const isHoliday = (day: Date) => {
    return holidays.has(format(day, 'yyyy-MM-dd'));
  };

  return (
    <Box borderWidth={1} borderRadius="lg" p={6} bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="md">{monthName}</Heading>
          <HStack spacing={2}>
            <Button
              size="sm"
              onClick={() => setCurrentMonth((m) => (m - 1 < 0 ? 11 : m - 1))}
            >
              ← Anterior
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentMonth((m) => (m + 1 > 11 ? 0 : m + 1))}
            >
              Próximo →
            </Button>
          </HStack>
        </HStack>

        <Box>
          <HStack spacing={2} mb={4}>
            <Badge colorScheme="blue">Seleção: {selectMode ? selectMode : 'não iniciada'}</Badge>
            {tempStart && <Text fontSize="sm">Início: {tempStart}</Text>}
            {tempEnd && <Text fontSize="sm">Fim: {tempEnd}</Text>}
          </HStack>

          <Grid templateColumns="repeat(7, 1fr)" gap={1} mb={4}>
            {/* Day headers */}
            {DAY_NAMES.map((d) => (
              <GridItem key={d} textAlign="center" fontWeight="bold" fontSize="sm" py={2}>
                {d}
              </GridItem>
            ))}

            {/* Days */}
            {allDays.map((day, idx) => {
              const isCurrentMonth = day ? isSameMonth(day, monthStart) : false;
              const dateStr = day ? format(day, 'yyyy-MM-dd') : '';
              const isSelected =
                (tempStart === dateStr || tempEnd === dateStr) && isCurrentMonth;
              const isInSelectedRange = day && isInRange(day);
              const isHolidayDay = day && isHoliday(day);
              const isWeekendDay = day && isWeekend(day);

              return (
                <GridItem key={idx}>
                  <Button
                    w="full"
                    h="12"
                    fontSize="sm"
                    onClick={() => day && handleDayClick(day)}
                    isDisabled={!isCurrentMonth}
                    bg={
                      isSelected
                        ? 'brand.500'
                        : isInSelectedRange
                          ? 'brand.100'
                          : isHolidayDay
                            ? 'yellow.100'
                            : isWeekendDay && isCurrentMonth
                              ? 'gray.100'
                              : 'white'
                    }
                    color={
                      isSelected
                        ? 'white'
                        : isHolidayDay || isWeekendDay
                          ? 'gray.600'
                          : 'black'
                    }
                    borderColor={isCurrentMonth ? 'gray.300' : 'transparent'}
                    borderWidth={1}
                    _hover={
                      isCurrentMonth
                        ? { bg: isSelected ? 'brand.600' : 'brand.50', cursor: 'pointer' }
                        : {}
                    }
                    opacity={isCurrentMonth ? 1 : 0.4}
                  >
                    <VStack spacing={0.5}>
                      <Text>{day ? format(day, 'd') : ''}</Text>
                      {isHolidayDay && (
                        <Text fontSize="xs" color="red.600">
                          Feriado
                        </Text>
                      )}
                    </VStack>
                  </Button>
                </GridItem>
              );
            })}
          </Grid>

          <Text fontSize="sm" color="gray.600" textAlign="center">
            Clique em um dia para iniciar seleção. Clique novamente para finalizar.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
