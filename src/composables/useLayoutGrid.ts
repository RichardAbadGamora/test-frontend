import { type Ref } from 'vue'
import { PATH_GRID_WIDTH, PATH_GRID_HEIGHT } from '@/configs/Path'
import { useRoute } from 'vue-router'
import PageService from '@/services/PageService'
import debounce from 'lodash.debounce'

export default (layout: Ref<any[]>, colsCount: Ref<number>) => {
  const route = useRoute()

  const addPageToGrid = (page: any, options: any = {}) => {
    layout.value.push({
      ...page,
      x: options?.auto ? (layout.value.length * PATH_GRID_WIDTH) % colsCount.value : page.grid_x,
      y: options?.auto ? layout.value.length + colsCount.value : page.grid_y,
      w: options?.auto ? PATH_GRID_WIDTH : page.grid_width,
      h: options?.auto ? PATH_GRID_HEIGHT : page.grid_height,
      i: page.hash,
    })
  }

  const handleLayoutUpdate = debounce(() => {
    if (!layout.value.length) {
      return
    }

    const positioning = layout.value.map((page: any) => ({
      page_hash: page.hash,
      grid_x: page.x,
      grid_y: page.y,
      grid_width: page.w,
      grid_height: page.h
    }))

    PageService.reposition({
      path_hash: route.params.pathHash,
      positioning
    })
  }, 800)

  return {
    addPageToGrid,
    handleLayoutUpdate
  }
}
