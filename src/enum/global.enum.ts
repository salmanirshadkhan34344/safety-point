export enum FileExtensionsEnum {
  All = 'jpg|jpeg|png|gif|svg|mp4|avi|mov|webm|MP4|AVI|MOV|WEBM|SAG|GPG|PNG|JPEG|GIF',
  Image = 'jpg|jpeg|png|gif|svg|SAG|GPG|PNG|JPEG|GIF',
  Video = 'mp4|avi|mov|webm|MP4|AVI|MOV|WEBM',
}

export enum NotificationTypeEnum {
  AddFriend = 'add_friend',
  AcceptFriend = 'accept_friend',
  PostLike = 'post_like',
  InviteEvent = 'invite_event',
  UpdateEvent = 'update_event',
  SharePost = 'share_post',

  ReportComment = 'report_comment',
  ReportLike = 'report_like',
  FriendAddedNewReport = 'friend_added_new_report',
  NotifiedReport = 'notified_report',

}

export enum ReportTypeEnum {
  AddReport = 'add_report',
  UpdateReport = 'update_report',
  DeleteReport = 'delete_report',
  LikeReport = 'like_report',
  CommentReport = 'comment_report',
  DislikeReport = 'dislike_report'
}

export enum ReportedTypeEnum {
  Reporting = 'reporting',

}
export enum CommentTypeEnum {
  Reporting = 'reporting',
}

export enum LikeTypeEnum {
  Reporting = 'reporting',
  Comment = 'comment',
}
export enum NotificationRelatedTypeEnum {
  Post = 'post',
  SharePost = 'share_post',
  Friend = 'friend',
  Report = 'report',
}