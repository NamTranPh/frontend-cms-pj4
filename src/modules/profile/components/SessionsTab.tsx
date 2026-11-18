import {
  Globe,
  Laptop,
  RefreshCw,
  Smartphone,
  Trash2,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../components/feedback";
import { Button } from "../../../components/ui/Button";
import { authService } from "../../auth/services/authService";
import { profileService } from "../services/profileService";
import type { SessionResult } from "../types/profile.types";
import { ROUTES } from "../../../config/routes.config";

export const SessionsTab: React.FC = () => {
  const toast = useToast();
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevokingOther, setIsRevokingOther] = useState(false);

  const fetchSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await profileService.getSessions();
      setSessions(Array.isArray(res) ? res : []);
      const sessionList = Array.isArray(res) ? res : [];
      setSessions(sessionList);

      // Nếu có danh sách phiên trả về mà không có phiên nào là current: true
      // Nghĩa là phiên của thiết bị hiện tại đã bị thu hồi từ thiết bị khác!
      if (sessionList.length > 0 && !sessionList.some((s) => s.current)) {
        toast.warning(
          "Phiên của thiết bị này đã bị thu hồi từ nơi khác. Đang đăng xuất...",
          "Hết phiên",
        );
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }, 1200);
      }
    } catch {
      toast.error("Không thể tải danh sách phiên đăng nhập", "Lỗi");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await profileService.revokeSession(sessionId);
      toast.success("Đã đăng xuất phiên thiết bị này", "Thành công");
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi khi thu hồi phiên";
      toast.error(msg, "Lỗi");
    }
  };

  const handleRevokeOtherSessions = async () => {
    setIsRevokingOther(true);
    try {
      await profileService.revokeOtherSessions();
      toast.success(
        "Đã đăng xuất khỏi tất cả các thiết bị khác!",
        "Thành công",
      );
      await fetchSessions();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Không thể đăng xuất các thiết bị khác";
      toast.error(msg, "Lỗi");
    } finally {
      setIsRevokingOther(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Thiết Bị Đang Đăng Nhập
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Danh sách các trình duyệt và thiết bị đang đăng nhập vào tài khoản
            của bạn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSessions}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới"
          >
            <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
          </button>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRevokeOtherSessions}
            disabled={isRevokingOther || sessions.length <= 1}
            className="text-xs gap-1.5 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>
              {isRevokingOther ? "Đang xử lý..." : "Đăng xuất thiết bị khác"}
            </span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw size={24} className="animate-spin text-cyan-500 mb-2" />
          <p className="text-xs">Đang tải danh sách thiết bị...</p>
        </div>
      ) : sessions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Không tìm thấy phiên đăng nhập nào khác.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((sess) => {
            const isMobile =
              sess.userAgent.toLowerCase().includes("mobile") ||
              sess.userAgent.toLowerCase().includes("android") ||
              sess.userAgent.toLowerCase().includes("iphone");

            return (
              <div
                key={sess.sessionId}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                  sess.current
                    ? "bg-cyan-500/5 border-cyan-500/30 dark:bg-cyan-500/10"
                    : "bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      sess.current
                        ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {isMobile ? <Smartphone size={20} /> : <Laptop size={20} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {sess.userAgent.slice(0, 50)}...
                      </span>
                      {sess.current && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          Thiết bị này
                        </span>
                      )}
                      {sess.admin && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                          Admin Portal
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        IP: {sess.ipAddress}
                      </span>
                      <span>•</span>
                      <span>
                        Hoạt động gần nhất:{" "}
                        {new Date(sess.lastUsedAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (sess.current) {
                        authService.logout().finally(() => {
                          localStorage.removeItem("accessToken");
                          window.location.href = ROUTES.PUBLIC.LOGIN;
                        });
                      } else {
                        handleRevokeSession(sess.sessionId);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30 transition-all cursor-pointer flex items-center gap-1"
                    title="Đăng xuất thiết bị này"
                  >
                    <Trash2 size={13} />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
