import { useState } from 'react';
import { CreditCard, DollarSign, FileText, Download, Search, Filter, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

export default function BillingTariff() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const invoices = [
    {
      id: 'INV-2024-001247',
      container: 'TCLU3456789',
      client: 'Maersk Line',
      date: '2024-11-28',
      storage: 450.00,
      handling: 280.00,
      demurrage: 0,
      total: 730.00,
      status: 'paid',
      days: 3,
    },
    {
      id: 'INV-2024-001248',
      container: 'YMMU8901234',
      client: 'MSC Mediterranean',
      date: '2024-11-28',
      storage: 600.00,
      handling: 320.00,
      demurrage: 850.00,
      total: 1770.00,
      status: 'pending',
      days: 7,
    },
    {
      id: 'INV-2024-001249',
      container: 'MAEU5678901',
      client: 'COSCO Shipping',
      date: '2024-11-27',
      storage: 300.00,
      handling: 240.00,
      demurrage: 0,
      total: 540.00,
      status: 'paid',
      days: 2,
    },
    {
      id: 'INV-2024-001250',
      container: 'CSQU2345678',
      client: 'CMA CGM',
      date: '2024-11-27',
      storage: 750.00,
      handling: 350.00,
      demurrage: 1200.00,
      total: 2300.00,
      status: 'overdue',
      days: 9,
    },
    {
      id: 'INV-2024-001251',
      container: 'HLBU7890123',
      client: 'Hapag-Lloyd',
      date: '2024-11-26',
      storage: 450.00,
      handling: 280.00,
      demurrage: 0,
      total: 730.00,
      status: 'paid',
      days: 3,
    },
  ];

  const revenueData = [
    { month: 'Jun', revenue: 42.5 },
    { month: 'Jul', revenue: 38.2 },
    { month: 'Aug', revenue: 45.8 },
    { month: 'Sep', revenue: 52.1 },
    { month: 'Oct', revenue: 48.3 },
    { month: 'Nov', revenue: 55.7 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Billing & Tariff Engine</h2>
          <p className="text-slate-400 text-sm sm:text-base">Automated invoicing and payment tracking</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base">
          <FileText className="w-4 h-4" />
          <span className="whitespace-nowrap">Generate Invoice</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <DollarSign className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">$55.7K</div>
          <div className="text-slate-400 text-sm">Revenue This Month</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <FileText className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">247</div>
          <div className="text-slate-400 text-sm">Invoices Generated</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">$12.3K</div>
          <div className="text-slate-400 text-sm">Demurrage Revenue</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <CreditCard className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">18</div>
          <div className="text-slate-400 text-sm">Pending Payments</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoices Table */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg sm:text-xl">Recent Invoices</h3>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors">
                <Filter className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-slate-400 text-sm">Invoice ID</th>
                  <th className="px-4 py-3 text-left text-slate-400 text-sm">Client</th>
                  <th className="px-4 py-3 text-left text-slate-400 text-sm">Container</th>
                  <th className="px-4 py-3 text-left text-slate-400 text-sm">Date</th>
                  <th className="px-4 py-3 text-left text-slate-400 text-sm">Amount</th>
                  <th className="px-4 py-3 text-left text-slate-400 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    onClick={() => setSelectedInvoice(invoice)}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-slate-200">{invoice.id}</td>
                    <td className="px-4 py-3 text-slate-300">{invoice.client}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{invoice.container}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{invoice.date}</td>
                    <td className="px-4 py-3 text-slate-200">${invoice.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-800">
            <span className="text-xs sm:text-sm text-slate-400">Showing 1-5 of 247 invoices</span>
            <div className="flex gap-2">
              <button className="px-2 sm:px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors text-xs sm:text-sm">
                Previous
              </button>
              <button className="px-2 sm:px-3 py-1 bg-emerald-500 text-white rounded text-xs sm:text-sm">1</button>
              <button className="px-2 sm:px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors text-xs sm:text-sm">
                2
              </button>
              <button className="px-2 sm:px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded transition-colors text-xs sm:text-sm">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Detail / Revenue Chart */}
        <div className="space-y-6">
          {/* Selected Invoice */}
          {selectedInvoice ? (
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg">Invoice Details</h3>
                <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Status Badge */}
                <div className={`p-4 rounded-lg border ${getStatusColor(selectedInvoice.status)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Payment Status</span>
                    <span className="uppercase text-sm">{selectedInvoice.status}</span>
                  </div>
                </div>

                {/* Invoice Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Invoice ID</span>
                    <span className="text-slate-200 text-sm">{selectedInvoice.id}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Client</span>
                    <span className="text-slate-200 text-sm">{selectedInvoice.client}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Container</span>
                    <span className="text-slate-200 text-sm">{selectedInvoice.container}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Date</span>
                    <span className="text-slate-200 text-sm">{selectedInvoice.date}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400 text-sm">Dwell Time</span>
                    <span className="text-slate-200 text-sm">{selectedInvoice.days} days</span>
                  </div>
                </div>

                {/* Charges Breakdown */}
                <div className="border-t border-slate-800 pt-4">
                  <div className="text-sm text-slate-400 mb-3">Charges</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Storage Fees</span>
                      <span className="text-slate-200">${selectedInvoice.storage.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Handling Fees</span>
                      <span className="text-slate-200">${selectedInvoice.handling.toFixed(2)}</span>
                    </div>
                    {selectedInvoice.demurrage > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-orange-400">Demurrage</span>
                        <span className="text-orange-400">${selectedInvoice.demurrage.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t border-slate-800 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-200">Total</span>
                        <span className="text-xl text-emerald-400">${selectedInvoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      toast.success('Invoice downloaded', {
                        description: `${selectedInvoice.id}.pdf saved to your device`,
                      });
                    }}
                    className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  {selectedInvoice.status === 'pending' && (
                    <button 
                      onClick={() => {
                        toast.success('Payment recorded', {
                          description: `Invoice ${selectedInvoice.id} marked as paid`,
                        });
                      }}
                      className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
                    >
                      Mark as Paid
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg mb-4">Select an Invoice</h3>
              <div className="h-48 sm:h-64 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-xs sm:text-sm">Click on an invoice to view details</p>
                </div>
              </div>
            </div>
          )}

          {/* Revenue Chart */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg mb-4">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`$${value}K`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#00ff88" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-400">November Growth</span>
                <span className="text-emerald-400">+15.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tariff Structure */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Current Tariff Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="text-slate-300 mb-3">Storage Fees</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Days 1-3:</span>
                <span className="text-slate-200">$150/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Days 4-7:</span>
                <span className="text-slate-200">$200/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Day 8+:</span>
                <span className="text-orange-400">$300/day</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="text-slate-300 mb-3">Handling Fees</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Standard 20':</span>
                <span className="text-slate-200">$240</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Standard 40':</span>
                <span className="text-slate-200">$320</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reefer +20%:</span>
                <span className="text-blue-400">Variable</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <h4 className="text-slate-300 mb-3">Demurrage</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Free Days:</span>
                <span className="text-emerald-400">5 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Day 6-10:</span>
                <span className="text-orange-400">$150/day</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Day 11+:</span>
                <span className="text-red-400">$250/day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
