import { User } from './user';
import { Cart } from './cart';

export class Order {
    public constructor(
        public _id?: string,
        public user?: User | string,
        public cart?: Cart | string,
        public final_price: number = 0,
        public delivery_city?: string,
        public delivery_street?: string,
        public delivery_house?: number,
        public delivery_date?: string,
        public cc_number?: number,
    ){};
}