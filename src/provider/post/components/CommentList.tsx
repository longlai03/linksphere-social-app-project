import React from 'react';
import CommentItem from './CommentItem';
import type { Comment } from '@context/interface';

interface CommentListProps {
  comments: Comment[];
  onReply: (comment: Comment) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

const CommentList: React.FC<CommentListProps> = ({ comments, onReply, onEdit, onDelete }) => {
  return (
    <div>
      {comments?.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentList; 