import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React from 'react';

export const ForgotPasswordModal = ({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose: () => void;
}) => (
  <Modal
    width={450}
    centered
    title={
      <div className="flex items-center justify-start text-xl">
        <InfoCircleOutlined className="text-primary mr-2 text-[1.5rem]" />
        <span>Forgot Password</span>
      </div>
    }
    open={isVisible}
    onCancel={onClose}
    footer={[
      <Button
        key="close"
        onClick={onClose}
        type="primary"
        className="bg-primary hover:bg-brightorange-6 h-10"
      >
        Close
      </Button>,
    ]}
  >
    <p className="text-left text-neutral-9">
      This feature will be available soon. Please contact your administrator for
      assistance.
    </p>
  </Modal>
);
