import React from "react";
import { FieldType } from "../Fields";

import Date from "../Fields/Date";
import Rating from "../Fields/Rating";
import CheckBox from "../Fields/CheckBox";
import UrlLink from "../Fields/UrlLink";

import { Editors } from "react-data-grid-addons";
import MultiSelect from "../Fields/MultiSelect";
import Image from "../Fields/Image";
import File from "../Fields/File";
import LongText from "../Fields/LongText";
import DocSelect from "../Fields/DocSelect";

import { algoliaUpdateDoc } from "../../firebase/callables";

const { AutoComplete } = Editors;

export const editable = (fieldType: FieldType) => {
  switch (fieldType) {
    case FieldType.date:
    case FieldType.dateTime:
    case FieldType.rating:
    case FieldType.checkBox:
    case FieldType.multiSelect:
    case FieldType.image:
    case FieldType.file:
    case FieldType.longText:
    case FieldType.documentSelect:
      return false;
    default:
      return true;
  }
};
export const onSubmit = (key: string, row: any) => async (value: any) => {
  const collection = row.ref.parent.path;
  const data = { collection, id: row.ref.id, doc: { [key]: value } };
  if (value !== null || value !== undefined) {
    row.ref.update({ [key]: value });
    const callableRes = await algoliaUpdateDoc(data);
    console.log(callableRes);
  }
};

export const DateFormatter = (key: string, fieldType: FieldType) => (
  props: any
) => {
  return (
    <Date
      {...props}
      onSubmit={onSubmit(key, props.row)}
      fieldType={fieldType}
    />
  );
};

export const onGridRowsUpdated = (props: any) => {
  const { fromRowData, updated } = props;
  onSubmit(Object.keys(updated)[0], fromRowData)(Object.values(updated)[0]);
};
export const onCellSelected = (args: any) => {
  console.log(args);
};
export const cellFormatter = (column: any) => {
  const { type, key, options } = column;
  switch (type) {
    case FieldType.date:
    case FieldType.dateTime:
      return DateFormatter(key, type);
    case FieldType.rating:
      return (props: any) => {
        return (
          <Rating
            {...props}
            onSubmit={onSubmit(key, props.row)}
            value={typeof props.value === "number" ? props.value : 0}
          />
        );
      };
    case FieldType.checkBox:
      return (props: any) => {
        return <CheckBox {...props} onSubmit={onSubmit(key, props.row)} />;
      };
    case FieldType.url:
      return (props: any) => {
        return <UrlLink {...props} />;
      };
    case FieldType.multiSelect:
      return (props: any) => {
        return (
          <MultiSelect
            {...props}
            onSubmit={onSubmit(key, props.row)}
            options={options}
          />
        );
      };
    case FieldType.image:
      return (props: any) => {
        return (
          <Image
            {...props}
            onSubmit={onSubmit(key, props.row)}
            fieldName={key}
          />
        );
      };
    case FieldType.file:
      return (props: any) => {
        return (
          <File
            {...props}
            onSubmit={onSubmit(key, props.row)}
            fieldName={key}
          />
        );
      };
    case FieldType.longText:
      return (props: any) => {
        return <LongText {...props} onSubmit={onSubmit(key, props.row)} />;
      };

    default:
      return false;
  }
};

export const singleSelectEditor = (options: string[]) => {
  if (options) {
    const _options = options.map(option => ({
      id: option,
      value: option,
      title: option,
      text: option,
    }));
    return <AutoComplete options={_options} />;
  }

  return <AutoComplete options={[]} />;
};