import BaseApp from '../../core/base-app'
import Sidebar from '../../modules/global/sidebar'

export default class PolicyApp extends BaseApp {
    constructor() {
        super({ Sidebar }, 'PolicyApp')
    }
}