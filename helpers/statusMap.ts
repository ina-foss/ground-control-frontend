export interface StatusOption {
  value: string
  label: string
  colorText: string
  colorBg: string
}

export const status_map: StatusOption[] = [
  { value: "draft", label: "Brouillon", colorText: "#FFF", colorBg: "#757575" },
  { value: "pending", label: "En attente", colorText: "#000", colorBg: "#FFE4B1" },
  { value: "in-progress", label: "En cours", colorText: "#000", colorBg: "#F9D621" },
  { value: "done", label: "Terminé", colorText: "#000", colorBg: "#9ADC82" },
  { value: "skipped", label: "Abondonné", colorText: "#FFF", colorBg: "#EF4444" },
  { value: "archived", label: "Archivé", colorText: "#000", colorBg: "#B3DDF4" },
]