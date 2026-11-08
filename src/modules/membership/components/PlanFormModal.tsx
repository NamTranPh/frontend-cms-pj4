import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ClientPlanCardPreview } from './ClientPlanCardPreview';
import type {
  MembershipPlan,
  CreatePlanRequest,
  UpdatePlanRequest,
} from '../types/plan.types';

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlanRequest | UpdatePlanRequest) => Promise<void>;
  initialData?: MembershipPlan | null;
  isLoading?: boolean;
}

export const PlanFormModal: React.FC<PlanFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEdit = Boolean(initialData);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | string>(79000);
  const [durationDays, setDurationDays] = useState<number | string>(30);
  const [maxDevices, setMaxDevices] = useState<number | string>(2);
  const [canDownload, setCanDownload] = useState(true);
  const [videoQuality, setVideoQuality] = useState('1080p');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    price?: string;
    durationDays?: string;
    maxDevices?: string;
  }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setPrice(initialData.price ?? 0);
      setDurationDays(initialData.durationDays ?? 30);
      setMaxDevices(initialData.maxDevices ?? 1);
      setCanDownload(Boolean(initialData.canDownload));
      setVideoQuality(initialData.videoQuality || '1080p');
      setDescription(initialData.description || '');
      setIsActive(initialData.isActive ?? true);
    } else {
      setName('');
      setPrice(79000);
      setDurationDays(30);
      setMaxDevices(2);
      setCanDownload(true);
      setVideoQuality('1080p');
      setDescription(
        'Không giới hạn băng thông xem phim\nƯu tiên hỗ trợ kỹ thuật 24/7\nKho phim chiếu rạp mới nhất',
      );
      setIsActive(true);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Tên gói không được để trống.';
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      newErrors.price = 'Giá tiền phải lớn hơn 0 VNĐ.';
    }
    const numDays = Number(durationDays);
    if (isNaN(numDays) || numDays <= 0) {
      newErrors.durationDays = 'Thời hạn phải lớn hơn 0 ngày.';
    }
    const numDevices = Number(maxDevices);
    if (isNaN(numDevices) || numDevices <= 0) {
      newErrors.maxDevices = 'Số thiết bị tối thiểu là 1.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (isEdit) {
      await onSubmit({
        name: name.trim(),
        price: numPrice,
        durationDays: numDays,
        maxDevices: numDevices,
        canDownload,
        videoQuality,
        description: description.trim() || undefined,
        isActive,
      } as UpdatePlanRequest);
    } else {
      await onSubmit({
        name: name.trim(),
        price: numPrice,
        durationDays: numDays,
        maxDevices: numDevices,
        canDownload,
        videoQuality,
        description: description.trim() || undefined,
      } as CreatePlanRequest);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      title={isEdit ? 'Chỉnh Sửa Gói VIP' : 'Tạo Mới Gói Thành Viên VIP'}
      description="Cấu hình thông tin quyền lợi và xem trực tiếp giao diện hiển thị cho người dùng ở cột bên phải."
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {isEdit ? 'Lưu gói VIP' : 'Tạo gói VIP'}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: FORM NHẬP LIỆU (7 CỘT) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          {/* Tên gói */}
          <div>
            <Input
              label="Tên gói VIP"
              required
              placeholder="Ví dụ: Gói Cơ Bản, Gói Tiêu Chuẩn, Gói Gia Đình 4K..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Giá tiền & Thời hạn ngày */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Giá gói (VNĐ)"
                required
                type="number"
                min={1000}
                step={1000}
                placeholder="79000"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                error={errors.price}
                disabled={isLoading}
              />
            </div>

            <div>
              <Input
                label="Thời hạn (Số ngày)"
                required
                type="number"
                min={1}
                placeholder="30"
                value={durationDays}
                onChange={(e) => {
                  setDurationDays(e.target.value);
                  if (errors.durationDays) {
                    setErrors((prev) => ({ ...prev, durationDays: undefined }));
                  }
                }}
                error={errors.durationDays}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Số thiết bị & Chất lượng Video */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Số thiết bị xem cùng lúc"
                type="number"
                min={1}
                max={10}
                placeholder="2"
                value={maxDevices}
                onChange={(e) => {
                  setMaxDevices(e.target.value);
                  if (errors.maxDevices) {
                    setErrors((prev) => ({ ...prev, maxDevices: undefined }));
                  }
                }}
                error={errors.maxDevices}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Chất lượng video tối đa
              </label>
              <select
                value={videoQuality}
                onChange={(e) => setVideoQuality(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#002b80] dark:focus:border-cyan-400"
              >
                <option value="720p HD">720p HD</option>
                <option value="1080p Full HD">1080p Full HD</option>
                <option value="2K QHD">2K QHD</option>
                <option value="4K Ultra HD">4K Ultra HD (Khuyên dùng gói VIP)</option>
              </select>
            </div>
          </div>

          {/* Cho phép tải phim & Trạng thái kích hoạt */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                className="sr-only"
                checked={canDownload}
                onChange={(e) => setCanDownload(e.target.checked)}
                disabled={isLoading}
              />
              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                  canDownload
                    ? 'bg-[#002b80] dark:bg-cyan-500 border-[#002b80] dark:border-cyan-500 shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                }`}
              >
                {canDownload && (
                  <Check
                    size={13}
                    strokeWidth={3}
                    className="text-white dark:text-slate-950"
                  />
                )}
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Cho phép tải phim ngoại tuyến (Offline Download)
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Người dùng có thể tải tập phim về máy để xem khi không có Internet.
                </p>
              </div>
            </label>

            {isEdit && (
              <label className="flex items-start gap-3 cursor-pointer select-none group pt-3 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isLoading}
                />
                <div
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                    isActive
                      ? 'bg-[#002b80] dark:bg-cyan-500 border-[#002b80] dark:border-cyan-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 group-hover:border-slate-400'
                  }`}
                >
                  {isActive && (
                    <Check
                      size={13}
                      strokeWidth={3}
                      className="text-white dark:text-slate-950"
                    />
                  )}
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Kích hoạt hiển thị ra ngoài Web Client (Active)
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Bỏ chọn nếu muốn ẩn gói này tạm thời khỏi bảng giá người xem.
                  </p>
                </div>
              </label>
            )}
          </div>

          {/* Mô tả & Đặc quyền bổ sung */}
          <div>
            <Input
              as="textarea"
              label="Đặc quyền bổ sung"
              rows={4}
              resizable={false}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ:&#10;Kho phim độc quyền cập nhật mỗi ngày&#10;Hỗ trợ phụ đề tiếng Việt & âm thanh vòm Dolby Atmos&#10;Ưu tiên đường truyền xem phim mượt mà"
              disabled={isLoading}
              helperText="💡 Mẹo: Nhấn phím Enter xuống dòng để tạo các bullet check xanh cho người dùng thấy rõ các đặc quyền hấp dẫn."
            />
          </div>
        </form>

        {/* CỘT PHẢI: LIVE CLIENT PREVIEW (5 CỘT) */}
        <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <ClientPlanCardPreview
            name={name}
            price={Number(price) || 0}
            durationDays={Number(durationDays) || 30}
            maxDevices={Number(maxDevices) || 1}
            canDownload={canDownload}
            videoQuality={videoQuality}
            description={description}
            isActive={isActive}
            highlight={true}
          />
        </div>
      </div>
    </Modal>
  );
};
