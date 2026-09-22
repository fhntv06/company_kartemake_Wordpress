import BaseApp from '../../core/base-app'
import Sidebar from '../../modules/global/sidebar'

export default class SingleApp extends BaseApp {
    constructor() {
        super({ Sidebar }, 'SingleApp')
    }
}
