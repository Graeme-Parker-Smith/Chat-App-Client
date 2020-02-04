export default async function imgUpload(imgString, isVideo) {
	try {
		let apiUrl = 'https://api.cloudinary.com/v1_1/jaded/image/upload';
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
