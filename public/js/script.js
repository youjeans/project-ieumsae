document.getElementById('upload1').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('diaryImage', file);

    fetch('/upload/1', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const clientImage = document.getElementById('clientImage1');
            clientImage.src = data.imagePath;
            clientImage.style.display = 'block'; // 이미지가 로드되면 표시합니다.
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
});

document.getElementById('upload2').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('diaryImage', file);

    fetch('/upload/2', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const clientImage = document.getElementById('clientImage2');
            clientImage.src = data.imagePath;
            clientImage.style.display = 'block'; // 이미지가 로드되면 표시합니다.
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
});

document.getElementById('upload3').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('diaryImage', file);

    fetch('/upload/3', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const clientImage = document.getElementById('clientImage3');
            clientImage.src = data.imagePath;
            clientImage.style.display = 'block'; // 이미지가 로드되면 표시합니다.
        }
    })
    .catch(error => {
        console.error('Error uploading file:', error);
    });
});
