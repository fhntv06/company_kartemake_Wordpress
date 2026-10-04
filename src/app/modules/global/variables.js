export default class GlobalVariables {
    constructor() {

        const header = document.getElementById('header')
        if (!header) {
            console.warn('[GlobalVariables] Header not found!')
        }

        this.globalConfig = {
            headerOffsetHeight: header.offsetHeight ?? 80,
        }
    }

    getSectionOffset = () => {
        return (this.globalConfig.headerOffsetHeight ?? 80) * (window.innerWidth < 768 ? 3 : 5);
    }
}