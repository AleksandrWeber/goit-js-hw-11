import axios from 'axios';

const API_KEY = '55986974-95063b7eefc1c790e2c5195a1';
const BASE_URL = 'https://pixabay.com/api/';

export function getImagesByQuery(query) {
	return axios
		.get(BASE_URL, {
			params: {
				key: API_KEY,
				q: query,
				image_type: 'photo',
				orientation: 'horizontal',
				safesearch: true,
				per_page: 40,
			},
		})
		.then(response => response.data);
}

