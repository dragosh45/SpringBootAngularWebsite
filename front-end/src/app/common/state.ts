export class State{
    constructor(
        public id: number,
        public name: string,
        public country_id: number
        //no need as the relationship with country is mapped in the spring
    ){}
}