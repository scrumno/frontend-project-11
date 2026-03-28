/** Ошибка с i18n-ключом для отображения в UI (сеть, парсинг и т.д.) */
export class AppError extends Error {
  constructor(key) {
    super(key)
    this.name = 'AppError'
    this.key = key
  }
}
