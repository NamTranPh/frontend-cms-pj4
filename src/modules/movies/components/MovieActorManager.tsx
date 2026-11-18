import {
  Clapperboard,
  Edit3,
  Hash,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Avatar } from '../../../components/ui/Avatar';
import { adminActorService } from '../../actors/services/adminActorService';
import type { ActorItem } from '../../actors/types/actor.types';
import type { MovieActorAssignment } from '../types/movie.types';

interface MovieActorManagerProps {
  value: MovieActorAssignment[];
  onChange: (actors: MovieActorAssignment[]) => void;
}

export const MovieActorManager: React.FC<MovieActorManagerProps> = ({
  value,
  onChange,
}) => {
  // Trạng thái mở Modal chuyên biệt
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);

  // Danh sách diễn viên hệ thống
  const [actorsList, setActorsList] = useState<ActorItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingActors, setIsLoadingActors] = useState(false);

  // Form thêm diễn viên mới vào phim (bên trong modal)
  const [selectedActorId, setSelectedActorId] = useState('');
  const [newCharacterName, setNewCharacterName] = useState('');

  // Dialog chỉnh sửa vai diễn & thứ tự (bên trong modal)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editCharacterName, setEditCharacterName] = useState('');
  const [editOrderIndex, setEditOrderIndex] = useState(1);

  // Quick Add Actor Modal (tạo nhanh hồ sơ diễn viên mới vào CSDL nếu chưa có)
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newActorName, setNewActorName] = useState('');
  const [newActorOriginalName, setNewActorOriginalName] = useState('');
  const [newActorNationality, setNewActorNationality] = useState('Việt Nam');
  const [isSubmittingQuickActor, setIsSubmittingQuickActor] = useState(false);

  // Fetch danh sách diễn viên khi modal mở hoặc khi tìm kiếm
  useEffect(() => {
    let isMounted = true;
    const fetchActors = async () => {
      setIsLoadingActors(true);
      try {
        const res = await adminActorService.getActors({
          limit: 100,
          search: searchTerm.trim() || undefined,
        });
        if (isMounted) {
          setActorsList(res.items || []);
        }
      } catch {
        if (isMounted) setActorsList([]);
      } finally {
        if (isMounted) setIsLoadingActors(false);
      }
    };

    fetchActors();
    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  // Map id -> ActorItem để hiển thị tên, avatar, quốc tịch
  const actorMap = React.useMemo(() => {
    const map = new Map<string, ActorItem>();
    actorsList.forEach((a) => map.set(a.id, a));
    return map;
  }, [actorsList]);

  // Thêm diễn viên vào danh sách phim
  const handleAddActorToMovie = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedActorId) return;
    if (value.some((a) => a.actorId === selectedActorId)) return;

    const newAssignment: MovieActorAssignment = {
      actorId: selectedActorId,
      characterName: newCharacterName.trim(),
      orderIndex: value.length + 1,
    };
    onChange([...value, newAssignment]);
    setSelectedActorId('');
    setNewCharacterName('');
  };

  // Mở dialog sửa vai diễn
  const handleOpenEditModal = (index: number) => {
    const assignment = value[index];
    if (!assignment) return;
    setEditingIndex(index);
    setEditCharacterName(assignment.characterName || '');
    setEditOrderIndex(assignment.orderIndex || index + 1);
  };

  // Lưu chỉnh sửa vai diễn & thứ tự
  const handleSaveEdit = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (editingIndex === null || !value[editingIndex]) return;

    const updated = [...value];
    updated[editingIndex] = {
      ...updated[editingIndex],
      characterName: editCharacterName.trim(),
      orderIndex: Number(editOrderIndex) || 1,
    };
    onChange(updated);
    setEditingIndex(null);
  };

  // Xóa diễn viên khỏi phim
  const handleRemoveActor = (index: number) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Thêm nhanh diễn viên mới nếu chưa có trong DB
  const handleCreateQuickActor = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!newActorName.trim()) return;

    setIsSubmittingQuickActor(true);
    try {
      const created = await adminActorService.createActor({
        name: newActorName.trim(),
        originalName: newActorOriginalName.trim() || undefined,
        nationality: newActorNationality.trim() || undefined,
      });
      setActorsList((prev) => [created, ...prev]);
      const newAssignment: MovieActorAssignment = {
        actorId: created.id,
        characterName: '',
        orderIndex: value.length + 1,
      };
      onChange([...value, newAssignment]);
      setIsQuickAddOpen(false);
      setNewActorName('');
      setNewActorOriginalName('');
    } catch {
      // Có lỗi thì giữ form mở
    } finally {
      setIsSubmittingQuickActor(false);
    }
  };

  const currentEditingAssignment =
    editingIndex !== null ? value[editingIndex] : null;
  const currentEditingActor = currentEditingAssignment
    ? actorMap.get(currentEditingAssignment.actorId)
    : null;

  return (
    <>
      {/* ============================================================== */}
      {/* 1. KHU VỰC TÓM TẮT TRONG FORM CHÍNH (SIÊU GỌN GÀNG, KHÔNG DÀI) */}
      {/* ============================================================== */}
      <div className="space-y-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-500" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Dàn diễn viên & Vai diễn ({value.length})
            </h4>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsManagerModalOpen(true)}
            className="h-7 text-xs gap-1.5 font-medium border-cyan-500/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 cursor-pointer"
          >
            <Clapperboard className="w-3.5 h-3.5 text-cyan-500" />
            <span>Quản lý dàn diễn viên ({value.length})</span>
          </Button>
        </div>

        {/* Danh sách thẻ Chip/Pill tóm tắt */}
        {value.length === 0 ? (
          <div
            onClick={() => setIsManagerModalOpen(true)}
            className="py-2.5 px-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400/50 transition-colors cursor-pointer text-center"
          >
            Chưa có diễn viên nào được gán. Nhấn vào đây để thêm vai diễn cho phim.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {value.map((item, index) => {
              const actor = actorMap.get(item.actorId);
              return (
                <div
                  key={item.actorId}
                  className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200"
                >
                  {/* Avatar tròn nhỏ */}
                  <Avatar
                    src={actor?.avatarUrl}
                    name={actor?.name}
                    size="xs"
                    shape="circle"
                  />

                  {/* Tên diễn viên & vai diễn */}
                  <span className="font-medium">
                    {actor?.name || 'Diễn viên #' + item.actorId.slice(0, 5)}
                  </span>
                  {item.characterName && (
                    <span className="text-[11px] text-cyan-600 dark:text-cyan-400">
                      ({item.characterName})
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-1 rounded">
                    #{item.orderIndex || index + 1}
                  </span>

                  {/* Nút gỡ nhanh */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveActor(index);
                    }}
                    className="p-0.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ml-0.5 cursor-pointer"
                    title="Gỡ khỏi phim"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 2. MODAL CHUYÊN BIỆT: QUẢN LÝ DÀN DIỄN VIÊN & VAI DIỄN         */}
      {/* ============================================================== */}
      {isManagerModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsManagerModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Quản lý Dàn diễn viên & Vai diễn
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gán diễn viên, đặt tên nhân vật và thứ tự xuất hiện ({value.length} diễn viên)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManagerModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Box Thêm diễn viên vào phim */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Thêm diễn viên vào phim
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsQuickAddOpen(!isQuickAddOpen)}
                    className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo hồ sơ diễn viên mới</span>
                  </button>
                </div>

                {/* Subform Tạo nhanh nếu cần */}
                {isQuickAddOpen && (
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-2 animate-in fade-in">
                    <div className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      Tạo nhanh diễn viên chưa có trong cơ sở dữ liệu:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        type="text"
                        placeholder="Tên diễn viên *"
                        required
                        value={newActorName}
                        onChange={(e) => setNewActorName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCreateQuickActor();
                          }
                        }}
                        className="text-xs h-8.5"
                      />
                      <Input
                        type="text"
                        placeholder="Tên gốc (nếu có)"
                        value={newActorOriginalName}
                        onChange={(e) => setNewActorOriginalName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCreateQuickActor();
                          }
                        }}
                        className="text-xs h-8.5"
                      />
                      <div className="flex gap-1.5">
                        <Input
                          type="text"
                          placeholder="Quốc tịch"
                          value={newActorNationality}
                          onChange={(e) => setNewActorNationality(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCreateQuickActor();
                            }
                          }}
                          className="text-xs h-8.5 flex-1"
                        />
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={handleCreateQuickActor}
                          className="h-8.5 px-3 text-xs shrink-0 cursor-pointer"
                          disabled={isSubmittingQuickActor}
                        >
                          {isSubmittingQuickActor ? 'Lưu...' : 'Lưu'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Các ô gán diễn viên */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6 relative flex gap-1.5">
                    <select
                      value={selectedActorId}
                      onChange={(e) => setSelectedActorId(e.target.value)}
                      className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
                    >
                      <option value="">
                        {isLoadingActors
                          ? 'Đang tải danh sách diễn viên...'
                          : '-- Chọn diễn viên cần gán --'}
                      </option>
                      {actorsList
                        .filter((a) => !value.some((item) => item.actorId === a.id))
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} {a.originalName ? `(${a.originalName})` : ''}{' '}
                            {a.nationality ? `[${a.nationality}]` : ''}
                          </option>
                        ))}
                    </select>

                    <div className="relative w-28 shrink-0">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Tìm lọc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-9 pl-7 pr-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Tên vai diễn (VD: Tony Stark)..."
                      value={newCharacterName}
                      onChange={(e) => setNewCharacterName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddActorToMovie();
                        }
                      }}
                      className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddActorToMovie()}
                      disabled={!selectedActorId}
                      className="w-full h-9 text-xs font-semibold gap-1 justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Gán vào</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Danh sách diễn viên đã gán */}
              {value.length === 0 ? (
                <div className="py-10 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20">
                  <User className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Phim này chưa có diễn viên nào
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hãy chọn diễn viên từ thanh phía trên để thêm vào dàn cast.
                  </p>
                </div>
              ) : (
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40">
                  {/* Header cột */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <div className="col-span-5">Diễn viên</div>
                    <div className="col-span-4">Vai diễn trong phim</div>
                    <div className="col-span-1 text-center">Thứ tự</div>
                    <div className="col-span-2 text-right">Thao tác</div>
                  </div>

                  {/* Danh sách các dòng */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-72 overflow-y-auto">
                    {value.map((assignment, index) => {
                      const actor = actorMap.get(assignment.actorId);
                      return (
                        <div
                          key={assignment.actorId}
                          className="grid grid-cols-12 gap-2 items-center px-4 py-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors text-xs"
                        >
                          {/* Diễn viên */}
                          <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                            <Avatar
                              src={actor?.avatarUrl}
                              name={actor?.name}
                              size="sm"
                              shape="circle"
                            />
                            <div className="min-w-0">
                              <div
                                className="font-semibold text-slate-800 dark:text-slate-200 truncate"
                                title={actor?.name}
                              >
                                {actor?.name ||
                                  'Diễn viên #' + assignment.actorId.slice(0, 6)}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {actor?.nationality || 'Chưa cập nhật quốc tịch'}
                                {actor?.originalName ? ` • ${actor.originalName}` : ''}
                              </div>
                            </div>
                          </div>

                          {/* Vai diễn */}
                          <div className="col-span-4 min-w-0">
                            {assignment.characterName ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-500/20 truncate max-w-full">
                                <Clapperboard className="w-3 h-3 text-cyan-500 shrink-0" />
                                <span className="truncate">
                                  {assignment.characterName}
                                </span>
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic">
                                Chưa đặt tên vai
                              </span>
                            )}
                          </div>

                          {/* Thứ tự */}
                          <div className="col-span-1 text-center">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              #{assignment.orderIndex || index + 1}
                            </span>
                          </div>

                          {/* Thao tác trực tiếp (Sửa & Xóa) */}
                          <div className="col-span-2 flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(index)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-colors cursor-pointer"
                              title="Sửa vai diễn & thứ tự"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveActor(index)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Xóa khỏi phim"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Tổng cộng: <strong className="text-slate-800 dark:text-slate-200">{value.length}</strong> diễn viên
              </span>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsManagerModalOpen(false)}
                className="cursor-pointer"
              >
                Hoàn tất & Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. DIALOG CON: CẬP NHẬT VAI DIỄN & THỨ TỰ CHO 1 DIỄN VIÊN      */}
      {/* ============================================================== */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setEditingIndex(null)}
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <Avatar
                  src={currentEditingActor?.avatarUrl}
                  name={currentEditingActor?.name}
                  size="sm"
                  shape="circle"
                />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Cập nhật vai diễn trong phim
                  </h3>
                  <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                    {currentEditingActor?.name || 'Diễn viên'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingIndex(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Clapperboard className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Tên nhân vật / Vai diễn trong phim</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Tony Stark, Peter Parker, Điệp viên 007..."
                  value={editCharacterName}
                  onChange={(e) => setEditCharacterName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveEdit();
                    }
                  }}
                  autoFocus
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <p className="text-[11px] text-slate-400">
                  Tên nhân vật mà diễn viên này hóa thân và xuất hiện trong bộ phim.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Hash className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Thứ tự ưu tiên hiển thị (1 - 99)</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={editOrderIndex}
                  onChange={(e) =>
                    setEditOrderIndex(parseInt(e.target.value, 10) || 1)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSaveEdit();
                    }
                  }}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <p className="text-[11px] text-slate-400">
                  Số nhỏ hơn sẽ đứng trước (Ví dụ: 1 là vai chính xuất hiện đầu dàn cast).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingIndex(null)}
                  className="cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSaveEdit}
                  className="cursor-pointer"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
