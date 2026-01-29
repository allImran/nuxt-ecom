export interface I18nMessages {
  common: {
    welcome: string
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    search: string
    filter: string
    sort: string
  }
  nav: {
    home: string
    products: string
    about: string
    contact: string
    admin: string
    cart: string
    login: string
    logout: string
  }
  auth: {
    login: string
    signup: string
    email: string
    password: string
    forgotPassword: string
    noAccount: string
    hasAccount: string
  }
  product: {
    title: string
    price: string
    description: string
    addToCart: string
    inStock: string
    outOfStock: string
    categories: string
  }
  validation: {
    required: string
    email: string
    minLength: string
    maxLength: string
  }
  errors: {
    generic: string
    network: string
    unauthorized: string
  }
}

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends I18nMessages {}
}
