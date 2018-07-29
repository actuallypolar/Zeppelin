export enum LogType {
  MEMBER_WARN = 1,
  MEMBER_MUTE,
  MEMBER_UNMUTE,
  MEMBER_MUTE_EXPIRED,
  MEMBER_KICK,
  MEMBER_BAN,
  MEMBER_UNBAN,
  MEMBER_FORCEBAN,
  MEMBER_JOIN,
  MEMBER_LEAVE,
  MEMBER_ROLE_ADD,
  MEMBER_ROLE_REMOVE,
  MEMBER_NICK_CHANGE,
  MEMBER_USERNAME_CHANGE,
  MEMBER_ROLES_RESTORE,

  CHANNEL_CREATE,
  CHANNEL_DELETE,

  ROLE_CREATE,
  ROLE_DELETE,

  MESSAGE_EDIT,
  MESSAGE_DELETE,
  MESSAGE_DELETE_BULK,

  VOICE_CHANNEL_JOIN,
  VOICE_CHANNEL_LEAVE,
  VOICE_CHANNEL_MOVE,

  COMMAND,

  SPAM_DELETE,
  CENSOR,

  CASE_CREATE
}
