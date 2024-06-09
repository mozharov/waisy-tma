import {retrieveLaunchParams} from '@tma.js/sdk-react'
import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'

const resources = {
  en: {
    translation: {
      add_note: 'Add a note',
      unknown_error: 'Something went wrong',
      notes: 'Notes',
      empty_notes: "You don't have any notes about this user",
      empty_public_notes: 'There are no public notes about this user',
      public_page: 'Public page',
      not_found: 'Contact not found',
      sure_delete: 'Are you sure you want to delete this note?',
      delete: 'Delete',
      public_note: 'Public',
      make_public: 'Make page public before sharing',
      share_text: 'There is my notes about ',
      share_text_end: 'this user.',
      share: 'Share',
      public_notes: "Someone's public notes about this user",
      my_notes: 'Open my notes',
      all_public_notes: 'Open all public notes',
    },
  },
  ru: {
    translation: {
      add_note: 'Добавить заметку',
      unknown_error: 'Что-то пошло не так',
      notes: 'Заметки',
      empty_notes: 'У тебя нет заметок об этом пользователе',
      empty_public_notes: 'Нет публичных заметок об этом пользователе',
      public_page: 'Публичная страница',
      not_found: 'Контакт не найден',
      sure_delete: 'Вы уверены, что хотите удалить эту заметку?',
      delete: 'Удалить',
      public_note: 'Публичная',
      make_public: 'Сначала сделай страницу публичной',
      share_text: 'Это мои заметки о ',
      share_text_end: 'пользователе.',
      share: 'Поделиться',
      public_notes: 'Чьи-то публичные заметки об этом пользователе',
      my_notes: 'Открыть мои заметки',
      all_public_notes: 'Открыть все публичные заметки',
    },
  },
}

const {initData} = retrieveLaunchParams()

void i18n.use(initReactI18next).init({
  resources,
  lng: initData?.user?.languageCode === 'ru' ? 'ru' : 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})

export default i18n
