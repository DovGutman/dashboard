import { BadRequestException } from '@nestjs/common';

export const isBlank = (value?: string | null): boolean =>
  !value || value.trim().length === 0;

export const parseOptionalEnum = <T extends Record<string, number | string>>(
  value: string | undefined,
  enumObj: T,
  name: string,
): T[keyof T] | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new BadRequestException(`Invalid ${name} value.`);
  }

  const validValues = new Set(
    Object.values(enumObj).filter((entry) => typeof entry === 'number'),
  );

  if (!validValues.has(parsed)) {
    throw new BadRequestException(`Invalid ${name} value.`);
  }

  return parsed as T[keyof T];
};
