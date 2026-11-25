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
  /** `{page}` and `{total}` are replaced. */
  pageOf: string
  /** `{page}` is replaced. */
  goToPage: string
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
  year: string
  month: string
  day: string
  yearPlaceholder: string
  monthPlaceholder: string
  dayPlaceholder: string
  dateRangePicker: string
  rangeStartPart: string
  rangeEndPart: string
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
  browseFilesMultiple: string
  removeFile: string
  cancelUpload: string
  retryUpload: string
  uploadFailed: string
  uploading: string
  fileUploaded: string
  fileTypeRejected: string
  fileTooLarge: string
  tooManyFiles: string
  maxFilesHint: string
  duplicateFile: string
  processing: string
  processingFailed: string
  couldNotReduce: string
  wasSize: string
  awaitingApproval: string
  useNewVersion: string
  keepOriginal: string
  originalTooLarge: string
  compare: string
  compareTitle: string
  originalVersion: string
  newVersion: string
  actualSize: string
  discardFile: string
  pendingFiles: string
  /** Image editor. `{size}` is replaced. */
  editImage: string
  cropArea: string
  cropHint: string
  aspectRatio: string
  freeRatio: string
  rotateLeft: string
  rotateRight: string
  flipHorizontal: string
  flipVertical: string
  zoom: string
  resetEdit: string
  maxSide: string
  fullSize: string
  outputFormat: string
  automaticFormat: string
  quality: string
  calculating: string
  stillOverLimit: string
  cannotOpenImage: string
  save: string
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
  pageOf: 'Page {page} of {total}',
  goToPage: 'Go to page {page}',
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
  year: 'Year',
  month: 'Month',
  day: 'Day',
  yearPlaceholder: 'yyyy',
  monthPlaceholder: 'mm',
  dayPlaceholder: 'dd',
  dateRangePicker: 'Date range picker',
  rangeStartPart: 'Start {part}',
  rangeEndPart: 'End {part}',
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
  browseFilesMultiple: 'Choose files',
  removeFile: 'Remove {name}',
  cancelUpload: 'Cancel the upload of {name}',
  retryUpload: 'Retry',
  uploadFailed: 'Upload failed',
  uploading: 'Uploading…',
  fileUploaded: 'File uploaded',
  fileTypeRejected: '{name}: this format is not allowed',
  fileTooLarge: '{name} is larger than {size}',
  tooManyFiles: 'You can add up to {count} files',
  maxFilesHint: '{count} files at most',
  duplicateFile: '{name} is already in the list',
  processing: 'Processing…',
  processingFailed: '{name} could not be processed',
  couldNotReduce: '{name} could not be brought under {size}',
  wasSize: 'was {size}',
  awaitingApproval: 'waiting for your approval',
  useNewVersion: 'Use new version',
  keepOriginal: 'Keep original',
  originalTooLarge: 'The original is over {size}',
  compare: 'Compare',
  compareTitle: 'Compare {name}',
  originalVersion: 'Original',
  newVersion: 'New version',
  actualSize: 'Actual size',
  discardFile: 'Discard {name}',
  pendingFiles: 'Finish with the pending files first',
  editImage: 'Edit image',
  cropArea: 'Crop area',
  cropHint: 'Arrow keys move it, Shift with the arrows resizes it, plus and minus zoom.',
  aspectRatio: 'Shape',
  freeRatio: 'Free',
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
  flipHorizontal: 'Flip horizontally',
  flipVertical: 'Flip vertically',
  zoom: 'Zoom',
  resetEdit: 'Reset',
  maxSide: 'Longest side',
  fullSize: 'Full size',
  outputFormat: 'Format',
  automaticFormat: 'Automatic',
  quality: 'Quality',
  calculating: 'Calculating…',
  stillOverLimit: 'still over {size}',
  cannotOpenImage: 'This image cannot be opened here',
  save: 'Save',
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
  pageOf: 'Página {page} de {total}',
  goToPage: 'Ir a la página {page}',
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
  year: 'Año',
  month: 'Mes',
  day: 'Día',
  yearPlaceholder: 'aaaa',
  monthPlaceholder: 'mm',
  dayPlaceholder: 'dd',
  dateRangePicker: 'Selector de rango de fechas',
  rangeStartPart: '{part} de inicio',
  rangeEndPart: '{part} final',
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
  browseFilesMultiple: 'Elegir archivos',
  removeFile: 'Quitar {name}',
  cancelUpload: 'Cancelar la subida de {name}',
  retryUpload: 'Reintentar',
  uploadFailed: 'No se pudo subir',
  uploading: 'Subiendo…',
  fileUploaded: 'Archivo subido',
  fileTypeRejected: '{name}: este formato no está permitido',
  fileTooLarge: '{name} supera {size}',
  tooManyFiles: 'Puedes agregar hasta {count} archivos',
  maxFilesHint: 'Hasta {count} archivos',
  duplicateFile: '{name} ya está en la lista',
  processing: 'Procesando…',
  processingFailed: 'No se pudo procesar {name}',
  couldNotReduce: 'No se pudo reducir {name} a {size} o menos',
  wasSize: 'antes {size}',
  awaitingApproval: 'espera tu aprobación',
  useNewVersion: 'Usar la nueva',
  keepOriginal: 'Usar el original',
  originalTooLarge: 'El original supera {size}',
  compare: 'Comparar',
  compareTitle: 'Comparar {name}',
  originalVersion: 'Original',
  newVersion: 'Nueva versión',
  actualSize: 'Tamaño real',
  discardFile: 'Descartar {name}',
  pendingFiles: 'Primero termina con los archivos pendientes',
  editImage: 'Editar imagen',
  cropArea: 'Área de recorte',
  cropHint: 'Las flechas la mueven, Mayús con las flechas cambia su tamaño, y más y menos amplían o reducen.',
  aspectRatio: 'Proporción',
  freeRatio: 'Libre',
  rotateLeft: 'Girar a la izquierda',
  rotateRight: 'Girar a la derecha',
  flipHorizontal: 'Voltear en horizontal',
  flipVertical: 'Voltear en vertical',
  zoom: 'Zoom',
  resetEdit: 'Restablecer',
  maxSide: 'Lado más largo',
  fullSize: 'Tamaño completo',
  outputFormat: 'Formato',
  automaticFormat: 'Automático',
  quality: 'Calidad',
  calculating: 'Calculando…',
  stillOverLimit: 'aún supera {size}',
  cannotOpenImage: 'Esta imagen no se puede abrir aquí',
  save: 'Guardar',
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
