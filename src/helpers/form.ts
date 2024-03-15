export const objectToFormData = (object: any): FormData => {
  const formData = new FormData()

  for (const key in object) {
    // eslint-disable-next-line no-prototype-builtins
    if (object.hasOwnProperty(key)) {
      formData.append(key, object[key] || '')
    }
  }

  return formData
}

export const COMMON_IMAGE_EXTS = '.jpeg,.jpg,.png,.gif,.bmp,.svg'

export const filterify = (object: any) => {
  const filters: any = {}

  for (const key in object) {
    filters[`filter[${key}]`] = object[key]
  }

  return filters
}

export function isValidEmail(text: string) {
  // Regular expression pattern to match against email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Test the text against the pattern
  return emailPattern.test(text)
}
