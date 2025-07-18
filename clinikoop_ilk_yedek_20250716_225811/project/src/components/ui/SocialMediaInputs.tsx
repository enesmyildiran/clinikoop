import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/DropdownMenu";
import { FaInstagram, FaFacebook, FaXTwitter, FaLinkedin, FaWhatsapp, FaTrash } from "react-icons/fa6";

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", icon: <FaInstagram className="text-pink-500" />, placeholder: "@kullaniciadi", help: "Sadece kullanıcı adı, başında @ olmadan" },
  { key: "facebook", label: "Facebook", icon: <FaFacebook className="text-blue-600" />, placeholder: "facebook.com/kullaniciadi", help: "Profil linki veya kullanıcı adı" },
  { key: "x", label: "X (Twitter)", icon: <FaXTwitter className="text-black" />, placeholder: "@kullaniciadi", help: "Sadece kullanıcı adı, başında @ olmadan" },
  { key: "linkedin", label: "LinkedIn", icon: <FaLinkedin className="text-blue-700" />, placeholder: "linkedin.com/in/kullaniciadi", help: "Profil linki veya kullanıcı adı" },
  { key: "whatsapp", label: "Whatsapp", icon: <FaWhatsapp className="text-green-500" />, placeholder: "+905xxxxxxxxx", help: "Telefon numarası, başında +90 ile" },
];

export function SocialMediaInputs({ value, onChange }: {
  value: Record<string, string>,
  onChange: (v: Record<string, string>) => void
}) {
  const [open, setOpen] = useState(false);

  // value: { instagram: "", facebook: "", ... }
  const handleAdd = (platform: string) => {
    if (!value[platform]) {
      onChange({ ...value, [platform]: "" });
    }
    setOpen(false);
  };

  const handleRemove = (platform: string) => {
    const newValue = { ...value };
    delete newValue[platform];
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              Sosyal Medya Ekle
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {SOCIAL_PLATFORMS.filter(p => !(p.key in value)).map((platform) => (
              <DropdownMenuItem
                key={platform.key}
                onClick={() => handleAdd(platform.key)}
                className="flex items-center gap-2"
              >
                {platform.icon}
                {platform.label}
              </DropdownMenuItem>
            ))}
            {Object.keys(value).length === SOCIAL_PLATFORMS.length && (
              <DropdownMenuItem disabled>Tüm platformlar eklendi</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Object.entries(value).map(([platform, username]) => {
          const meta = SOCIAL_PLATFORMS.find(p => p.key === platform);
          return (
            <div key={platform} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="shrink-0">{meta?.icon}</span>
                <Input
                  className="flex-1"
                  placeholder={meta?.placeholder || meta?.label}
                  value={username}
                  onChange={e => onChange({ ...value, [platform]: e.target.value })}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemove(platform)}
                  aria-label="Sil"
                >
                  <FaTrash className="text-red-500" />
                </Button>
              </div>
              {meta?.help && (
                <span className="text-xs text-gray-500 ml-7">{meta.help}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 