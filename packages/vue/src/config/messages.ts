import { computed, ref, type ComputedRef } from 'vue'
import { useOusiConfig } from './use-ousi-config'

/** Texts the components render on their own: placeholders, buttons and accessible names. */
export interface OusiMessages {
  selectPlaceholder: string
  options: string
  clear: string
  clearInput: string
  cancel: string
  ok: string
  loading: string
  dismiss: string
  dismissAlert: string
  closeDialog: string
  closeDrawer: string
  notifications: string
  breadcrumb: string
  pagination: string
  previousPage: string
  nextPage: string
  previous: string
  next: string
  previousMonth: string
  nextMonth: string
  previousYear: string
  nextYear: string
  calendar: string
  openCalendar: string
  datePicker: string
  dateField: string
  dateRangePicker: string
  dateRangeCalendar: string
  timePicker: string
  timeField: string
  pickTime: string
  openTimePicker: string
  now: string
  hour: string
  minute: string
  second: string
  period: string
  number: string
  increase: string
  decrease: string
  value: string
  minimum: string
  maximum: string
  otpInput: string
  rating: string
  color: string
  pickColor: string
  carousel: string
  previousSlide: string
  nextSlide: string
  commandPalette: string
  searchCommands: string
  reloadChildren: string
  before: string
  after: string
  /** File upload. `{name}`, `{size}`, `{formats}` and `{count}` are replaced. */
  dropHere: string
  chooseFile: string
  chooseFiles: string
  browseFiles: string
  acceptedFormats: string
  maxFileSize: string
  images: string
  videos: string
  audio: string
  removeFile: string
  retryUpload: string
  uploadFailed: string
  fileTypeRejected: string
  fileTooLarge: string
  tooManyFiles: string
  noResults: string
  typeToSearch: string
  moreTabs: string
}

const en: OusiMessages = {
  selectPlaceholder: 'Select an option',
  options: 'Options',
  clear: 'Clear',
  clearInput: 'Clear input',
  cancel: 'Cancel',
  ok: 'OK',
  loading: 'Loading…',
  dismiss: 'Dismiss',
  dismissAlert: 'Dismiss alert',
  closeDialog: 'Close dialog',
  closeDrawer: 'Close drawer',
  notifications: 'Notifications',
  breadcrumb: 'Breadcrumb',
  pagination: 'Pagination',
  previousPage: 'Go to previous page',
  nextPage: 'Go to next page',
  previous: 'Previous',
  next: 'Next',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  previousYear: 'Previous year',
  nextYear: 'Next year',
  calendar: 'Calendar',
  openCalendar: 'Open calendar',
  datePicker: 'Date picker',
  dateField: 'Date field',
  dateRangePicker: 'Date range picker',
  dateRangeCalendar: 'Date range calendar',
  timePicker: 'Time picker',
  timeField: 'Time field',
  pickTime: 'Pick a time',
  openTimePicker: 'Open time picker',
  now: 'Now',
  hour: 'Hour',
  minute: 'Minute',
  second: 'Second',
  period: 'AM or PM',
  number: 'Number',
  increase: 'Increase',
  decrease: 'Decrease',
  value: 'Value',
  minimum: 'Minimum',
  maximum: 'Maximum',
  otpInput: 'OTP input',
  rating: 'Rating',
  color: 'Color',
  pickColor: 'Pick a color',
  carousel: 'Carousel',
  previousSlide: 'Previous slide',
  nextSlide: 'Next slide',
  commandPalette: 'Command palette',
  searchCommands: 'Search commands',
  reloadChildren: 'Reload children',
  before: 'Before',
  after: 'After',
  dropHere: 'Drag and drop here or',
  chooseFile: 'choose a file',
  chooseFiles: 'choose files',
  browseFiles: 'Choose file',
  acceptedFormats: 'Formats: {formats}',
  maxFileSize: 'Up to {size}',
  images: 'Images',
  videos: 'Videos',
  audio: 'Audio',
  removeFile: 'Remove {name}',
  retryUpload: 'Retry',
  uploadFailed: 'Upload failed',
  fileTypeRejected: '{name}: this format is not allowed',
  fileTooLarge: '{name} is larger than {size}',
  tooManyFiles: 'You can add up to {count} files',
  noResults: 'No results found',
  typeToSearch: 'Type at least {count} characters to search',
  moreTabs: 'More',
}

