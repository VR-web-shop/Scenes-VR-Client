
export default class ContentManager {
    constructor(onAddContentObject = async ()=>{}) {
        this.contentObjects = []
        this.onAddContentObject = onAddContentObject
    }

    async addContentObject(contentObject) {
        console.log('ContentManager.addContentObject', contentObject, this.contentObjects)
        this.contentObjects.push(contentObject)
        await this.onAddContentObject(contentObject)
    }

    getContentObjects() {
        return this.contentObjects
    }

    clearContentObjects() {
        this.contentObjects = []
    }
}
