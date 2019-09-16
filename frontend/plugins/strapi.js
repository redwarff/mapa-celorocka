import Strapi from 'strapi-sdk-javascript/build/main'

export default ({ app }, inject) => {
	const apiUrl = 'localhost' + ':' + app.$env.API_PORT
	const proxyUrl = '/api'
	const strapi = new Strapi(process.server ? apiUrl : proxyUrl)
	inject('strapi', strapi)
}