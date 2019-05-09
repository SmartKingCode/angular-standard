

//QUERY BUILDER METHODS TO IMPLEMENT
export interface QueryBuilder {
    toQueryMap: () => Map<string, string>;
    toQueryString: () => string;
}

//IMPLEMENT QUERY BUILDER METHODS 
export class QueryOptions implements QueryBuilder {

    //QUERY OPTIONS PROPERTIES
    public pageNumber: Number;
    public pageSize: Number;
    public searchTerm: String;


    constructor() {
        
        //INITIALIZE PROPERTIES WITH DEFAULT VALUES
        this.pageNumber = 1;
        this.pageSize = 4;
        this.searchTerm = '';
    }



    // INSTANTIATE A MAP INITIALIZE WITH PROPERTIES DATA AND RETURN MAP 
    toQueryMap() {

        const queryMap = new Map<string, string>();

        queryMap.set('pageNumber', `${this.pageNumber}`);
        queryMap.set('pageSize', `${this.pageSize}`);
        queryMap.set('searchTerm', `${this.searchTerm}`);

        return queryMap;
    }

    //TRANSFORM RETURNED MAP FROM TOQUERYMAP() TO BUILD URL STRING OF PARAMETERS
    toQueryString() {

        let queryString = '';
        this.toQueryMap().forEach((value: string, key: string) => {

            queryString = queryString.concat(`${key}=${value}&`);
        });
        return queryString.substring(0, queryString.length - 1);
    }

}