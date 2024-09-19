export enum FileExtensionsEnum {
  All = 'jpg|jpeg|png|gif|svg|mp4|avi|mov|webm|MP4|AVI|MOV|WEBM|SAG|GPG|PNG|JPEG|GIF',
  Image = 'jpg|jpeg|png|gif|svg|SAG|GPG|PNG|JPEG|GIF',
  Video = 'mp4|avi|mov|webm|MP4|AVI|MOV|WEBM',
}

export enum NotificationTypeEnum {
  AddFriend = 'add_friend',
  AcceptFriend = 'accept_friend',
  // PostLike = 'post_like',
  // PostComment = 'post_comment',
  // InviteEvent = 'invite_event',
  // UpdateEvent = 'update_event',
  SharePost = 'share_post',
}

export enum NotificationRelatedTypeEnum {
  Post = 'post',
  SharePost = 'share_post',
}

export enum SearchTypeEnum {
  Reports = 'reports',
  Users = 'users',
}