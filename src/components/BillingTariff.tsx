import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { billingAPI } from '../api/client';
import ModuleInfoPanel, { MODULE_INFO } from './ModuleInfoPanel';
import { CreditCard, DollarSign, FileText, Download, Search, Filter, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

function mapInvoice(inv: any) {
  const services = inv.services || [];
  const storage = services.find((s: any) => s.description?.toLowerCase().includes('storage'))?.amount || services[0]?.amount || 0;
  const handling = services.find((s: any) => s.description?.toLowerCase().includes('handling'))?.amount || services[1]?.amount || 0;
  const demurrage = services.find((s: any) => s.description?.toLowerCase().includes('demurrage'))?.amount || 0;
  return {
    id: inv.invoiceNumber,
    _id: inv._id,
    container: inv.containerId || '—',
    client: inv.customerName,
    date: inv.issueDate ? new Date(inv.issueDate).toISOString().split('T')[0] : '—',
    storage,
    handling,
    demurrage,
    total: inv.total,
    status: (inv.status || 'Pending').toLowerCase(),
    days: inv.dwellDays || 0,
    raw: inv,
  };
}

export default function BillingTariff() {
  const { invoices: rawInvoices, refreshAllData, isLoading } = useApp();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryForm, setEntryForm] = useState({
    customerName: '',
    companyName: '',
    customerEmail: '',
    serviceType: 'Handling',
    invoiceAmount: '',
    paymentAmount: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    paymentDate: '',
    containerId: '',
  });
  const [submittingEntry, setSubmittingEntry] = useState(false);
  const [entryErrors, setEntryErrors] = useState<Record<string, string>>({});

  const invoices = useMemo(() => rawInvoices.map(mapInvoice), [rawInvoices]);

  const filteredInvoices = useMemo(() => {
    if (!search) return invoices;
    const q = search.toLowerCase();
    return invoices.filter(i =>
      i.id.toLowerCase().includes(q) ||
      i.client.toLowerCase().includes(q) ||
      i.container.toLowerCase().includes(q)
    );
  }, [invoices, search]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthInvoices = rawInvoices.filter((inv: any) => {
      const d = new Date(inv.issueDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthRevenue = monthInvoices
      .filter((i: any) => i.status === 'Paid')
      .reduce((s: number, i: any) => s + (i.paymentAmount || i.total || 0), 0);
    const outstanding = monthInvoices
      .filter((i: any) => i.status !== 'Paid' && i.status !== 'Cancelled')
      .reduce((s: number, i: any) => s + (i.dueAmount ?? i.total ?? 0), 0);
    const paid = monthInvoices.filter((i: any) => i.status === 'Paid').length;
    const unpaid = monthInvoices.filter((i: any) => i.status === 'Pending' || i.status === 'Overdue').length;
    const demurrage = invoices.reduce((s, i) => s + i.demurrage, 0);
    return { monthRevenue, count: monthInvoices.length, demurrage, pending: unpaid, outstanding, paid, unpaid };
  }, [rawInvoices, invoices]);

  const revenueData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return months.slice(Math.max(0, now.getMonth() - 5), now.getMonth() + 1).map((month, i) => ({
      month,
      revenue: i === months.slice(Math.max(0, now.getMonth() - 5), now.getMonth() + 1).length - 1
        ? Math.round(stats.monthRevenue / 1000 * 10) / 10
        : Math.round((stats.monthRevenue / 1000) * (0.6 + i * 0.08) * 10) / 10,
    }));
  }, [stats.monthRevenue]);

  const handleCreateBillingEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseFloat(entryForm.invoiceAmount);
    const paid = parseFloat(entryForm.paymentAmount) || 0;
    const errors: Record<string, string> = {};
    if (!entryForm.customerName.trim()) errors.customerName = 'Customer name is required';
    if (!entryForm.customerEmail.trim()) errors.customerEmail = 'Customer email is required';
    if (!total || Number.isNaN(total)) errors.invoiceAmount = 'Invoice amount is required';
    setEntryErrors(errors);
    if (Object.keys(errors).length) {
      toast.error('Billing validation failed', {
        description: Object.values(errors).join(', '),
      });
      return;
    }
    try {
      setSubmittingEntry(true);
      const dueDate = new Date(entryForm.invoiceDate);
      dueDate.setDate(dueDate.getDate() + 30);
      await billingAPI.create({
        customerName: entryForm.customerName.trim(),
        companyName: entryForm.companyName.trim() || undefined,
        customerEmail: entryForm.customerEmail.trim(),
        containerId: entryForm.containerId.trim() || undefined,
        serviceType: entryForm.serviceType,
        services: [{
          description: `${entryForm.serviceType} Charges`,
          quantity: 1,
          rate: total,
          amount: total,
        }],
        subtotal: total,
        tax: Math.round(total * 0.05),
        total: total + Math.round(total * 0.05),
        paymentAmount: paid,
        dueAmount: Math.max(0, total + Math.round(total * 0.05) - paid),
        status: paid >= total ? 'Paid' : 'Pending',
        issueDate: entryForm.invoiceDate,
        dueDate: dueDate.toISOString(),
        paidDate: entryForm.paymentDate || undefined,
        paymentMethod: paid > 0 ? 'Bank Transfer' : undefined,
      });
      toast.success('Billing entry created');
      setShowEntryForm(false);
      setEntryErrors({});
      setEntryForm({
        customerName: '', companyName: '', customerEmail: '', serviceType: 'Handling',
        invoiceAmount: '', paymentAmount: '', invoiceDate: new Date().toISOString().split('T')[0],
        paymentDate: '', containerId: '',
      });
      await refreshAllData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create billing entry');
    } finally {
      setSubmittingEntry(false);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      setGenerating(true);
      const issueDate = new Date();
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      const subtotal = 730;
      const tax = Math.round(subtotal * 0.05);
      await billingAPI.create({
        customerName: 'Terminal Customer',
        customerEmail: 'billing@portflow.bd',
        containerId: rawInvoices[0]?.containerId || 'TCLU0000001',
        serviceType: 'Handling',
        services: [
          { description: 'Storage Fees', quantity: 3, rate: 150, amount: 450 },
          { description: 'Handling Fees', quantity: 1, rate: 280, amount: 280 },
        ],
        subtotal,
        tax,
        total: subtotal + tax,
        paymentAmount: 0,
        dueAmount: subtotal + tax,
        status: 'Pending',
        issueDate: issueDate.toISOString(),
        dueDate: dueDate.toISOString(),
      });
      toast.success('Invoice generated successfully');
      await refreshAllData();
    } catch (err: any) {
      toast.error('Failed to generate invoice', {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async (invoice: any) => {
    try {
      setDownloading(true);
      const res = await billingAPI.downloadPDF(invoice._id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success('Invoice downloaded', { description: `${invoice.id}.pdf saved` });
    } catch (err: any) {
      toast.error('Failed to download PDF', {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading && !invoices.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

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
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowEntryForm(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base"
          >
            <CreditCard className="w-4 h-4" />
            <span className="whitespace-nowrap">Add Billing Entry</span>
          </button>
          <button
            onClick={handleGenerateInvoice}
            disabled={generating}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base disabled:opacity-50"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            <span className="whitespace-nowrap">Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <DollarSign className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">${(stats.monthRevenue / 1000).toFixed(1)}K</div>
          <div className="text-slate-400 text-sm">Revenue This Month</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <FileText className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">{stats.count}</div>
          <div className="text-slate-400 text-sm">Invoices Generated</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">${(stats.demurrage / 1000).toFixed(1)}K</div>
          <div className="text-slate-400 text-sm">Demurrage Revenue</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <CreditCard className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">{stats.unpaid}</div>
          <div className="text-slate-400 text-sm">Unpaid Invoices</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Outstanding Receivables</div>
          <div className="text-xl text-orange-400">${stats.outstanding.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Paid Invoices (This Month)</div>
          <div className="text-xl text-emerald-400">{stats.paid}</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <div className="text-sm text-slate-400 mb-1">Total Monthly Revenue</div>
          <div className="text-xl text-blue-400">${stats.monthRevenue.toLocaleString()}</div>
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
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                {filteredInvoices.map((invoice) => (
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
            <span className="text-xs sm:text-sm text-slate-400">Showing {filteredInvoices.length} of {invoices.length} invoices</span>
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
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  disabled={downloading}
                  className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                >
                  {downloading ? <Loader2 className="w-4 h-4 text-slate-400 animate-spin" /> : <Download className="w-4 h-4 text-slate-400" />}
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
                    onClick={() => handleDownloadPDF(selectedInvoice)}
                    disabled={downloading}
                    className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    Download PDF
                  </button>
                  {selectedInvoice.status === 'pending' && (
                    <button
                      onClick={async () => {
                        try {
                          await billingAPI.markAsPaid(selectedInvoice._id, 'Bank Transfer');
                          toast.success('Payment recorded', { description: `Invoice ${selectedInvoice.id} marked as paid` });
                          await refreshAllData();
                        } catch (err: any) {
                          toast.error('Failed to mark as paid', { description: err.response?.data?.message || err.message });
                        }
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

      {showEntryForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl text-blue-400 mb-4">Add Billing Entry</h3>
            <form onSubmit={handleCreateBillingEntry} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required placeholder="Customer Name" value={entryForm.customerName}
                onChange={e => setEntryForm({ ...entryForm, customerName: e.target.value })}
                className={`px-4 py-2 bg-slate-800 border rounded-lg text-slate-100 ${entryErrors.customerName ? 'border-red-500' : 'border-slate-700'}`} />
              <input placeholder="Company Name" value={entryForm.companyName}
                onChange={e => setEntryForm({ ...entryForm, companyName: e.target.value })}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100" />
              <input required type="email" placeholder="Customer Email" value={entryForm.customerEmail}
                onChange={e => setEntryForm({ ...entryForm, customerEmail: e.target.value })}
                className={`px-4 py-2 bg-slate-800 border rounded-lg text-slate-100 ${entryErrors.customerEmail ? 'border-red-500' : 'border-slate-700'}`} />
              <select value={entryForm.serviceType}
                onChange={e => setEntryForm({ ...entryForm, serviceType: e.target.value })}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100">
                <option>Container Storage</option>
                <option>Handling</option>
                <option>Reefer</option>
                <option>Berth</option>
                <option>Rail Service</option>
                <option>Other</option>
              </select>
              <input required type="number" placeholder="Invoice Amount" value={entryForm.invoiceAmount}
                onChange={e => setEntryForm({ ...entryForm, invoiceAmount: e.target.value })}
                className={`px-4 py-2 bg-slate-800 border rounded-lg text-slate-100 ${entryErrors.invoiceAmount ? 'border-red-500' : 'border-slate-700'}`} />
              <input type="number" placeholder="Payment Amount" value={entryForm.paymentAmount}
                onChange={e => setEntryForm({ ...entryForm, paymentAmount: e.target.value })}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100" />
              <input type="date" value={entryForm.invoiceDate}
                onChange={e => setEntryForm({ ...entryForm, invoiceDate: e.target.value })}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100" />
              <input type="date" placeholder="Payment Date" value={entryForm.paymentDate}
                onChange={e => setEntryForm({ ...entryForm, paymentDate: e.target.value })}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100" />
              <input placeholder="Container ID (optional)" value={entryForm.containerId}
                onChange={e => setEntryForm({ ...entryForm, containerId: e.target.value })}
                className="md:col-span-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100" />
              <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEntryForm(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg">Cancel</button>
                <button type="submit" disabled={submittingEntry}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50">
                  {submittingEntry ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ModuleInfoPanel content={MODULE_INFO.billing} />
    </div>
  );
}