const es: OusiMessages = {
  selectPlaceholder: 'Selecciona una opción',
  options: 'Opciones',
  clear: 'Limpiar',
  clearInput: 'Borrar el texto',
  cancel: 'Cancelar',
  ok: 'Aceptar',
  loading: 'Cargando…',
  dismiss: 'Cerrar',
  dismissAlert: 'Cerrar el aviso',
  closeDialog: 'Cerrar el diálogo',
  closeDrawer: 'Cerrar el panel',
  notifications: 'Notificaciones',
  breadcrumb: 'Ruta de navegación',
  pagination: 'Paginación',
  previousPage: 'Ir a la página anterior',
  nextPage: 'Ir a la página siguiente',
  previous: 'Anterior',
  next: 'Siguiente',
  previousMonth: 'Mes anterior',
  nextMonth: 'Mes siguiente',
  previousYear: 'Año anterior',
  nextYear: 'Año siguiente',
  calendar: 'Calendario',
  openCalendar: 'Abrir el calendario',
  datePicker: 'Selector de fecha',
  dateField: 'Campo de fecha',
  dateRangePicker: 'Selector de rango de fechas',
  dateRangeCalendar: 'Calendario de rango de fechas',
  timePicker: 'Selector de hora',
  timeField: 'Campo de hora',
  pickTime: 'Elegir la hora',
  openTimePicker: 'Abrir el selector de hora',
  now: 'Ahora',
  hour: 'Hora',
  minute: 'Minuto',
  second: 'Segundo',
  period: 'a. m. o p. m.',
  number: 'Número',
  increase: 'Aumentar',
  decrease: 'Disminuir',
  value: 'Valor',
  minimum: 'Mínimo',
  maximum: 'Máximo',
  otpInput: 'Código de verificación',
  rating: 'Calificación',
  color: 'Color',
  pickColor: 'Elegir un color',
  carousel: 'Carrusel',
  previousSlide: 'Diapositiva anterior',
  nextSlide: 'Diapositiva siguiente',
  commandPalette: 'Paleta de comandos',
  searchCommands: 'Buscar comandos',
  reloadChildren: 'Volver a cargar',
  before: 'Antes',
  after: 'Después',
  dropHere: 'Arrastra aquí o',
  chooseFile: 'elige un archivo',
  chooseFiles: 'elige archivos',
  browseFiles: 'Elegir archivo',
  acceptedFormats: 'Formatos: {formats}',
  maxFileSize: 'Máximo {size}',
  images: 'Imágenes',
  videos: 'Videos',
  audio: 'Audio',
  removeFile: 'Quitar {name}',
  retryUpload: 'Reintentar',
  uploadFailed: 'No se pudo subir',
  fileTypeRejected: '{name}: este formato no está permitido',
  fileTooLarge: '{name} supera {size}',
  tooManyFiles: 'Puedes agregar hasta {count} archivos',
  noResults: 'Sin resultados',
  typeToSearch: 'Escribe al menos {count} caracteres para buscar',
  moreTabs: 'Más',
}

const catalogs: Record<string, OusiMessages> = { en, es }
const overrides = ref<Partial<OusiMessages>>({})

const messages = computed<OusiMessages>(() => {
  const language = useOusiConfig().locale.value.split('-')[0].toLowerCase()
  return { ...(catalogs[language] ?? en), ...overrides.value }
})

/** The component texts for the current `locale`, with any app overrides applied. */
export function useOusiMessages(): ComputedRef<OusiMessages> {
  return messages
}

/** Internal: app-level overrides from the plugin install. */
export function applyOusiMessages(init: Partial<OusiMessages> | undefined): void {
  if (init) overrides.value = { ...init }
}
