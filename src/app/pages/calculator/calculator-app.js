import CalculatorController from "../../modules/calculator/calculator-controller";
import BaseApp from "../../core/base-app";

export default class CalculatorApp extends BaseApp {
    constructor() {
        super({ CalculatorController }, 'CalculatorApp')
    }
}
