import { PageType, IconType, PageClass } from '@/enums/App'
import { ArrowPathRoundedSquareIcon, FolderIcon, CheckBadgeIcon, ChatBubbleLeftRightIcon, StarIcon, TrashIcon } from '@heroicons/vue/24/outline'
import SignNowIcon from '@/assets/images/signnow.webp'
import TrelloIcon from '@/assets/images/trello.webp'
import SquareIcon from '@/assets/images/square.webp'
import FigmaIcon from '@/assets/images/figma.webp'

// For the Draggable Path Grid Layout
export const PATH_GRID_WIDTH = 1
export const PATH_GRID_HEIGHT = 15
export const PATH_COLS_COUNT = 4

export const addablePages = [
  {
    name: 'Overview',
    caption: 'Additional Page',
    description: 'path:addable-pages:overview:desc',
    icon: ArrowPathRoundedSquareIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary-700',
    classification: PageClass.PAGE,
    type: PageType.OVERVIEW,
    singleton: false
  },
  {
    name: 'Files',
    caption: 'Additional Page',
    description: 'path:addable-pages:files:desc',
    icon: FolderIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary-700',
    classification: PageClass.PAGE,
    type: PageType.FILES,
    singleton: false
  },
  {
    name: 'Tasks',
    caption: 'Additional Page',
    description: 'path:addable-pages:tasks:desc',
    icon: CheckBadgeIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary-700',
    classification: PageClass.PAGE,
    type: PageType.TASKS,
    singleton: false
  },
  {
    name: 'Messaging',
    caption: 'Additional Page',
    description: 'path:addable-pages:msg:desc',
    icon: ChatBubbleLeftRightIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary-700',
    classification: PageClass.PAGE,
    type: PageType.MESSAGING,
    singleton: true
  },
  {
    name: 'SignNow',
    caption: 'Integration',
    description: 'path:addable-pages:signnow:desc',
    icon: SignNowIcon,
    iconType: IconType.IMAGE,
    bgClass: 'bg-[#0188CF]',
    classification: PageClass.INTEGRATION,
    type: PageType.SIGN_NOW_INTEG,
    singleton: false
  },
  {
    name: 'Trello',
    caption: 'Integration',
    description: 'path:addable-pages:trello:desc',
    icon: TrelloIcon,
    iconType: IconType.IMAGE,
    bgClass: 'bg-[#2394D1]',
    classification: PageClass.INTEGRATION,
    type: PageType.TRELLO_INTEG,
    singleton: false
  },
  {
    name: 'Square',
    caption: 'Integration',
    description: 'path:addable-pages:square:desc',
    icon: SquareIcon,
    iconType: IconType.IMAGE,
    bgClass: 'bg-primary-200',
    classification: PageClass.INTEGRATION,
    type: PageType.SQUARE_INTEG,
    singleton: false
  },
  {
    name: 'Figma Design Embed',
    caption: 'Integration',
    description: 'path:addable-pages:figma-design:desc',
    icon: FigmaIcon,
    iconType: IconType.IMAGE,
    bgClass: 'bg-[#2b2c32]',
    classification: PageClass.INTEGRATION,
    type: PageType.FIGMA_PROTOTYPE_EMBED,
    singleton: false
  },
  {
    name: 'Figma Prototype Embed',
    caption: 'Integration',
    description: 'path:addable-pages:figma-proto:desc',
    icon: FigmaIcon,
    iconType: IconType.IMAGE,
    bgClass: 'bg-[#2b2c32]',
    classification: PageClass.INTEGRATION,
    type: PageType.FIGMA_DESIGN_EMBED,
    singleton: false
  },
  {
    name: 'Google Drive',
    caption: 'Integration',
    description: 'path:addable-pages:gdrive:desc',
    icon: StarIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary',
    classification: PageClass.INTEGRATION,
    type: PageType.GDRIVE_INTEG,
    singleton: false
  },
  {
    name: 'GMail',
    caption: 'Integration',
    description: 'path:addable-pages:gmail:desc',
    icon: StarIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary',
    classification: PageClass.INTEGRATION,
    type: PageType.GMAIL_INTEG,
    singleton: false
  },
  {
    name: 'GitHub',
    caption: 'Integration',
    description: 'path:addable-pages:github:desc',
    icon: StarIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary',
    classification: PageClass.INTEGRATION,
    type: PageType.SQUARE_INTEG,
    singleton: false
  },
  {
    name: 'Upwork',
    caption: 'Integration',
    description: 'path:addable-pages:upwork:desc',
    icon: StarIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary',
    classification: PageClass.INTEGRATION,
    type: PageType.UPWORK_INTEG,
    singleton: false
  },
  {
    name: 'iFrame',
    caption: 'Integration',
    description: 'path:addable-pages:iframe:desc',
    icon: StarIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary',
    classification: PageClass.PAGE,
    type: PageType.IFRAME,
    singleton: false
  },
  {
    name: 'WaveApps',
    caption: 'Integration',
    description: 'path:addable-pages:waveapps:desc',
    icon: StarIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary-700',
    classification: PageClass.INTEGRATION,
    type: PageType.WAVEAPPS_INTEG,
    singleton: true
  },
  {
    name: 'Trash',
    caption: 'Additional Page',
    description: 'path:addable-pages:trash:desc',
    icon: TrashIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary',
    classification: PageClass.PAGE,
    type: PageType.TRASH,
    singleton: true
  },
  {
    name: 'Thio Chat AI',
    caption: 'Additional Page',
    description: 'path:addable-pages:trash:desc',
    icon: ChatBubbleLeftRightIcon,
    iconType: IconType.HERO_ICON,
    bgClass: 'bg-primary',
    classification: PageClass.PAGE,
    type: PageType.THIO_CHAT_AI,
    singleton: true
  },
]

export const PATH_GRADIENT_BACKGROUNDS = [
  'linear-gradient(179.4deg, rgb(12, 20, 69) -16.9%, rgb(71, 30, 84) 119.9%)',
  'linear-gradient(68.3deg, rgb(23, 41, 77) 6.3%, rgb(243, 113, 154) 90.9%)',
  'linear-gradient(to right, #ff512f, #f09819)',
  'linear-gradient(to right, #5a3f37, #2c7744)',
  'linear-gradient(109.6deg, rgb(43, 1, 91) 13.4%, rgb(122, 2, 54) 100.2%)',
  'linear-gradient(to right, #141e30, #243b55)',
  'linear-gradient(25deg,#d64c7f,#ee4758 50%)',
  'linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114))',
  'linear-gradient(to right, #00b09b, #96c93d)'
]

export const PATH_PLAIN_BACKGROUNDS = [
  '#1C6C89',
  '#8B0000',
  '#FF4500',
  '#FF8C00',
  '#FFA500',
  '#FF0710',
  '#008000',
  '#000050',
  '#4B0082',
]