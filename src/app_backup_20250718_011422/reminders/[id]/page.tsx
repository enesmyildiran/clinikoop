import { FaBell, FaUserFriends, FaCalendarAlt, FaExclamationTriangle, FaCheck, FaBell as FaBellIcon } from 'react-icons/fa'
import Link from 'next/link'

async function getReminder(id: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/reminders/${id}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Hatırlatma bulunamadı')
  const data = await res.json()
  return data.reminder
}

function getPriorityIcon(priority: string) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return <FaExclamationTriangle className="text-red-500" />
    case 'medium':
      return <FaBellIcon className="text-yellow-500" />
    case 'low':
      return <FaCheck className="text-green-500" />
    default:
      return <FaBellIcon className="text-gray-500" />
  }
}

export default async function ReminderDetailPage({ params }: { params: { id: string } }) {
  const reminder = await getReminder(params.id)

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <FaBell className="text-blue-500 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800 flex-1">{reminder.title}</h1>
        <Link href={`/reminders/${reminder.id}/edit`} className="text-yellow-500 hover:text-yellow-700 text-lg font-medium">Düzenle</Link>
      </div>
      {reminder.description && <div className="mb-4 text-gray-700">{reminder.description}</div>}
      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <FaUserFriends /> {reminder.patientName || 'Genel'}
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt /> {new Date(reminder.dueDate).toLocaleDateString('tr-TR')}
        </div>
        <div className="flex items-center gap-2">
          {getPriorityIcon(reminder.priority)} Öncelik: {reminder.priority}
        </div>
      </div>
    </div>
  )
} 