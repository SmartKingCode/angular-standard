import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Factory } from '../factories/factory.factory';
import { Resource } from '../models/resource.model';
import { QueryOptions } from '../models/query-options.model';



export class Service {

    private _data$ = new BehaviorSubject<Resource[]>([]);
    private _search$ = new Subject<void>();
    private _loading$ = new BehaviorSubject<Boolean>(true);
    private _queryOptions: QueryOptions = new QueryOptions();

    constructor(private factory: Factory<Resource>) {

        this._search$.pipe(
            //RETURN AN OBSERVABLE
            tap(() => this._loading$.next(true)),
            //CANCEL PREVIOUS OBSERVABLE RETURN NEW ONE 
            switchMap(() => {
                return this.list();
            }),
            //RETURN OBSERVABLE SAME AS PREVIOUS
            tap(() => this._loading$.next(false))
        ).subscribe(data => {
            //SEND DATA TO THE OBSERVERS
            this._data$.next(data);
        });

        this._search$.next();
    }

    //RETURN AN OBSERVABLE INSTANCE OF SUBJECT SOURCE
    get data$() {
        return this._data$.asObservable();
    }

    //GET A LIST OF DATA BASED ON QUERY SEARCH
    list() {
        return this.factory.list(this._queryOptions);
    }

    //CREATE ENTITY SERVICE
    create(data: any) {
        return this.factory.create(data);
    }

    //UPDATE ENTITY SERVICE
    update(data: any) {
        return this.factory.update(data).pipe(
            tap((data) => {

                //GET PREVIOUSLY PUSHED DATA 
                let tap = this._data$.getValue();

                //LOOP THROUGHT ALL ENTITIES
                for (let i = 0; i < tap.length; i++) {

                    //COMPARE THE ENTITIES IDS WITH THE ELEMENT WE WANT TO UPDATE 
                    if (tap[i].id == data.id) {

                        //TRUE SET TO NEW VALUE
                        tap[i] = data;
                    }
                }
                
                //PUSH NEW DATA TO THE OBSERVERS
                this._data$.next(tap);
            })
        );
    }

    //DELETE ENTITY BASED ON ID
    delete(id: number) {

        return this.factory.delete(id).pipe(
            tap(() => {

                //GET PREVIOUSLY PUSHED DATA 
                let tap = this._data$.getValue();

                 //COMPARE THE ENTITIES IDS WITH THE ELEMENT WE WANT TO UPDATE
                for (let i = 0; i < tap.length; i++) {

                    //COMPARE THE ENTITIES IDS WITH THE ELEMENT WE WANT TO DELETE 
                    if (tap[i].id == id) {
                          //TRUE REMOVE FROM LIST ON GETS ELEMENTS
                        tap.splice(i, 1);
                    }
                }
                
                 //PUSH LATEST DATA TO THE OBSERVERS
                this._data$.next(tap);
            })

        );
    }


}

