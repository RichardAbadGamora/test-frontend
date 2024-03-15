import { PAGE_BG_COLOR } from "@/configs/App"
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const getInitialsAvatar = (user: any) => {
  let initials = null

  if (user?.firstname || user?.lastname) {
    initials = [user.firstname?.[0], user.lastname?.[0]].filter((i: any) => !!i).join('')
  } else if (user?.email) {
    initials = user.email.slice(0, 2)
  } else {
    initials = 'YOU'
  }

  return initials.toUpperCase()
}

export const setMargin = (classSel: string, margin: number) => {
  const wrapper: any = document.querySelector(`${classSel}`)
  wrapper.style.paddingLeft = `${margin}px`
  wrapper.style.paddingRight = `${margin}px`
}

export const setPageBackground = (hexColor: string | null) => {
  if (!hexColor) {
    delete sessionStorage.pathBgColor
    hexColor = PAGE_BG_COLOR
  }

  document.documentElement.style.setProperty('--color-page-bg', hexColor);
}

export const formatDate = (dateString: string, format: string): string => {
  return dayjs(dateString).locale('en').format(format);
}

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return str.substring(0, maxLength) + "...";
  }
  return str;
}

export const toggleDarkMode = (isDarkMode: boolean) => {
  localStorage.isDarkMode = isDarkMode
  if (isDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

export const bytesToSize = (bytes: number): string => {
  const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0 || bytes == null) return '0';
  const i: number = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)).toString(), 10);
  if (i === 0) return `${bytes} ${sizes[i]}`;
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
}
