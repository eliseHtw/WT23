import { Injectable } from '@angular/core';
import { Member } from './member'

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor() { }

  async getAllMembers(): Promise<Member[]> {
    let response = await fetch('../../assets/members.json')
    console.log('in service --> response', response)
    let membersArray = await response.json();
    console.log('in service --> membersArray', membersArray)
    return membersArray;
  }
}
