export enum AuditableType {
  PATH = 'path',
  PHASE = 'phase',
  FOLDER = 'folder',
  GROUP = 'group',
  FILE = 'file',
  TASK = 'task',
  PHASE_ITEM = 'phase_item',
  INVITATION = 'invitation'
}

export enum AuditableAction {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
  RESTORED = 'restored'
}
