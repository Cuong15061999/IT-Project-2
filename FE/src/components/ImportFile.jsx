import { FileUpload } from '@mui/icons-material';
import React from 'react';

export default function UploadButtons({ id, fileUploaded }) {
    const handleFileChange = (event) => {
        // Xử lý file ở đây
        const file = event.target.files[0];
        fileUploaded(file);
    };

    return (
        <>
            <input
                style={{ display: 'none' }}
                id={id}
                multiple
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor={id}>
                <FileUpload sx={{ cursor: "pointer" }} />
            </label>
        </>
    );
}
