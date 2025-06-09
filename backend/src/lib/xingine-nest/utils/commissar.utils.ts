// utils/form-meta.util.ts
import 'reflect-metadata';
import { getMetadataStorage } from 'class-validator';

import {
  COLUMN_PROPERTY_METADATA,
  CommissarProperties,
  DETAIL_FIELD_METADATA,
  FORM_FIELD_METADATA,
} from 'xingine';

import { extractChartMetaFromDirective } from './commissar.charts';
import {
  FieldInputTypeProperties,
  FieldMeta,
} from 'xingine/dist/core/component/form-meta-map';
import {
  DetailFieldMeta,
  DetailInputTypeProperties,
} from 'xingine/dist/core/component/detail-meta-map';
import {
  ChartMeta,
  ColumnMeta,
  ComponentMeta,
  ComponentMetaMap,
  DetailDispatchProperties,
  DetailMeta,
  FormDispatchProperties,
  FormMeta,
  TabDispatchProperties,
  TableDispatchProperties,
  TableMeta,
  TabMeta,
} from 'xingine/dist/core/component/component-meta-map';

function guessInputTypeFromType(type: unknown): keyof FieldInputTypeProperties {
  if (type === String) return 'input';
  if (type === Number) return 'number';
  if (type === Boolean) return 'checkbox';

  if (typeof type === 'function') {
    if (type.name === 'Array') {
      return 'object[]'; // fallback; refine if needed
    }
    return 'object'; // fallback for class constructor
  }

  return 'input';
}

function guessDetailTypeFromType(
  type: unknown,
): keyof DetailInputTypeProperties {
  if (type === String) return 'text';
  if (type === Number) return 'number';
  if (type === Boolean) return 'checkbox';

  if (typeof type === 'function') {
    if (type.name === 'Array') {
      return 'object[]'; // fallback; refine if needed
    }
    return 'object'; // fallback for class constructor
  }

  return 'text';
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

    const fieldMeta: FieldMeta = {
      name: property,
      label,
      inputType: inferredType,
      required,
    };

    // Handle nested object
    if (inferredType === 'object') {
      fieldMeta.properties = {
        fields: extractFieldMetaFromDirective(type as new () => any),
      };
    } else if (inferredType === 'object[]') {
      const listType = Reflect.getMetadata(
        'design:elementtype',
        dtoClass.prototype,
        property,
      ); // optional
      if (listType) {
        fieldMeta.properties = {
          itemFields: extractFieldMetaFromDirective(listType as new () => any),
        };
      } else {
        fieldMeta.properties = {
          itemFields: [], // fallback
        };
      }
    }
    combinedFieldMap[property] = fieldMeta;
  }

  return Object.values(combinedFieldMap);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function extractDetailFieldMetaFromDirective(
  dtoClass: Function,
): DetailFieldMeta[] {
  const apiMetadata =
    Reflect.getMetadata('swagger/apiModelProperties', dtoClass.prototype) || {};
  const decoratorFields: DetailFieldMeta[] =
    Reflect.getMetadata(DETAIL_FIELD_METADATA, dtoClass) || [];

  const combinedFieldMap: Record<string, DetailFieldMeta> = {};

  // Step 1: Use FormField-decorated fields first
  for (const field of decoratorFields) {
    if (field && field.name) combinedFieldMap[field.name] = field;
  }

  // Step 2: Read all class properties using Reflect
  const propertyKeys = new Set<string>([
    ...Object.keys(apiMetadata),
    ...Object.getOwnPropertyNames(new (dtoClass as any)()),
    ...Object.getOwnPropertyNames(dtoClass.prototype),
  ]);

  for (const property of propertyKeys) {
    if (combinedFieldMap[property]) continue;

    const label = apiMetadata[property]?.description || capitalize(property);

    // Reflect type fallback
    const type = Reflect.getMetadata(
      'design:type',
      dtoClass.prototype,
      property,
    );
    const inferredType = guessDetailTypeFromType(type);
    console.log('the inferredType', inferredType);

    /*const fieldMeta: FieldMeta = {
      name: property,
      label,
      inputType: inferredType,
      required,
    };*/
    const detailMeta: DetailFieldMeta = {
      name: property,
      label,
      inputType: inferredType,
    };

    // Handle nested object
    if (inferredType === 'object') {
      detailMeta.properties = {
        fields: extractDetailFieldMetaFromDirective(type as new () => any),
      };
    } else if (inferredType === 'object[]') {
      const listType = Reflect.getMetadata(
        'design:elementtype',
        dtoClass.prototype,
        property,
      ); // optional
      if (listType) {
        detailMeta.properties = {
          itemFields: extractDetailFieldMetaFromDirective(
            listType as new () => any,
          ),
        };
      } else {
        detailMeta.properties = {
          itemFields: [], // fallback
        };
      }
    }
    combinedFieldMap[property] = detailMeta;
  }
  return Object.values(combinedFieldMap);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function extractTableMetaFromDirective(
  dtoClass: Function,
): ColumnMeta[] {
  const apiMetadata =
    Reflect.getMetadata('swagger/apiModelProperties', dtoClass.prototype) || {};

  const combinedColumnMap: Record<string, ColumnMeta> = {};

  const decoratedColumnField: ColumnMeta[] =
    Reflect.getMetadata(COLUMN_PROPERTY_METADATA, dtoClass) || [];

  const columns: ColumnMeta[] = [];

  const propertyKeys = new Set<string>([
    ...Object.keys(apiMetadata),
    ...Object.getOwnPropertyNames(new (dtoClass as any)()),
    ...Object.getOwnPropertyNames(dtoClass.prototype),
  ]);

  for (const field of decoratedColumnField) {
    if (field && field.dataIndex) combinedColumnMap[field.dataIndex] = field;
  }

  for (const prop of propertyKeys) {
    if (combinedColumnMap[prop]) continue;

    const columnDetail = {
      title: apiMetadata[prop]?.description || capitalize(prop),
      dataIndex: prop,
      key: prop,
    };
    combinedColumnMap[prop] = columnDetail;
  }

  return Object.values(combinedColumnMap);
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
      fields: fields,
      dispatch: options.dispatch
        ? (options.dispatch as FormDispatchProperties)
        : undefined,
    };
  },
  TableRenderer: (options): TableMeta => ({
    columns: extractTableMetaFromDirective(options.directive),
    dataSourceUrl: options.commissarPath ?? '',
    dispatch: options.dispatch
      ? (options.dispatch as TableDispatchProperties)
      : undefined,
  }),
  TabRenderer: (options): TabMeta => ({
    tabs: [],
    dispatch: options.dispatch
      ? (options.dispatch as TabDispatchProperties)
      : undefined,
  }),
  DetailRenderer: (options): DetailMeta => ({
    fields: extractDetailFieldMetaFromDirective(options.directive),
    action: options.commissarPath ?? '',
    dispatch: options.dispatch
      ? (options.dispatch as DetailDispatchProperties)
      : undefined,
  }),
  ChartRenderer: (options): ChartMeta => {
    return extractChartMetaFromDirective(options.directive);
  },
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
