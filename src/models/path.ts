import type { Status } from '@/enums/Path'

export interface Path {
  hash: string
  name: string
  status: Status
  business_name: string
  visibility: string
  bg_type: string
  bg_value: string
  page_bg_color: string
  base_text_size: string
  typo_color: string
  user_id: string
  created_at: string
  updated_at: string
}
