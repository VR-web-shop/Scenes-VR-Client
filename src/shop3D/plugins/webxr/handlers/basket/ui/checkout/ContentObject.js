
export default class ContentObject {
    constructor(
        imageSource = "images/couch_center.png", 
        getQuantity=()=>1, 
        getPrice=()=>1, 
        removeCallback=(object)=>{}
        ) {
        this.imageSource = imageSource
        this.getQuantity = getQuantity
        this.getPrice = getPrice
        this.removeCallback = removeCallback
    }
}
