import { PageType } from '@/enums/App'
import PageOverview from '@/components/Pages/PageOverview.vue'
import PageFiles from '@/components/Pages/PageFiles.vue'
import PageMessaging from '@/components/Pages/PageMessaging.vue'
import PageTasks from '@/components/Pages/PageTasks.vue'
import PagePaths from '@/components/Pages/PagePaths.vue'
import PagePathSettings from '@/components/Pages/PagePathSettings.vue'
import PageSignNow from '@/components/Pages/PageSignNow.vue'
import PageSampleInteg from '@/components/Pages/PageSampleInteg.vue'
import PageGmail from '@/components/Pages/PageGmail.vue'
import PageiFrame from '@/components/Pages/PageiFrame.vue'
import PageTrash from '@/components/Pages/PageTrash.vue'
import PageFigma from '@/components/Pages/PageFigma.vue'
import PageTrello from '@/components/Pages/PageTrello.vue'
import PageWaveApps from '@/components/Pages/PageWaveApps.vue'
import PageGdrive from '@/components/Pages/PageGdrive.vue'
import PageChat from '@/components/Pages/PageChatAI.vue'


export const PINNED_PAGE_STORAGE_KEY = 'thio-pinned-pages'

export const PAGE_COMPONENTS: any = {
  [PageType.OVERVIEW]: PageOverview,
  [PageType.FILES]: PageFiles,
  [PageType.MESSAGING]: PageMessaging,
  [PageType.TASKS]: PageTasks,
  [PageType.ALL_PATHS]: PagePaths,
  [PageType.PATH_SETTINGS]: PagePathSettings,
  [PageType.SIGN_NOW_INTEG]: PageSignNow,
  [PageType.SQUARE_INTEG]: PageSampleInteg,
  [PageType.GMAIL_INTEG]: PageGmail,
  [PageType.GITHUB_INTEG]: PageSampleInteg,
  [PageType.UPWORK_INTEG]: PageSampleInteg,
  [PageType.FIGMA_PROTOTYPE_EMBED]: PageFigma,
  [PageType.FIGMA_DESIGN_EMBED]: PageFigma,
  [PageType.IFRAME]: PageiFrame,
  [PageType.WAVEAPPS_INTEG]: PageWaveApps,
  [PageType.TRELLO_INTEG]: PageTrello,
  [PageType.TRASH]: PageTrash,
  [PageType.GDRIVE_INTEG]: PageGdrive,
  [PageType.THIO_CHAT_AI]: PageChat
}
