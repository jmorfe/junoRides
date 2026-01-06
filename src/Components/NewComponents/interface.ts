
export interface variantData {
    actual_price:number | string

}
export interface imagePath {
    image_fit:string
    image_path:string
}
export interface imageObject {
    path:imagePath
}
export interface mediaType{
    image:imageObject
}
export interface itemType  {
    media: Array<mediaType>
    title: string
    price_numeric:string | number
    transmission: string
    fuel_type: string
    Seats: string
    path:string | null
    address: string
    product_attributes:string
    variant:Array<variantData>
}
