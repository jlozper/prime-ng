import { Injectable } from '@angular/core';
import { ListData, PaginationData } from '../ui/autocomplete-table/models/list-data.model';
import { SearchParams } from '../ui/autocomplete-table/models/search-params.model';
import { Observable, of } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

const dbData = [
  {
    name: 'Dustin',
    id: '162109257788'
  },
  {
    name: 'Lillian',
    id: '164808113270'
  },
  {
    name: 'Paul',
    id: '163801208566'
  },
  {
    name: 'Cain',
    id: '169810087701'
  },
  {
    name: 'Nevada',
    id: '167905026147'
  },
  {
    name: 'Larissa',
    id: '164501042842'
  },
  {
    name: 'Bethany',
    id: '163802020424'
  },
  {
    name: 'Alec',
    id: '165704177756'
  },
  {
    name: 'Madeson',
    id: '162401107038'
  },
  {
    name: 'Aristotle',
    id: '169601193270'
  },
  {
    name: 'Pearl',
    id: '165808133119'
  },
  {
    name: 'Geoffrey',
    id: '160011082807'
  },
  {
    name: 'Deborah',
    id: '162205170562'
  },
  {
    name: 'Ariana',
    id: '161101288882'
  },
  {
    name: 'Zenia',
    id: '168309045410'
  },
  {
    name: 'Portia',
    id: '168002284308'
  },
  {
    name: 'Ashely',
    id: '163009297429'
  },
  {
    name: 'Cooper',
    id: '168803286601'
  },
  {
    name: 'Brady',
    id: '161912092051'
  },
  {
    name: 'Ali',
    id: '168408227380'
  },
  {
    name: 'Sigourney',
    id: '164904289792'
  },
  {
    name: 'Alvin',
    id: '168311261138'
  },
  {
    name: 'Rae',
    id: '164303210282'
  },
  {
    name: 'Zeus',
    id: '167010245657'
  },
  {
    name: 'Acton',
    id: '165811050987'
  },
  {
    name: 'Hedda',
    id: '162502136100'
  },
  {
    name: 'Uriah',
    id: '166301264203'
  },
  {
    name: 'Kermit',
    id: '162410118919'
  },
  {
    name: 'Alice',
    id: '161708253362'
  },
  {
    name: 'Shaine',
    id: '163908040037'
  },
  {
    name: 'Simone',
    id: '160005079082'
  },
  {
    name: 'Nigel',
    id: '166011076798'
  },
  {
    name: 'Sydney',
    id: '165211187280'
  },
  {
    name: 'Dorothy',
    id: '168505189673'
  },
  {
    name: 'Mollie',
    id: '168104166502'
  },
  {
    name: 'Libby',
    id: '166311234709'
  },
  {
    name: 'Jeremy',
    id: '168308231714'
  },
  {
    name: 'Ishmael',
    id: '163506296916'
  },
  {
    name: 'Damian',
    id: '166010261342'
  },
  {
    name: 'Xavier',
    id: '163409298407'
  },
  {
    name: 'Larissa',
    id: '161603152818'
  },
  {
    name: 'Naomi',
    id: '165110090502'
  },
  {
    name: 'Daniel',
    id: '168710308977'
  },
  {
    name: 'Rafael',
    id: '163207179452'
  },
  {
    name: 'Jessamine',
    id: '163907013696'
  },
  {
    name: 'Hasad',
    id: '160303241889'
  },
  {
    name: 'Cathleen',
    id: '166004024391'
  },
  {
    name: 'Lyle',
    id: '168508064147'
  },
  {
    name: 'Quail',
    id: '167407291553'
  },
  {
    name: 'Jermaine',
    id: '166507147566'
  },
  {
    name: 'Tanya',
    id: '162204293266'
  },
  {
    name: 'Micah',
    id: '164709020087'
  },
  {
    name: 'Mannix',
    id: '165611179390'
  },
  {
    name: 'Vanna',
    id: '161412204685'
  },
  {
    name: 'Ashton',
    id: '169405186595'
  },
  {
    name: 'Ivor',
    id: '168312195830'
  },
  {
    name: 'Colby',
    id: '164504198237'
  },
  {
    name: 'Orson',
    id: '161710252592'
  },
  {
    name: 'Lynn',
    id: '169512030140'
  },
  {
    name: 'Tamekah',
    id: '166804256268'
  },
  {
    name: 'Emily',
    id: '166012179559'
  },
  {
    name: 'Noel',
    id: '166601048561'
  },
  {
    name: 'Zahir',
    id: '168208139488'
  },
  {
    name: 'Cheryl',
    id: '163901106116'
  },
  {
    name: 'Cade',
    id: '160512111659'
  },
  {
    name: 'Seth',
    id: '168603162101'
  },
  {
    name: 'Clinton',
    id: '164308309063'
  },
  {
    name: 'Flavia',
    id: '169010024553'
  },
  {
    name: 'Adria',
    id: '168006253051'
  },
  {
    name: 'Zephr',
    id: '163206112736'
  },
  {
    name: 'Yen',
    id: '165703273531'
  },
  {
    name: 'Alan',
    id: '163501052082'
  },
  {
    name: 'Benedict',
    id: '166510246439'
  },
  {
    name: 'Nayda',
    id: '162608309833'
  },
  {
    name: 'Berk',
    id: '166111280696'
  },
  {
    name: 'Caryn',
    id: '168107279260'
  },
  {
    name: 'Karleigh',
    id: '165312307811'
  },
  {
    name: 'Maryam',
    id: '165502134421'
  },
  {
    name: 'Adrienne',
    id: '163708197201'
  },
  {
    name: 'Nichole',
    id: '169711104456'
  },
  {
    name: 'Inez',
    id: '162802209649'
  },
  {
    name: 'Ethan',
    id: '169501138961'
  },
  {
    name: 'Xanthus',
    id: '164808076907'
  },
  {
    name: 'Fitzgerald',
    id: '167011170219'
  },
  {
    name: 'Ocean',
    id: '164506265059'
  },
  {
    name: 'Venus',
    id: '164305237002'
  },
  {
    name: 'Nayda',
    id: '162805132442'
  },
  {
    name: 'Aimee',
    id: '167510298446'
  },
  {
    name: 'Guy',
    id: '166212122136'
  },
  {
    name: 'Serina',
    id: '161904105499'
  },
  {
    name: 'Dean',
    id: '162210253304'
  },
  {
    name: 'Omar',
    id: '162607027907'
  },
  {
    name: 'Brent',
    id: '166605209912'
  },
  {
    name: 'Carson',
    id: '163406190326'
  },
  {
    name: 'Magee',
    id: '169012246832'
  },
  {
    name: 'Vera',
    id: '165507309499'
  },
  {
    name: 'Connor',
    id: '161001129582'
  },
  {
    name: 'Stella',
    id: '161011046651'
  },
  {
    name: 'Reese',
    id: '161310123789'
  },
  {
    name: 'Bevis',
    id: '167703034178' 	}
];

@Injectable({
  providedIn: 'root'
})
export class AutocompleteTableService {

  constructor() { }

  fetchData(params: SearchParams): Observable<ListData> {
    const paginationData = params.paginationData || {} as PaginationData;
    const initialIndex = paginationData.pageIndex * paginationData.pageSize;
    const endIndex = initialIndex + paginationData.pageSize;
    let data = dbData.filter(row => Object.values(row).some(value => params.searchTerm && this.includes(value, params.searchTerm)));
    const totalRecords = data.length;
    data = data.slice(initialIndex, endIndex);

    return of({
      tableData: data,
      paginationData: {
        totalRecords,
        pageIndex: paginationData.pageIndex || 0,
        pageSize: paginationData.pageSize || 10
      }
    });
  }

   private includes(str: string, substr: string): boolean {
    return this.normalize(str).includes(this.normalize(substr));
  }

  private normalize(str: string): string {
    return str.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
