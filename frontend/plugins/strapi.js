import Strapi from 'strapi-sdk-javascript/build/main'

export default ({ app }, inject) => {
	const apiUrl = app.$env.HOST + ':' + app.$env.API_PORT
	const proxyUrl = '/api'
	const strapi = new Strapi(process.server ? apiUrl : proxyUrl)
	inject('strapi', strapi)
}