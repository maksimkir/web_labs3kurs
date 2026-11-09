// Обгортки над PrimeVue. Решта застосунку імпортує лише їх, тож заміна
// UI-бібліотеки зачіпає один шар.
export { default as AppButton } from './AppButton/AppButton.vue'
export { default as AppInput } from './AppInput/AppInput.vue'
export { default as AppSelect } from './AppSelect/AppSelect.vue'
export { default as AppTable } from './AppTable/AppTable.vue'
export type { AppTableColumn, AppTableSortOrder } from './AppTable/types'
export { default as AppConfirmDialog } from './AppConfirmDialog/AppConfirmDialog.vue'
export { default as AppToast } from './AppToast/AppToast.vue'
export { useAppToast } from './AppToast/useAppToast'
export { default as AppPaginator } from './AppPaginator/AppPaginator.vue'
export { default as AppSearchInput } from './AppSearchInput/AppSearchInput.vue'
export { default as AppCard } from './AppCard/AppCard.vue'
export { default as AppMessage } from './AppMessage/AppMessage.vue'
export { default as AppSpinner } from './AppSpinner/AppSpinner.vue'
export { default as AppTag } from './AppTag/AppTag.vue'
export { default as AppChip } from './AppChip/AppChip.vue'

