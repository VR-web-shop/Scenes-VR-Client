
export default class ContentManager {
    constructor(onAddContentObject = ()=>{}) {
        this.contentObjects = []
        this.onAddContentObject = onAddContentObject
    }

    addContentObject(contentObject) {
        this.contentObjects.push(contentObject)
        this.onAddContentObject(contentObject)
    }

    getContentObjects() {
        return this.contentObjects
    }
}
