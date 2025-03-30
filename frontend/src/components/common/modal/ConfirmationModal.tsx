import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React from 'react';

export const ConfirmationModal = ({
  isVisible,
  onClose,
  onOk,
}: {
  isVisible: boolean;
  onClose: () => void;
  onOk: () => void;
}) => (
  <Modal
    centered
    width={420}
    title={
      <div className="flex items-center justify-start text-xl">
        <InfoCircleOutlined className="text-primary mr-2 text-[1.5rem]" />
        <span>Confirmation</span>
      </div>
    }
    open={isVisible}
    onCancel={onClose}
    footer={[
      <div className="flex justify-end gap-3 mt-6">
        <Button
          type="default"
          variant="outlined"
          onClick={onClose}
          className="min-w-[100px] hover:border-gray-300 hover:text-black h-10"
        >
          Cancel
        </Button>
        <Button
          type="primary"
          className="bg-primary hover:bg-brightorange-6 min-w-[100px] h-10"
          onClick={onOk}
        >
          Logout
        </Button>
      </div>,
    ]}
  >
    <p className="text-left text-neutral-9 mb-2">
      Are you sure you want to logout? Your active session will be expired.
    </p>
  </Modal>
);
