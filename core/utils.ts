
import { Platform } from "react-native"
import { ADDRESS } from "../services/api"

// const log = () => {
// 	// Much better console.log function that formats/indents
// 	// objects for better reabability
// 	for (let i = 0; i < arguments.length; i++) {
// 		let arg = arguments[i]
// 		// Stringify and indent object
// 		if (typeof arg === 'object') {
// 			arg = JSON.stringify(arg, null, 2)
// 		}
// 		console.log(`[${Platform.OS}]`, arg)
// 	}
// }

const thumbnail = (url: string) => {
  const ProfileImage = require('../assets/images/profile.png');

	if (!url) {
		return ProfileImage
	}
	return {
		uri: 'http://' + ADDRESS + url
	}
}

const formatTime = (date: string | null) => {
	if (date === null)  {
		return '-'
	}
	const now = new Date()
	const s = Math.abs(now.getTime() - new Date(date).getTime()) / 1000
	// Seconds
	if (s < 60) {
		return 'now'
	}
	// Minutes
	if (s < 60*60) {
		const m = Math.floor(s / 60)
		return `${m}m ago`
	}
	// Hours
	if (s < 60*60*24)  {
		const h = Math.floor(s / (60*60))
		return `${h}h ago`
	}
	// Days
	if (s < 60*60*24*7)  {
		const d = Math.floor(s / (60*60*24))
		return `${d}d ago`
	}
	// Weeks
	if (s < 60*60*24*7*4)  {
		const w = Math.floor(s / (60*60*24*7))
		return `${w}w ago`
	}
	// Years
	const y = Math.floor(s / (60*60*24*365))
	return `${y}y ago`
}

const parseParams = (params: any) => {
	return Array.isArray(params)
	? JSON.parse(params[0]) // Parse the first element if it's an array
	: JSON.parse(params);
}

export default { thumbnail, formatTime, parseParams }