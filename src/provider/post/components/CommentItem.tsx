import React, { useState } from 'react';
import { Avatar, Button } from 'antd';
import type { Comment } from '@context/interface';
import DefaultImage from '@assets/images/1b65871bf013cf4be4b14dbfc9b28a0f.png'
import CommentList from './CommentList';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/redux';

interface CommentItemProps {
  comment: Comment;
  onReply: (comment: Comment) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onReply, onEdit, onDelete }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showReplies, setShowReplies] = useState(false);
  const isOwner = user?.id === comment.user_id;

  return (
    <div className="mb-2 ml-0">
      <div className="flex items-start gap-2">
        <Avatar
          src={comment.user?.avatar_url ? `http://localhost:8000/${comment.user.avatar_url}` : DefaultImage}
          size={28}
        />
        <div className="flex-1">
          <span className="font-semibold mr-2">{comment.user?.username ?? 'Unknown'}</span>
          <span>{comment.content}</span>
          <div className="flex gap-2 mt-1 text-xs text-gray-500">
            {comment.reply_comment_id == null && (
              <Button size="small" type="text" onClick={() => onReply(comment)}>
                Trả lời
              </Button>
            )}
            {isOwner && (
              <>
                <Button size="small" type="text" onClick={() => onEdit(comment)}>
                  Sửa
                </Button>
                <Button size="small" type="text" danger onClick={() => onDelete(comment)}>
                  Xóa
                </Button>
              </>
            )}
            {comment.replies && comment.replies.length > 0 && (
              <Button size="small" type="link" onClick={() => setShowReplies((v) => !v)}>
                {showReplies ? 'Ẩn phản hồi' : `Xem ${comment.replies.length} phản hồi`}
              </Button>
            )}
          </div>
        </div>
      </div>
      {showReplies && comment.replies && comment.replies.length > 0 && comment.reply_comment_id == null && (
        <div className="ml-8 mt-1">
          <CommentList
            comments={comment.replies}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem; 