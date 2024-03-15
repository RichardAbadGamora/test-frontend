import { AuditableType, AuditableAction } from '@/enums/Audit'

const columnMapper: any = {
  bg_value: 'background',
  bg_color: 'background',
  page_bg_color: 'page background',
  name: 'name',
  business_name: 'business name',
  bg_type: 'background type',
  orig_filename: 'name',
  phase_item: 'phase item',
  content_type: 'content type',
  content_value: 'content',
  folder: 'folder',
  image: 'image',
  phase: 'phase',
  status: 'status',
  path: 'path'
}

export const formatActivity = (activity: any) => {
  if (activity.auditable_type === AuditableType.PATH) {
    return formatPathActivity(activity)
  }

  if (activity.auditable_type === AuditableType.PHASE) {
    return formatPhaseActivity(activity)
  }

  if (activity.auditable_type === AuditableType.GROUP) {
    return formatFolderActivity(activity)
  }

  // if (
  //   activity.auditable?.type === AuditableType.FOLDER ||
  //   activity.old_values?.type === AuditableType.FOLDER ||
  //   activity.new_values?.type === AuditableType.FOLDER
  // ) {
  //   return formatFolderActivity(activity)
  // }

  if (activity.auditable_type === AuditableType.FILE) {
    return formatFileActivity(activity)
  }

  if (activity.auditable_type === AuditableType.TASK) {
    return formatTaskActivity(activity)
  }

  if (activity.auditable_type === AuditableType.INVITATION) {
    return formatInvitationActivity(activity)
  }

  if (activity.auditable_type === AuditableType.PHASE_ITEM) {
    return formatPhaseItemActivity(activity)
  }
}

const formatDate = (dateString: any) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const options: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timeZone
  }

  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatChanges = (activity: any) => {
  const changes = []

  const auditableType = activity.auditable_type
  // const auditable = activity.auditable

  let formattedAuditableType = columnMapper[auditableType]

  if (auditableType === AuditableType.GROUP) {
    formattedAuditableType = columnMapper['folder']
  }

  for (const key in activity.old_values) {
    // eslint-disable-next-line no-prototype-builtins
    if (activity.old_values.hasOwnProperty(key)) {
      const oldValue = activity.old_values[key]
      const newValue = activity.new_values[key]
      const formattedColumn = columnMapper[key]

      let fromTo = `from "${oldValue}" to "${newValue}"`

      if (auditableType === AuditableType.PHASE_ITEM) {
        if (activity.old_values.content_type === null) {
          fromTo = `to "${newValue}"`
        }

        if (activity.new_values.content_value === null) {
          fromTo = `to "${oldValue}" to "image"`
        }
      }

      changes.push(`the ${formattedAuditableType} ${formattedColumn} ${fromTo}`)
    }
  }

  if (changes.length > 0) {
    return changes.join(' and ')
  }
}

export const formatInvitationActivity = (activity: any) => {
  const actor = activity.is_yours ? 'You' : activity.user.email
  let event = activity.event
  let action: any = ''

  if (event === AuditableAction.UPDATED) {
    action = formatChanges(activity)
  }

  if (event === AuditableAction.DELETED) {
    event = 'cancelled'
    action = `"${activity.old_values.invitee_email}" invitation to this path`
  }

  if (event === AuditableAction.CREATED) {
    event = 'invited'
    action = `"${activity.new_values.invitee_email}" to this path`
  }

  return `${actor} ${event} ${action} on ${formatDate(activity.created_at)}`
}

export const formatPathActivity = (activity: any) => {
  const actor = activity.is_yours ? 'You' : activity.user.email
  const event = activity.event
  let action: any = ''

  if (event === AuditableAction.UPDATED) {
    action = formatChanges(activity)
  }

  if (event === AuditableAction.DELETED) {
    action = `the "${activity.old_values.name}" ${activity.auditable_type}`
  }

  if (event === AuditableAction.CREATED) {
    action = `the "${activity.new_values.name}" ${activity.auditable_type}`
  }

  return `${actor} ${event} ${action} on ${formatDate(activity.created_at)}`
}

export const formatPhaseActivity = (activity: any) => {
  const actor = activity.is_yours ? 'You' : activity.user?.email
  const event = activity.event
  let action: any = ''

  if (event === AuditableAction.UPDATED) {
    action = formatChanges(activity)
  }

  if (event === AuditableAction.DELETED) {
    action = `the "${activity.old_values.name}" ${columnMapper[activity.auditable_type]}`
  }

  if (event === AuditableAction.CREATED) {
    action = `the "${activity.new_values.name}" ${columnMapper[activity.auditable_type]}`
  }

  return `${actor} ${event} ${action} on ${formatDate(activity.created_at)}`
}

export const formatFolderActivity = (activity: any) => {
  const actor = activity.is_yours ? 'You' : activity.user?.email
  const event = activity.event
  let action: any = ''

  if (event === AuditableAction.UPDATED) {
    action = formatChanges(activity)
  }

  if (event === AuditableAction.DELETED) {
    action = `the "${activity.old_values.name}" ${activity.old_values.type}`
  }

  if (event === AuditableAction.CREATED) {
    action = `the "${activity.new_values.name}" ${
      activity.auditable?.type || activity.new_values?.type
    }`
  }

  return `${actor} ${event} ${action} on ${formatDate(activity.created_at)}`
}

export const formatFileActivity = (activity: any) => {
  const actor = activity.is_yours ? 'You' : activity.user?.email
  let event = activity.event
  let action: any = ''

  if (event === AuditableAction.UPDATED) {
    action = formatChanges(activity)
  }

  if (event === AuditableAction.DELETED) {
    action = `the "${activity.old_values.orig_filename}" ${activity.auditable_type}`
  }

  if (event === AuditableAction.CREATED) {
    event = 'added'
    const folderName = activity.auditable?.folder_name
    action = `the "${activity.new_values.orig_filename}" ${activity.auditable_type} ${
      folderName ? `to the "${folderName}" folder` : ''
    }`
  }

  return `${actor} ${event} ${action} on ${formatDate(activity.created_at)}`
}

export const formatTaskActivity = (activity: any) => {
  const actor = activity.is_yours ? 'You' : activity.user?.email
  const event = activity.event
  let action: any = ''

  if (event === AuditableAction.UPDATED) {
    action = formatChanges(activity)
  }

  if (event === AuditableAction.DELETED) {
    action = `the "${activity.old_values.name}" ${activity.auditable_type}`
  }

  if (event === AuditableAction.CREATED) {
    action = `the "${activity.new_values.name}" ${activity.auditable_type}`
  }

  return `${actor} ${event} ${action} on ${formatDate(activity.created_at)}`
}

export const formatPhaseItemActivity = (activity: any) => {
  const actor = activity.is_yours ? 'You' : activity.user?.email
  const event = activity.event
  let action: any = ''

  if (event === AuditableAction.UPDATED) {
    action = formatChanges(activity)
  }

  if (event === AuditableAction.DELETED) {
    action = `the "${activity.old_values.name}" ${columnMapper[activity.auditable_type]}`
  }

  if (event === AuditableAction.CREATED) {
    action = `the "${activity.new_values.name}" ${columnMapper[activity.auditable_type]}`
  }

  return `${actor} ${event} ${action} on ${formatDate(activity.created_at)}`
}
