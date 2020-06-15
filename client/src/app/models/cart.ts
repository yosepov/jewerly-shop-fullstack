import { User } from './user';

export class Cart {
    public constructor(
        public _id?: string,
        public user?: User,
        public date?: string
    ){};
}