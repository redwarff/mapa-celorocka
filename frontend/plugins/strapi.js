import Strapi from 'strapi-sdk-javascript/build/main'

export default ({ app }, inject) => {
	const apiUrl = `http://${process.env.HOST || 'localhost'}:${app.$env.API_PORT || '1337'}`
	const proxyUrl = '/api'
	const strapi = new Strapi(process.server ? apiUrl : proxyUrl)
	inject('strapi', strapi)
}