import '../../styles/Header.css';
import { useAuth } from '../../context/AuthContext';

const DropdownProfile = () => {
    const { logout } = useAuth();

    return (
        <div className="flex flex-col dropdown">
            <a className='dropdown-actions'> Profile </a>
            <a className='dropdown-actions'> Settings </a>
            <a className='dropdown-actions' onClick={logout}> Logout </a>
        </div>
    )
}

export default DropdownProfile;