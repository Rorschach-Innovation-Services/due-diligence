export const appEditMode = () => {
    const storedEditMode = localStorage.getItem('editMode');
    return storedEditMode !== null ? JSON.parse(storedEditMode) : false;
};