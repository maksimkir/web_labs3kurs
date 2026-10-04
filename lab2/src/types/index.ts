/** Спільні типи та enum-и застосунку */
export enum ModalType {
  Confirm = 'confirm',
  Info = 'info',
  Prompt = 'prompt',
}

export interface AppConfig {
  maxBooksPerUser: number;
  pageSize: number;
  paginationThreshold: number;
}

export const APP_CONFIG: AppConfig = {
  maxBooksPerUser: 3,
  pageSize: 5,
  paginationThreshold: 40,
};
