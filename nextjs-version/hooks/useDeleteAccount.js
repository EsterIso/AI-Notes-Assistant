import { useState } from 'react';
import { deleteUser } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

function useDeleteAccount() {
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errors, setErrors] = useState({});

    const { logout } = useAuth();
    const router = useRouter();

    const handleConfirmationChange = (e) => {
        setDeleteConfirmation(e.target.value);
        // Clear errors when user starts typing
        if (errors.confirmation) {
            setErrors({});
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setDeleteConfirmation('');
        setErrors({});
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setDeleteConfirmation('');
        setErrors({});
    };

    const handleDeleteAccount = async () => {
        // Validation
        if (deleteConfirmation !== 'DELETE') {
            const errorMsg = 'Please type DELETE to confirm account deletion';
            setErrors({ confirmation: errorMsg });
            toast.error(errorMsg);
            return;
        }

        setIsDeleting(true);
        setErrors({});

        try {
            const response = await deleteUser();

            if (!response) {
                const errorMsg = "No response from server.";
                setErrors({ general: errorMsg });
                toast.error(errorMsg);
                return;
            }

            const { success, message } = response;
            
            if (success) {
                // Successful deletion
                toast.success(message || 'Account deleted successfully');
                logout(); // Clear auth state
                router.push('/'); // Redirect to home
            } else {
                // Handle error from server
                const errorMsg = message || 'Failed to delete account';
                setErrors({ general: errorMsg });
                toast.error(errorMsg);
            }
        } catch (error) {
            console.error("Error during account deletion:", error);
            const errorMsg = 'An error occurred while deleting your account. Please try again later.';
            
            setErrors({ general: errorMsg });
            toast.error(errorMsg);
        } finally {
            setIsDeleting(false);
        }
    };

    return {
        deleteConfirmation,
        showDeleteModal,
        isDeleting,
        errors,
        handleConfirmationChange,
        openDeleteModal,
        closeDeleteModal,
        handleDeleteAccount
    };
}

export default useDeleteAccount;