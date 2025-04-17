
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

export default { thumbnail }