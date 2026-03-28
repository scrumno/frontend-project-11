import i18next from 'i18next'
import { subscribeKey } from 'valtio/vanilla/utils'

/**
 * Слой View: валидация, ошибки загрузки/парсинга, успех — в одном .feedback (тесты Hexlet).
 */
export const initFormView = (state, { input, feedback, submitBtn, form }) => {
  const syncFeedback = () => {
    const err = state.form.errorKey
    const load = state.ui.loadErrorKey
    const ok = state.ui.successKey

    if (err) {
      input.classList.add('is-invalid')
      feedback.textContent = i18next.t(err)
      feedback.className = 'feedback mb-2 text-danger'
      return
    }

    input.classList.remove('is-invalid')

    if (load) {
      feedback.textContent = i18next.t(load)
      feedback.className = 'feedback mb-2 text-danger'
      return
    }

    if (ok) {
      feedback.textContent = i18next.t(ok)
      feedback.className = 'feedback mb-2 text-success'
      return
    }

    feedback.textContent = ''
    feedback.className = 'feedback mb-2'
  }

  const syncLoading = (loading) => {
    submitBtn.disabled = loading
    input.disabled = loading
    form.setAttribute('aria-busy', loading ? 'true' : 'false')
  }

  subscribeKey(state.form, 'errorKey', syncFeedback)
  subscribeKey(state.ui, 'loadErrorKey', syncFeedback)
  subscribeKey(state.ui, 'successKey', syncFeedback)
  subscribeKey(state.ui, 'loading', syncLoading)

  syncFeedback()
  syncLoading(state.ui.loading)

  i18next.on('languageChanged', syncFeedback)
}
