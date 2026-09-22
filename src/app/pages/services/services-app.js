import ServicesWheel from "../../modules/services/services-wheel";
import BaseApp from "../../core/base-app";

export default class ServicesApp extends BaseApp {
    constructor() {
        super({ ServicesWheel }, 'ServicesApp')
    }
}
