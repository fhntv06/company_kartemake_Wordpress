import AboutIntro from "../../modules/about/about-intro";
import BaseApp from '../../core/base-app'

export default class AboutApp extends BaseApp {
    constructor() {
        super({ AboutIntro }, 'AboutApp')
    }
}
