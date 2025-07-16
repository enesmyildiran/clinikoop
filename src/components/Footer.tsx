import { FaHeart, FaGithub, FaEnvelope } from 'react-icons/fa'

interface FooterProps {
  className?: string
}

export default function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const version = 'v1.0.0'

  return (
    <footer className={`bg-white border-t border-gray-200 py-4 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Sol taraf - Copyright */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>© {currentYear} Clinikoop</span>
            <span className="hidden sm:inline">-</span>
            <span className="hidden sm:inline">Diş Klinikleri için Hasta Teklif Yönetimi</span>
            <span className="flex items-center gap-1 text-red-500">
              <FaHeart className="w-3 h-3" />
            </span>
          </div>

          {/* Orta - Versiyon */}
          <div className="text-sm text-gray-500">
            {version}
          </div>

          {/* Sağ taraf - Destek ve İletişim */}
          <div className="flex items-center gap-4 text-sm">
            <a 
              href="mailto:support@clinikoop.com" 
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
              title="Destek E-posta"
            >
              <FaEnvelope className="w-3 h-3" />
              <span className="hidden sm:inline">Destek</span>
            </a>
            <a 
              href="https://github.com/clinikoop" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
              title="GitHub"
            >
              <FaGithub className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 