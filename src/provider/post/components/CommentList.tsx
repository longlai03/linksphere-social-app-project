import type { Comment } from '@context/interface';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  onReply: (comment: Comment) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (comment: Comment) => void;
}

const CommentList = ({ comments, onReply, onEdit, onDelete }: CommentListProps) => {
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