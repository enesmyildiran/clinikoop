'use client'

import { useState } from 'react'
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaChevronDown, FaCheck, FaCalendar, FaTimes, FaClock, FaEdit, FaThumbtack, FaEye } from 'react-icons/fa'
import { useToast } from '@/components/ui/Toast'
import { useReminders } from '@/contexts/ReminderContext'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showPostponeModal, setShowPostponeModal] = useState(false)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<any>(null)
  const [postponeTime, setPostponeTime] = useState('10')
  const [customDays, setCustomDays] = useState('')
  const [customHours, setCustomHours] = useState('')
  const [reason, setReason] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { addToast } = useToast()
  const { todayReminders, markAsDone, postponeReminder, closeWithReason, togglePinned, pinnedReminders } = useReminders()

  // Mock data - gerçek uygulamada auth'dan gelecek
  const userInitial = 'A' // Kullanıcının baş harfi
  const userName = 'Admin User' // Kullanıcı adı

  const handleLogout = () => {
    // Logout işlemi
    addToast({
      message: 'Çıkış yapılıyor...',
      type: 'info'
    })
    // Gerçek logout işlemi burada yapılacak
  }

  const handleMarkAsDone = async (reminderId: string) => {
    await markAsDone(reminderId)
    addToast({
      message: 'Hatırlatma tamamlandı',
      type: 'success'
    })
  }

  const handlePostpone = async (reminderId: string) => {
    setSelectedReminder(todayReminders.find(r => r.id === reminderId))
    setShowPostponeModal(true)
  }

  const handlePostponeConfirm = async () => {
    if (!selectedReminder) return

    let minutes: number
    if (postponeTime === 'custom') {
      const days = parseInt(customDays) || 0
      const hours = parseInt(customHours) || 0
      
      if (days === 0 && hours === 0) {
        addToast({
          message: 'Lütfen en az 1 saat girin',
          type: 'error'
        })
        return
      }
      
      minutes = (days * 24 * 60) + (hours * 60)
    } else {
      minutes = parseInt(postponeTime)
    }

    const newDate = new Date()
    newDate.setMinutes(newDate.getMinutes() + minutes)
    
    await postponeReminder(selectedReminder.id, newDate.toISOString())
    setShowPostponeModal(false)
    setSelectedReminder(null)
    setPostponeTime('10')
    setCustomDays('')
    setCustomHours('')
    
    const timeText = postponeTime === 'custom' 
      ? `${customDays ? customDays + ' gün ' : ''}${customHours ? customHours + ' saat' : ''}`.trim()
      : `${minutes} dakika`
    
    addToast({
      message: `Hatırlatma ${timeText} ertelendi`,
      type: 'success'
    })
  }

  const handleTogglePinned = async (reminderId: string) => {
    if (isProcessing) return // Çoklu tıklamayı engelle
    
    setIsProcessing(true)
    try {
      await togglePinned(reminderId)
      addToast({
        message: 'Hatırlatma durumu güncellendi',
        type: 'success'
      })
    } catch (error) {
      addToast({
        message: 'Bir hata oluştu',
        type: 'error'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseWithReason = async (reminderId: string) => {
    setSelectedReminder(todayReminders.find(r => r.id === reminderId))
    setShowReasonModal(true)
  }

  const handleCloseWithReasonConfirm = async () => {
    if (!selectedReminder || !reason.trim()) return
    
    try {
      await closeWithReason(selectedReminder.id, reason.trim())
      addToast({
        message: 'Hatırlatma kapatıldı',
        type: 'success'
      })
      setShowReasonModal(false)
      setSelectedReminder(null)
      setReason('')
    } catch (error) {
      addToast({
        message: 'Bir hata oluştu',
        type: 'error'
      })
    }
  }

  const allReminders = [...pinnedReminders, ...todayReminders.filter(r => !pinnedReminders.find((pr: any) => pr.id === r.id))]
  const hasActiveReminders = allReminders.length > 0

  return (
    <header className={`sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Sol taraf - Boş bırakılıyor çünkü sidebar var */}
        <div className="flex-1"></div>

        {/* Sağ taraf - Bildirimler ve Profil */}
        <div className="flex items-center gap-4">
          {/* Bildirim İkonu */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Bildirimler"
            >
              <FaBell className="w-5 h-5 text-gray-600" />
              {hasActiveReminders && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></span>
              )}
            </button>

            {/* Bildirim Paneli */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Hatırlatmalar</h3>
                      <p className="text-xs text-gray-500">{allReminders.length} aktif hatırlatma</p>
                    </div>
                    <Link href="/reminders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Tümünü Gör
                    </Link>
                  </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                  {!hasActiveReminders ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <FaBell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Aktif hatırlatma yok</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {allReminders.map((reminder) => (
                        <div key={reminder.id} className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${reminder.isPinned ? 'bg-yellow-50' : ''}`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${reminder.isPinned ? 'bg-yellow-500' : 'bg-yellow-400'}`}></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-gray-900 truncate">{reminder.title}</p>
                                    {reminder.isPinned && (
                                      <FaThumbtack className="w-3 h-3 text-yellow-500 flex-shrink-0" title="Sabitlenmiş" />
                                    )}
                                  </div>
                                  {reminder.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{reminder.description}</p>
                                  )}
                                  {reminder.patient && (
                                    <p className="text-xs text-blue-600 mt-1">Hasta: {reminder.patient.name}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <FaClock className="w-3 h-3 text-gray-400" />
                                    <p className="text-xs text-gray-400">
                                      {new Date(reminder.dueDate).toLocaleString('tr-TR', { 
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Aksiyon Butonları */}
                          <div className="flex gap-1 mt-3">
                            <button
                              onClick={() => handleMarkAsDone(reminder.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Tamamla"
                            >
                              <FaCheck className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handlePostpone(reminder.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Ertele"
                            >
                              <FaCalendar className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleTogglePinned(reminder.id)}
                              disabled={isProcessing}
                              className={`p-1.5 rounded transition-colors ${reminder.isPinned ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-500 hover:bg-gray-50'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                              title={reminder.isPinned ? 'Sabitlemeyi kaldır' : 'Sabitle'}
                            >
                              <FaThumbtack className={`w-3 h-3 ${reminder.isPinned ? 'text-yellow-600' : 'text-gray-500'}`} />
                            </button>
                            <button
                              onClick={() => handleCloseWithReason(reminder.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Sebep girerek kapat"
                            >
                              <FaTimes className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profil Menüsü */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Profil menüsü"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">{userInitial}</span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">{userName}</span>
              <FaChevronDown className="w-3 h-3 text-gray-500" />
            </button>

            {/* Profil Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500">admin@clinikoop.com</p>
                </div>
                <div className="py-1">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaUserCircle className="w-4 h-4" />
                    Profil Bilgileri
                  </button>
                  <Link href="/settings" className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <FaCog className="w-4 h-4" />
                    Ayarlar
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="w-4 h-4" />
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Erteleme Modal */}
      {showPostponeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hatırlatmayı Ertele</h3>
            <p className="text-sm text-gray-600 mb-4">
              "{selectedReminder?.title}" hatırlatmasını ne kadar ertelemek istiyorsunuz?
            </p>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="10"
                  checked={postponeTime === '10'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">10 dakika</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="30"
                  checked={postponeTime === '30'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">30 dakika</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="60"
                  checked={postponeTime === '60'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">1 saat</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="postponeTime"
                  value="custom"
                  checked={postponeTime === 'custom'}
                  onChange={(e) => setPostponeTime(e.target.value)}
                  className="mr-2"
                />
                <span className="text-sm">Özel süre</span>
              </label>
              
              {postponeTime === 'custom' && (
                <div className="ml-6 mt-2 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Gün</label>
                      <input
                        type="number"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        placeholder="0"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Saat</label>
                      <input
                        type="number"
                        value={customHours}
                        onChange={(e) => setCustomHours(e.target.value)}
                        placeholder="0"
                        min="0"
                        max="23"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    En az 1 saat girmeniz gerekiyor
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handlePostponeConfirm} className="flex-1">
                Ertele
              </Button>
              <Button 
                onClick={() => {
                  setShowPostponeModal(false)
                  setSelectedReminder(null)
                  setPostponeTime('10')
                  setCustomDays('')
                  setCustomHours('')
                }} 
                variant="outline"
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Kapatma Sebebi Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hatırlatmayı Kapat</h3>
            <p className="text-sm text-gray-600 mb-4">
              "{selectedReminder?.title}" hatırlatmasını kapatmak için sebep girin:
            </p>
            
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Kapatma sebebini girin..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              rows={3}
            />
            
            <div className="flex gap-2">
              <Button 
                onClick={handleCloseWithReasonConfirm}
                disabled={!reason.trim()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Kapat
              </Button>
              <Button 
                onClick={() => {
                  setShowReasonModal(false)
                  setSelectedReminder(null)
                  setReason('')
                }} 
                variant="outline"
                className="flex-1"
              >
                İptal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay - Menüleri kapatmak için */}
      {(showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false)
            setShowProfileMenu(false)
          }}
        />
      )}
    </header>
  )
} 