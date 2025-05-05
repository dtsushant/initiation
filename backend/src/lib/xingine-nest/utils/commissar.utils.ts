// utils/form-meta.util.ts
import 'reflect-metadata';
import { getMetadataStorage } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ComponentMeta,
  ComponentMetaMap,
  DetailMeta,
  FieldInputTypeProperties,
  FieldMeta,
  FormMeta,
  TableMeta,
  TabMeta,
} from '@xingine/core/component/component-meta-map';
import { CommissarProperties } from '@xingine/core/xingine.type';
import { FORM_FIELD_METADATA } from '@xingine/core/xingine.decorator';

function guessInputTypeFromType(type: unknown): keyof FieldInputTypeProperties {
  switch (type) {
    case String:
      return 'input';
    case Number:
      return 'number';
    case Boolean:
      return 'checkbox';
    default:
      return 'input';
  }
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function extractFieldMetaFromDirective(dtoClass: Function): FieldMeta[] {
  const metadataStorage = getMetadataStorage();

  const validations = metadataStorage.getTargetValidationMetadatas(
    dtoClass,
    '',
    false,
    false,
  );
  const groupedValidations = metadataStorage.groupByPropertyName(validations);

  const apiMetadata =
    Reflect.getMetadata('swagger/apiModelProperties', dtoClass.prototype) || {};
  const decoratorFields: FieldMeta[] =
    Reflect.getMetadata(FORM_FIELD_METADATA, dtoClass) || [];

  const combinedFieldMap: Record<string, FieldMeta> = {};

  // Step 1: Use FormField-decorated fields first
  for (const field of decoratorFields) {
    if (field && field.name) combinedFieldMap[field.name] = field;
  }

  // Step 2: Read all class properties using Reflect
  const propertyKeys = new Set<string>([
    ...Object.keys(apiMetadata),
    ...Object.keys(groupedValidations),
    ...Object.getOwnPropertyNames(new (dtoClass as any)()),
    ...Object.getOwnPropertyNames(dtoClass.prototype),
  ]);

  for (const property of propertyKeys) {
    if (combinedFieldMap[property]) continue;

    const validationTypes =
      groupedValidations[property]?.map((m) => m.type) || [];
    const required = validationTypes.includes('isNotEmpty');

    const label = apiMetadata[property]?.description || capitalize(property);

    // Reflect type fallback
    const type = Reflect.getMetadata(
      'design:type',
      dtoClass.prototype,
      property,
    );
    const inferredType = guessInputTypeFromType(type);

    combinedFieldMap[property] = {
      name: property,
      label,
      inputType: inferredType,
      required,
    };
  }

  return Object.values(combinedFieldMap);
}

const metaExtractorMap: {
  [K in keyof ComponentMetaMap]: (
    options: CommissarProperties & { commissarPath?: string },
  ) => ComponentMetaMap[K];
} = {
  FormRenderer: (options): FormMeta => {
    const fields = extractFieldMetaFromDirective(options.directive);
    return {
      action: options.commissarPath ?? '',
      fields,
    };
  },
  TableRenderer: (options): TableMeta => ({
    columns: [],
    dataSourceUrl: '',
  }),
  TabRenderer: (options): TabMeta => ({
    tabs: [],
  }),
  DetailRenderer: (options): DetailMeta => ({
    fields: [],
  }),
};

export function extractMeta(
  options: CommissarProperties,
  commissarPath?: string,
): ComponentMeta {
  const extractor = metaExtractorMap[options.operative];
  return {
    component: options.operative,
    properties: extractor({ ...options, commissarPath }),
  };
}
