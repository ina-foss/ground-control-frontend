import {useI18n} from "#imports";
export interface StatusOption {
  value: string
  label: string
  colorText: string
  colorBg: string
}
// TODO :supprimer les labels: avec l'utilisation de i18n , elles servent a rien
export const useStatusMap=(): StatusOption[] =>
{
  const { t } = useI18n()
      return [
                { value: "draft", label: t('project.status.draft'), colorText: "#FFF", colorBg: "#757575" },
                { value: "pending", label: t('project.status.pending'), colorText: "#000", colorBg: "#FFE4B1" },
                { value: "in-progress", label: t('project.status.in-progress'), colorText: "#000", colorBg: "#F9D621" },
                { value: "done", label: t('project.status.done'), colorText: "#000", colorBg: "#9ADC82" },
                { value: "skipped", label: t('project.status.skipped'), colorText: "#FFF", colorBg: "#EF4444" },
                { value: "archived", label: t('project.status.archived'), colorText: "#000", colorBg: "#B3DDF4" },
]}
