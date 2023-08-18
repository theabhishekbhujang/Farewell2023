function uploadImages() {
    const clientId = 'f64a1345c3bbf4f'; // Your Imgur API client ID
    const imageInput = document.getElementById('imageInput');
    const uploadStatus = document.getElementById('uploadStatus');
    const uploadResult = document.getElementById('uploadResult');
    const files = imageInput.files;

    if (files.length === 0) {
        uploadResult.textContent = 'Please select one or more images.';
        return;
    }

    const headers = new Headers({
        'Authorization': `Client-ID ${clientId}`
    });

    uploadStatus.style.display = 'block';

    const uploadPromises = [];

    for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);

        const uploadPromise = fetch('https://api.imgur.com/3/upload', {
            method: 'POST',
            headers: headers,
            body: formData
        })
        .then(response => response.json())
        .catch(error => {
            console.error('An error occurred while uploading the image:', error);
            return null;
        });

        uploadPromises.push(uploadPromise);
    }

    Promise.all(uploadPromises)
        .then(responses => {
            const successLinks = [];
            const failedUploads = [];

            responses.forEach((response, index) => {
                if (response && response.data && response.data.link) {
                    successLinks.push(`Image ${index + 1}: ${response.data.link}`);
                } else {
                    failedUploads.push(`Image ${index + 1}`);
                }
            });

            if (successLinks.length > 0) {
                uploadResult.innerHTML = `Images uploaded successfully:<br>${successLinks.join('<br>')}`;
            }

            if (failedUploads.length > 0) {
                uploadResult.innerHTML += `<br>Failed to upload:${failedUploads.join(', ')}`;
            }
        })
        .finally(() => {
            uploadStatus.style.display = 'none';
        });
}
