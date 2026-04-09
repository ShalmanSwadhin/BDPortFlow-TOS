import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, Truck, CheckCircle, AlertCircle, TrendingUp, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner@2.0.3';

export default function TruckAppointment() {
  const { bookings, addBooking, deleteBooking, updateBooking } = useApp();
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [rescheduleBooking, setRescheduleBooking] = useState<any>(null);
  const [formData, setFormData] = useState({
    truck: '',
    container: '',
    driver: '',
    contact: '',
    operationType: 'Container Pickup',
  });

  const timeSlots = [
    { time: '08:00', available: 3, booked: 7, status: 'high' },
    { time: '08:30', available: 5, booked: 5, status: 'medium' },
    { time: '09:00', available: 2, booked: 8, status: 'high' },
    { time: '09:30', available: 4, booked: 6, status: 'medium' },
    { time: '10:00', available: 7, booked: 3, status: 'low' },
    { time: '10:30', available: 6, booked: 4, status: 'low' },
    { time: '11:00', available: 8, booked: 2, status: 'low' },
    { time: '11:30', available: 5, booked: 5, status: 'medium' },
    { time: '12:00', available: 0, booked: 10, status: 'full' },
    { time: '12:30', available: 3, booked: 7, status: 'high' },
    { time: '13:00', available: 6, booked: 4, status: 'low' },
    { time: '13:30', available: 7, booked: 3, status: 'low' },
    { time: '14:00', available: 4, booked: 6, status: 'medium' },
    { time: '14:30', available: 2, booked: 8, status: 'high' },
    { time: '15:00', available: 5, booked: 5, status: 'medium' },
    { time: '15:30', available: 8, booked: 2, status: 'low' },
  ];

  // Calculate dynamic time slots based on actual bookings
  const getDynamicTimeSlots = () => {
    const bookingsForDate = bookings.filter(b => b.date === selectedDate);
    const bookedSlots = bookingsForDate.map(b => b.slot);

    return timeSlots.map(slot => {
      const isBooked = bookedSlots.includes(slot.time);
      if (isBooked) {
        return {
          ...slot,
          available: Math.max(0, slot.available - 1),
          booked: slot.booked + 1,
          status: slot.available - 1 <= 0 ? 'full' : slot.status
        };
      }
      return slot;
    });
  };

  const dynamicTimeSlots = getDynamicTimeSlots();

  const forecastData = [
    { hour: '08:00', trucks: 23 },
    { hour: '10:00', trucks: 18 },
    { hour: '12:00', trucks: 31 },
    { hour: '14:00', trucks: 27 },
    { hour: '16:00', trucks: 22 },
    { hour: '18:00', trucks: 15 },
  ];

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.truck || !formData.container || !selectedSlot) return;

    try {
      await addBooking({
        truck: formData.truck,
        container: formData.container,
        slot: selectedSlot,
        date: selectedDate,
        status: 'Scheduled',
        driver: formData.driver,
        contact: formData.contact,
        operationType: formData.operationType,
      });

      toast.success('Booking confirmed successfully!', {
        description: `Truck ${formData.truck} scheduled for ${selectedSlot}`,
      });

      // Reset form
      setFormData({
        truck: '',
        container: '',
        driver: '',
        contact: '',
        operationType: 'Container Pickup',
      });
      setSelectedSlot(null);
    } catch (error) {
      toast.error('Failed to create booking', {
        description: 'Please try again',
      });
    }
  };

  const recentBookings = bookings.filter(b => b.date === selectedDate).slice(0, 4);

  const getSlotColor = (status: string) => {
    switch (status) {
      case 'low': return 'bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 hover:bg-yellow-500/30';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 hover:bg-orange-500/30';
      case 'full': return 'bg-red-500/20 border-red-500/50 cursor-not-allowed';
      default: return 'bg-slate-800 border-slate-700';
    }
  };

  const getSlotTextColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'full': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Truck Appointment System</h2>
          <p className="text-slate-400 text-sm sm:text-base">Schedule and manage truck arrival slots</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base">
          <Truck className="w-4 h-4" />
          <span className="whitespace-nowrap">New Booking</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Calendar className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">147</div>
          <div className="text-slate-400 text-sm">Bookings Today</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Clock className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">18 min</div>
          <div className="text-slate-400 text-sm">Avg Wait Time</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Truck className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">27</div>
          <div className="text-slate-400 text-sm">Current Queue</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">82%</div>
          <div className="text-slate-400 text-sm">Slot Utilization</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar & Slots */}
        <div className="lg:col-span-2 space-y-6">
          {/* Date Selector */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg sm:text-xl">Select Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm sm:text-base focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Quick Date Selection */}
            <div className="grid grid-cols-2 sm:flex gap-2">
              {['Today', 'Tomorrow', 'In 2 Days', 'In 3 Days'].map((label, idx) => {
                const today = new Date();
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + idx);
                const dateString = targetDate.toISOString().split('T')[0];

                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dateString)}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-sm ${
                      selectedDate === dateString
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl mb-4">Available Time Slots</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {dynamicTimeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.status !== 'full' && setSelectedSlot(slot.time)}
                  disabled={slot.status === 'full'}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedSlot === slot.time
                      ? 'ring-2 ring-emerald-400 scale-105'
                      : ''
                  } ${getSlotColor(slot.status)}`}
                >
                  <div className="text-lg text-slate-200 mb-2">{slot.time}</div>
                  <div className={`text-sm mb-1 ${getSlotTextColor(slot.status)}`}>
                    {slot.status === 'full' ? 'Full' : `${slot.available} available`}
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        slot.status === 'low' ? 'bg-emerald-500' :
                        slot.status === 'medium' ? 'bg-yellow-500' :
                        slot.status === 'high' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${(slot.booked / (slot.booked + slot.available)) * 100}%` }}
                    ></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="text-xs text-slate-400">Low (Recommended)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-xs text-slate-400">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-xs text-slate-400">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xs text-slate-400">Full</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          {selectedSlot && (
            <div className="bg-slate-900/80 backdrop-blur border-2 border-emerald-500/50 rounded-xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl text-emerald-400">Book Slot: {selectedSlot}</h3>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="p-1 hover:bg-slate-800 rounded transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleSubmitBooking} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Truck License Plate *</label>
                    <input
                      type="text"
                      required
                      value={formData.truck}
                      onChange={(e) => setFormData({ ...formData, truck: e.target.value })}
                      placeholder="DHK-GA-1234"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Container ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.container}
                      onChange={(e) => setFormData({ ...formData, container: e.target.value })}
                      placeholder="TCLU3456789"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Driver Name</label>
                    <input
                      type="text"
                      value={formData.driver}
                      onChange={(e) => setFormData({ ...formData, driver: e.target.value })}
                      placeholder="Enter driver name"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Contact Number</label>
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Operation Type</label>
                  <select
                    value={formData.operationType}
                    onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option>Container Pickup</option>
                    <option>Container Delivery</option>
                    <option>Empty Return</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                  >
                    Confirm Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSlot(null)}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Queue Forecast */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Queue Forecast</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '10px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '10px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="trucks" fill="#ffd700" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
              <div className="text-sm text-blue-400 mb-1">💡 Recommendation</div>
              <div className="text-xs text-slate-400">
                Book slots between 10:00-11:30 or after 15:30 for shortest wait times
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Recent Bookings ({recentBookings.length})</h3>
            {recentBookings.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Truck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No bookings for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">{booking.truck}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          booking.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {booking.status}
                        </span>
                        <button
                          onClick={() => {
                            if (confirm('Cancel this booking?')) {
                              deleteBooking(booking.id);
                              toast.success('Booking cancelled', {
                                description: `Booking #${booking.id} has been cancelled`,
                              });
                            }
                          }}
                          className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                          title="Cancel booking"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mb-1">{booking.container}</div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {booking.slot}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowAllBookings(true)}
                className="w-full px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors text-left"
              >
                View All Bookings ({bookings.length})
              </button>
              <button
                onClick={() => {
                  if (bookings.length > 0) {
                    if (confirm('Cancel the most recent booking?')) {
                      deleteBooking(bookings[0].id);
                    }
                  } else {
                    alert('No bookings to cancel');
                  }
                }}
                className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/50 rounded-lg transition-colors text-left"
              >
                Cancel Booking
              </button>
              <button
                onClick={() => {
                  if (bookings.length > 0) {
                    setRescheduleBooking(bookings[0]);
                  } else {
                    alert('No bookings to reschedule');
                  }
                }}
                className="w-full px-4 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-colors text-left"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View All Bookings Modal */}
      {showAllBookings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-xl text-blue-400">All Bookings ({bookings.length})</h3>
              <button
                onClick={() => setShowAllBookings(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Truck className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>No bookings found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-800">
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Truck</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Container</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Driver</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Date</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Time Slot</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Status</th>
                        <th className="text-right py-3 px-4 text-slate-400 text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-slate-200">{booking.truck}</td>
                          <td className="py-3 px-4 text-slate-200">{booking.container}</td>
                          <td className="py-3 px-4 text-slate-400">{booking.driver || 'N/A'}</td>
                          <td className="py-3 px-4 text-slate-400">{booking.date}</td>
                          <td className="py-3 px-4 text-slate-400">{booking.slot}</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => {
                                setRescheduleBooking(booking);
                                setShowAllBookings(false);
                              }}
                              className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded text-xs mr-2"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Cancel this booking?')) {
                                  deleteBooking(booking.id);
                                  setShowAllBookings(false);
                                  toast.success('Booking cancelled', {
                                    description: `Booking #${booking.id} has been cancelled`,
                                  });
                                }
                              }}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs"
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-orange-500/50 rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-orange-400">Reschedule Booking</h3>
              <button
                onClick={() => setRescheduleBooking(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="text-sm text-slate-400 mb-2">Current Booking:</div>
                <div className="text-slate-200">
                  {rescheduleBooking.truck} • {rescheduleBooking.container}
                </div>
                <div className="text-sm text-slate-500">
                  {rescheduleBooking.date} at {rescheduleBooking.slot}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">New Date</label>
                <input
                  type="date"
                  defaultValue={rescheduleBooking.date}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">New Time Slot</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-orange-500">
                  {timeSlots.filter(s => s.available > 0).map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time} ({slot.available} slots available)
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setRescheduleBooking(null)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Booking rescheduled!', {
                    description: `Updated schedule for ${rescheduleBooking.truck}`,
                  });
                  setRescheduleBooking(null);
                }}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
