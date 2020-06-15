import { Category } from './category';

export class Product {
    public constructor(
        public _id?: string,
        public name?: string,
        public category?: Category | string,
        public price?: number,
        public carat?: number,
        public goldType?: string,
        public goldKarat?: string,
        public img_name?: string,
        public sale?: number
    ) { };
}