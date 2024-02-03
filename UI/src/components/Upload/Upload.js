const props = {
    listType: 'picture',
    beforeUpload(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    ctx.textBaseline = 'middle';
                    ctx.font = '33px Arial';
                    canvas.toBlob((result) => resolve(result));
                };
            };
        });
    },
};
export default props;