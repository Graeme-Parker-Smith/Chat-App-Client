import chatApi from '../api/requester';

export default async function imgUpload(imgString, isVideo = false) {
	try {
		let fileType = 'image';
		if (isVideo) {
			fileType = 'video';
			let filename = imgString.split('/').pop();
			// "B9A71996-353E-4638-8148-B1AB2C653138.jpg"

			// infer the type of the image
			let match = /\.(\w+)$/.exec(filename);
			// [".jpg", "jpg"]
			let type = match ? `video/${match[1]}` : `video`;
			// if match truthy, type = "image/jpg" else type = "image"
			let formData = new FormData();
			// formData.append('videoFile', {
			// 	name: name.mp4,
			// 	uri: video.uri,
			// 	type: 'video/mp4',
			// });
			formData.append('videoFile', { uri: imgString, name: filename, type });

			const response = await chatApi.post('/video', formData, {
				headers: { 'content-type': 'multipart/form-data' },
			});
			return response.data.secure_url;

			let apiUrl = `https://api.cloudinary.com/v1_1/jaded/${fileType}/upload`;

			console.log('apiUrl', apiUrl);
			let b = {
				file: formData,
				upload_preset: 'auymih3b',
			};
			let r = await fetch(apiUrl, {
				body: formData,
				headers: {
					'content-type': 'multipart/form-data',
				},
				method: 'POST',
			});
			let data = await r.json();
			console.log('cloud url', data.secure_url);
			return data.secure_url;

			try {
				let response = await fetch(url, {
					method: 'post',
					headers: {
						'Content-Type': 'multipart/form-data',
					},
					body: formData,
				});
				return await response.json();
			} catch (error) {
				console.log('error : ' + error);
				return error;
			}
		}
		// file:///var/mobile/Containers/Data/Application/14E88F17-8860-46F6-BB0B-892C349136E9/Library/Caches/ExponentExperienceData/%2540graemesmith%252Fgraeme-chat-app/ImagePicker/28CE9DAA-80FB-4616-B270-F5D6432F8C51.mov
		let apiUrl = `https://api.cloudinary.com/v1_1/jaded/${fileType}/upload`;
		console.log('apiUrl', apiUrl);
		let b = {
			file: imgString,
			upload_preset: 'auymih3b',
		};
		let r = await fetch(apiUrl, {
			body: JSON.stringify(b),
			headers: {
				'content-type': 'application/json',
			},
			method: 'POST',
		});
		let data = await r.json();
		console.log(data.secure_url);
		return data.secure_url;
	} catch (err) {
		console.log(err);
	}
}
