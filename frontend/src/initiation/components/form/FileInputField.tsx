import React, { useState } from "react";
import { Upload, message, UploadProps, UploadFile } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { NamePath } from "antd/es/form/interface";
import { FileInputProperties } from "xingine";

const { Dragger } = Upload;

export interface FileInputFieldProps extends FileInputProperties {
  value?: string | string[];
  onChange?: (value: any) => void;
  isSubmitting?: boolean;
  parentName?: NamePath;
  label?: string;
  name?: string;
}

export const FileInputField: React.FC<FileInputFieldProps> = (props) => {
  const {
    value,
    onChange,
    isSubmitting,
    allowedFileTypes = [],
    maxFileSize,
    maxFileSizeMB,
    minFileCount = 0,
    maxFileCount = 1,
    disabled,
    placeholder = "Click or drag file to this area to upload",
    captureFilename = false,
    captureUploadPath = false,
    allowDragDrop = true,
    fileTypeValidationMessage,
    fileSizeValidationMessage,
    fileCountValidationMessage,
  } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Calculate max file size in bytes
  const maxFileSizeBytes = maxFileSizeMB
    ? maxFileSizeMB * 1024 * 1024
    : maxFileSize || 5 * 1024 * 1024; // Default 5MB

  // Validate file type
  const validateFileType = (file: File): boolean => {
    if (allowedFileTypes.length === 0) return true;

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    return allowedFileTypes.some((type) => {
      if (type.startsWith(".")) {
        // Extension check
        return fileName.endsWith(type.toLowerCase());
      } else {
        // MIME type check
        return (
          fileType === type.toLowerCase() ||
          fileType.startsWith(type.toLowerCase())
        );
      }
    });
  };

  // Validate file size
  const validateFileSize = (file: File): boolean => {
    return file.size <= maxFileSizeBytes;
  };

  // Before upload validation
  const beforeUpload = (file: File) => {
    // File type validation
    if (!validateFileType(file)) {
      const errorMsg =
        fileTypeValidationMessage ||
        `File type not allowed. Allowed types: ${allowedFileTypes.join(", ")}`;
      message.error(errorMsg);
      return false;
    }

    // File size validation
    if (!validateFileSize(file)) {
      const errorMsg =
        fileSizeValidationMessage ||
        `File size exceeds limit of ${maxFileSizeMB || Math.round(maxFileSizeBytes / 1024 / 1024)}MB`;
      message.error(errorMsg);
      return false;
    }

    // File count validation
    if (fileList.length >= maxFileCount) {
      const errorMsg =
        fileCountValidationMessage || `Maximum ${maxFileCount} file(s) allowed`;
      message.error(errorMsg);
      return false;
    }

    return false; // Prevent automatic upload, handle manually
  };

  // Handle file change
  const handleChange: UploadProps["onChange"] = (info) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);

    // Prepare value for form
    let formValue: string | string[] | undefined;

    if (newFileList.length === 0) {
      formValue = undefined;
    } else if (maxFileCount === 1) {
      const file = newFileList[0];
      if (captureFilename && captureUploadPath) {
        formValue = JSON.stringify({
          filename: file.name,
          path: file.response?.url || file.url,
          size: file.size,
        });
      } else if (captureFilename) {
        formValue = file.name;
      } else if (captureUploadPath) {
        formValue = file.response?.url || file.url || file.name;
      } else {
        formValue = file.name;
      }
    } else {
      // Multiple files
      formValue = newFileList.map((file) => {
        if (captureFilename && captureUploadPath) {
          return JSON.stringify({
            filename: file.name,
            path: file.response?.url || file.url,
            size: file.size,
          });
        } else if (captureFilename) {
          return file.name;
        } else if (captureUploadPath) {
          return file.response?.url || file.url || file.name;
        } else {
          return file.name;
        }
      });
    }

    onChange?.(formValue);
  };

  // Handle file removal
  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);

    // Update form value
    if (newFileList.length === 0) {
      onChange?.(undefined);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: maxFileCount > 1,
    fileList,
    beforeUpload,
    onChange: handleChange,
    onRemove: handleRemove,
    disabled: disabled || isSubmitting,
    accept:
      allowedFileTypes.length > 0 ? allowedFileTypes.join(",") : undefined,
  };

  if (allowDragDrop) {
    return (
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{placeholder}</p>
        {allowedFileTypes.length > 0 && (
          <p className="ant-upload-hint">
            Supported formats: {allowedFileTypes.join(", ")}
          </p>
        )}
        {maxFileSizeMB && (
          <p className="ant-upload-hint">
            Maximum file size: {maxFileSizeMB}MB
          </p>
        )}
      </Dragger>
    );
  }

  return (
    <Upload {...uploadProps}>
      <button
        type="button"
        style={{
          border: "1px dashed #d9d9d9",
          padding: "8px 16px",
          background: "transparent",
          cursor: disabled || isSubmitting ? "not-allowed" : "pointer",
        }}
        disabled={disabled || isSubmitting}
      >
        <UploadOutlined /> {placeholder}
      </button>
    </Upload>
  );
};
