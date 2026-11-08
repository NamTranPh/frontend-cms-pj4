import React from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { ClientPlanCardPreview } from './ClientPlanCardPreview';
import type { MembershipPlan } from '../types/plan.types';

interface PlanPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: MembershipPlan | null;
  onEdit?: (plan: MembershipPlan) => void;
}

export const PlanPreviewModal: React.FC<PlanPreviewModalProps> = ({
  isOpen,
  onClose,
  plan,
  onEdit,
}) => {
  if (!plan) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      title={`Xem Trước Giao Diện: ${plan.name}`}
      description="Định dạng thẻ gói VIP hiển thị trực tiếp cho khách hàng trên ứng dụng Web Client."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Mã định danh: <code className="font-mono">{plan.slug}</code>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Đóng
            </Button>
            {onEdit && (
              <Button
                variant="primary"
                onClick={() => {
                  onClose();
                  onEdit(plan);
                }}
              >
                Chỉnh sửa gói
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="py-2 flex justify-center">
        <ClientPlanCardPreview
          name={plan.name}
          price={plan.price}
          durationDays={plan.durationDays}
          maxDevices={plan.maxDevices}
          canDownload={plan.canDownload}
          videoQuality={plan.videoQuality}
          description={plan.description}
          isActive={plan.isActive}
          highlight={true}
        />
      </div>
    </Modal>
  );
};
