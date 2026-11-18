import React from 'react';
import { DollarSign, ArrowDownRight, TrendingUp, CheckCircle2 } from 'lucide-react';
import type { AdminPaymentStatistics } from '../types/payment.types';
import { formatCurrency } from '../../../utils/formatters';

interface PaymentStatisticsCardsProps {
  stats: AdminPaymentStatistics | null;
  loading?: boolean;
}

export const PaymentStatisticsCards: React.FC<PaymentStatisticsCardsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800/40 animate-pulse border border-slate-200 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      title: 'Doanh thu gộp (Gross)',
      value: formatCurrency(stats.grossRevenue),
      subText: `${stats.completedOrders} đơn thanh toán thành công`,
      icon: TrendingUp,
      colorClass: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      iconColor: 'text-cyan-500',
    },
    {
      title: 'Tổng tiền hoàn (Refunded)',
      value: formatCurrency(stats.totalRefunded),
      subText: `${stats.refundedOrders} đơn đã hoàn tiền`,
      icon: ArrowDownRight,
      colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      iconColor: 'text-rose-500',
    },
    {
      title: 'Doanh thu thực thu (Net)',
      value: formatCurrency(stats.netRevenue),
      subText: 'Sau khi trừ toàn bộ tiền hoàn',
      icon: DollarSign,
      colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Tỷ lệ thành công',
      value: `${stats.successRate.toFixed(1)}%`,
      subText: `Tổng ${stats.totalOrders} đơn phát sinh`,
      icon: CheckCircle2,
      colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white dark:bg-[#131c2e] border border-slate-200 dark:border-[#1e293b] shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {c.title}
              </p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {c.value}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {c.subText}
              </p>
            </div>
            <div className={`p-2.5 rounded-lg border ${c.colorClass}`}>
              <Icon className={`w-5 h-5 ${c.iconColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
