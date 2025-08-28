import React, { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Plus, 
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';

const CommentsPanel = ({ comments, loading }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // TODO: Implement comment submission
      console.log('Submitting comment:', newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              {comments.length}
            </span>
          </div>
        </div>

        {/* Add New Comment */}
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="input-field resize-none h-24"
              disabled={isSubmitting}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Post Comment</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="card">
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Comments</h3>
              <p className="text-gray-500">Be the first to add a comment to this file</p>
            </div>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="card">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-pulse-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {comment.user?.name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.message}
                  </p>
                  
                  {comment.resolved_at && (
                    <div className="mt-2 flex items-center space-x-2 text-xs text-green-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Statistics */}
      {comments.length > 0 && (
        <div className="card">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Comment Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {comments.length}
              </p>
              <p className="text-xs text-gray-500">Total Comments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {comments.filter(c => c.resolved_at).length}
              </p>
              <p className="text-xs text-gray-500">Resolved</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsPanel;
