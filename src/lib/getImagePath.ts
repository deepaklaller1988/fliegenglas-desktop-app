export const getImagePath = (path:any) => {
    if (path?.startsWith('http://') || path?.startsWith('https://')) {
        return path;
    }
    return '/' + path; 
};
