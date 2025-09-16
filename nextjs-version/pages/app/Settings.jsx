import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import useDeleteAccount from '../../hooks/useDeleteAccount';

const Settings = () => {
  const {
    deleteConfirmation,
    showDeleteModal,
    isDeleting,
    errors,
    handleConfirmationChange,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteAccount
  } = useDeleteAccount();

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="header-content">
          <h1>Settings</h1>
          <p>Manage your account</p>
        </div>
      </div>

      <div className="settings-sections">
        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <AlertTriangle className="section-icon" />
            <h2>Delete Account</h2>
          </div>
          <div className="danger-content">
            <div className="danger-warning">
              <AlertTriangle size={20} />
              <div>
                <h3>Permanent Account Deletion</h3>
                <p>This will permanently delete your account and all associated data including notes, summaries, flashcards, and quizzes. This action cannot be undone.</p>
              </div>
            </div>
            <button 
              className="action-button danger"
              onClick={openDeleteModal}
            >
              <Trash2 size={16} />
              Delete My Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <AlertTriangle className="modal-icon danger" />
              <h2>Delete Account</h2>
            </div>
            
            <div className="modal-body">
              <p>This will permanently delete your account and all associated data including:</p>
              <ul>
                <li>All your study notes and summaries</li>
                <li>Generated flashcards and quizzes</li>
                <li>Account preferences and settings</li>
                <li>AI processing history</li>
              </ul>
              
              {errors.general && (
                <div className="error-message">
                  {errors.general}
                </div>
              )}
              
              <div className="confirmation-input">
                <label>
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={handleConfirmationChange}
                  placeholder="DELETE"
                  className={`delete-input ${errors.confirmation ? 'error' : ''}`}
                />
                {errors.confirmation && (
                  <span className="error-text">{errors.confirmation}</span>
                )}
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="action-button secondary"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                className="action-button danger"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== 'DELETE' || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;